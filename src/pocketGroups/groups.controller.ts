import Group from './groups.model';
import User from '../users/users.model';
import Pocket from '../pockets/pockets.model';
import { Request, Response } from 'express';
import { IGroup } from './groups.model';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { extractEmailFromToken } from '../middleware/authentication';

// GET
async function list(req: Request, res: Response) {
    let userEmail: string;
    try {
        userEmail = extractEmailFromToken(req);
    } catch {
        return res.status(401).json('Not authorized');
    }
    const user = await User.findOne({ email: userEmail });
    if (!user) {
        return res.status(401).send('User not found');
    }
    return Group.find({ user: user._id })
        .populate('pockets')
        .then((result: IGroup[]) => {
            res.status(200).send(result);
        })
        .catch((err: any) => {
            res.status(500).send(err);
        });
}

// POST
interface ICreateGroupRequest {
    name: string;
    note?: string;
    pockets: string[];
}
async function create(req: Request, res: Response) {
    try {
        let userEmail: string;
        try {
            userEmail = extractEmailFromToken(req);
        } catch {
            return res.status(401).json('Not authorized');
        }
        const newGroupData = req.body as ICreateGroupRequest;
        // validate data
        if (
            !newGroupData.name ||
            !newGroupData.pockets ||
            newGroupData.pockets.length === 0
        ) {
            return res.status(400).send('Missing required fields');
        }
        // validate that pockets exist and belong to user
        // validate that pockets are not already in a group
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(401).send('User not found');
        }

        // validate pocket ids
        const pockets = await Pocket.find({
            _id: { $in: newGroupData.pockets },
            user: user._id,
        });
        if (pockets.length !== newGroupData.pockets.length) {
            return res.status(400).send('One or more pocket ids are invalid');
        }
        // validate that pockets are not already in a group
        const pocketsInGroup = await Pocket.find({
            _id: { $in: newGroupData.pockets },
            groupId: { $ne: null },
        });
        if (pocketsInGroup.length > 0) {
            return res
                .status(400)
                .send('One or more pockets are already in a group');
        }

        // if all validations pass, create group and update pockets
        const newGroup = await Group.create({
            ...newGroupData,
            user: user._id,
        });
        await Pocket.updateMany(
            { _id: { $in: newGroupData.pockets } },
            { groupId: newGroup._id }
        );
        return res.status(201).send('Group created');
    } catch (err) {
        return res.status(500).send(err);
    }
}

// DELETE
async function removeAll(req: Request, res: Response) {
    try {
        const { deletedCount } = await Group.deleteMany({});
        const { matchedCount } = await Pocket.updateMany(
            { groupId: { $ne: undefined } },
            { groupId: null }
        );
        res.status(200).send(
            `Deleted ${deletedCount} groups and updated ${matchedCount} pockets`
        );
    } catch (err) {
        res.status(500).send(err);
    }
}

export default { list, create, removeAll };
