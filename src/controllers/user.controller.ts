import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getUserFromToken, verifyRefresh } from '../middleware/authentication';
import { Tag, User, UserType } from '../models';

// GET
async function getById(req: Request, res: Response) {
    try {
        const user = await User.findByPk(req.params.userId);
        if (user) {
            res.status(200).send(user);
        } else {
            res.status(401).send('User not found');
        }
    } catch (err) {
        res.status(500).send(err);
    }
}

// PUT
async function updateById(req: Request, res: Response) {
    try {
        const user = await getUserFromToken(req);
        const { firstName, lastName, email, password } = req.body as UserType;
        const updatedUser = await User.update(
            {
                firstName,
                lastName,
                email,
                password: await bcrypt.hash(password, process.env.SALT!),
            },
            {
                where: { id: user.id },
            }
        );
        return res.status(200).send(updatedUser);
    } catch (err) {
        return res.status(500).send(err);
    }
}

function findAndReplaceTag(tags: string[], oldTag: string, newTag: string) {
    const index = tags.indexOf(oldTag);
    if (index !== -1) {
        tags[index] = newTag;
    }
    return tags;
}
async function updateTag(req: Request, res: Response) {
    try {
        const user = await getUserFromToken(req);
        const { oldTag, newTag } = req.body as {
            oldTag: string;
            newTag: string;
        };
        const userTags = await Tag.findAll({
            where: { userId: user.id },
        });
        const updatedUser = await User.update(
            {
                tags: findAndReplaceTag(
                    userTags.map((t) => t.name),
                    oldTag,
                    newTag
                ),
            },
            {
                where: { id: user.id },
            }
        );
        return res.status(200).send(updatedUser);
    } catch (err) {
        return res.status(500).send(err);
    }
}

// POST
async function insert(req: Request, res: Response) {
    try {
        const { firstName, lastName, email, password } = req.body as UserType;
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: await bcrypt.hash(password, process.env.SALT!),
        });
        return res.status(201).send({
            user: user,
            tokens: generateTokens(user.email),
        });
    } catch (err) {
        return res.status(500).send(err);
    }
}

async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, process.env.SALT!);
        const user = await User.findOne({
            where: {
                email: email,
                password: hashedPassword,
            },
        });
        if (user) {
            res.status(200).send({
                user: user,
                tokens: generateTokens(email),
            });
        } else {
            res.status(401).send('User not found');
        }
    } catch (err) {
        res.status(500).send(err);
    }
}

async function addTag(req: Request, res: Response) {
    try {
        const user = await getUserFromToken(req);
        const tag = await Tag.create({
            name: req.body.tag,
            userId: user.id,
        });
        return res.status(200).send(tag);
    } catch (err) {
        return res.status(500).send(err);
    }
}

function refreshToken(req: Request, res: Response) {
    const { email, refreshToken } = req.body;
    if (!refreshToken || !email) {
        return res.status(400).send('Missing token or email');
    }
    const isValid = verifyRefresh(refreshToken, email);
    if (!isValid) {
        return res.status(401).send('Invalid token, try login again');
    }
    const tokens = generateTokens(email);
    return res.status(201).send(tokens);
}

// DELETE
async function removeAll(req: Request, res: Response) {
    try {
        await User.destroy();
        return res.status(200).send('All users have been removed');
    } catch (err) {
        return res.status(500).send(err);
    }
}

async function removeById(req: Request, res: Response) {
    try {
        await User.destroy({ where: { id: req.params.userId } });
        return res.status(200).send('User has been removed');
    } catch (err) {
        return res.status(500).send(err);
    }
}

// Helpers
function generateTokens(email: string) {
    const accessToken = jwt.sign(
        { email: email },
        process.env.ACCESS_TOKEN_SECRET!,
        {
            expiresIn: process.env.NODE_ENV === 'development' ? '15m' : '2m',
        }
    );
    const refreshToken = jwt.sign(
        { email: email },
        process.env.REFRESH_TOKEN_SECRET!,
        {
            expiresIn: process.env.NODE_ENV === 'development' ? '30m' : '10m',
        }
    );
    return { accessToken, refreshToken };
}

export default {
    getById,
    updateById,
    updateTag,
    insert,
    login,
    addTag,
    refreshToken,
    removeAll,
    removeById,
};
