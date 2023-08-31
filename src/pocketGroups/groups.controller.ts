import Group from './groups.model';
import User from '../users/users.model';
import Pocket from '../pockets/pockets.model';
import { Request, Response } from 'express';
import { IGroup } from './groups.model';
import { getUserFromToken } from '../middleware/authentication';

// GET
async function list(req: Request, res: Response) {
    const user = await getUserFromToken(req);
    return Group.find({ user: user._id })
        .populate('pockets')
        .then((result: IGroup[]) => {
            return res.status(200).send(result);
        })
        .catch((err: any) => {
            return res.status(500).send(err);
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
        const user = await getUserFromToken(req);
        const newGroupData = req.body as ICreateGroupRequest;
        // validate data
        if (
            !newGroupData.name ||
            !newGroupData.pockets ||
            newGroupData.pockets.length === 0
        ) {
            return res.status(400).send('Missing required fields');
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
        return res.status(201).send(newGroup);
    } catch (err) {
        return res.status(500).send(err);
    }
}

// DELETE
async function removeById(req: Request, res: Response) {
    try {
        const user = await getUserFromToken(req);
        const deletedGroup = await Group.findOneAndDelete({
            user: user._id,
            _id: req.params.groupId,
        });
        await Pocket.updateMany(
            { groupId: req.params.groupId },
            { groupId: null }
        );
        res.status(202).send(deletedGroup);
    } catch (err) {
        return res.status(500).send(err);
    }
}

async function removeAll(req: Request, res: Response) {
    try {
        const { deletedCount } = await Group.deleteMany({});
        const { matchedCount } = await Pocket.updateMany(
            { groupId: { $ne: undefined } },
            { groupId: null }
        );
        res.status(202).send(
            `Deleted ${deletedCount} groups and updated ${matchedCount} pockets`
        );
    } catch (err) {
        res.status(500).send(err);
    }
}

export default { list, create, removeById, removeAll };
