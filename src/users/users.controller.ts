import User from './users.model';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getUserFromToken, verifyRefresh } from '../middleware/authentication';

// GET
async function list(req: Request, res: Response) {
    return User.find()
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
}

async function getById(req: Request, res: Response) {
    try {
        const user = await User.findById(req.params.userId).exec();
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
    return User.findByIdAndUpdate(req.params.userId, req.body, { new: true })
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
}

// POST
async function insert(req: Request, res: Response) {
    const user = new User({
        ...req.body,
        password: await bcrypt.hash(req.body.password, process.env.SALT!),
    });
    return user
        .save()
        .then((user) => {
            res.status(201).send({
                user: user,
                tokens: generateTokens(user.email),
            });
        })
        .catch((err) => {
            res.status(500).send(err);
        });
}

async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, process.env.SALT!);
        const user = await User.findOne({
            email: email,
            password: hashedPassword,
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
    const user = await getUserFromToken(req);
    return User.findByIdAndUpdate(
        user._id,
        { $push: { tags: req.body.tag } },
        { new: true }
    )
        .then((result) => {
            return res.status(200).send(result);
        })
        .catch((err) => {
            return res.status(500).send(err);
        });
}

function refreshToken(req: Request, res: Response) {
    const { email, refreshToken } = req.body;
    if (!refreshToken || !email) {
        return res.status(400).send('Missing token or email');
    }
    const isValid = verifyRefresh(refreshToken);
    if (!isValid) {
        return res.status(401).send('Invalid token, try login again');
    }
    const tokens = generateTokens(email);
    return res.status(201).send(tokens);
}

// DELETE
async function removeAll(req: Request, res: Response) {
    return User.deleteMany()
        .then(() => {
            res.status(200).send('All users have been removed');
        })
        .catch((err) => {
            res.status(500).send(err);
        });
}

async function removeById(req: Request, res: Response) {
    return User.findByIdAndDelete(req.params.pocketId)
        .then(() => {
            res.status(200).send('User has been removed');
        })
        .catch((err) => {
            res.status(500).send(err);
        });
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
    list,
    getById,
    updateById,
    insert,
    login,
    addTag,
    refreshToken,
    removeAll,
    removeById,
};
