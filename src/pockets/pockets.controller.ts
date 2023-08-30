import Pocket from './pockets.model';
import Group from '../pocketGroups/groups.model';
import { Request, Response } from 'express';
import { getUserFromToken } from '../middleware/authentication';

// GET
async function list(req: Request, res: Response) {
    const user = await getUserFromToken(req);
    return Pocket.find({ user: user._id })
        .then((result) => {
            return res.status(200).send(result);
        })
        .catch((err) => {
            return res.status(500).send(err);
        });
}

async function getById(req: Request, res: Response) {
    return Pocket.findById(req.params.pocketId)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
}

// PUT
async function updateById(req: Request, res: Response) {
    try {
        const user = await getUserFromToken(req);
        const newPocketData = req.body as { name: string; groupId?: string };
        const existingPocketData = await Pocket.findOne({
            _id: req.params.pocketId,
            user: user._id,
        }).exec();
        if (!existingPocketData) {
            return res.status(404).send('Pocket not found');
        }

        // update pocket
        existingPocketData.name = newPocketData.name;
        if (newPocketData.groupId) {
            existingPocketData.groupId = newPocketData.groupId;
            // update group
            const existingGroup = await Group.findOne({
                _id: newPocketData.groupId,
                user: user._id,
            }).exec();
            if (!existingGroup) {
                return res.status(404).send('Group not found');
            }
            existingGroup.pockets.push(existingPocketData);
            await existingGroup.save();
        }
        await existingPocketData.save();
        return res.status(202).send(existingPocketData);
    } catch (err) {
        return res.status(500).send(err);
    }
}

// POST
async function create(req: Request, res: Response) {
    try {
        const user = await getUserFromToken(req);
        const pocket = new Pocket({
            ...req.body,
            user: user._id,
        });
        await pocket.save();
        res.status(201).send(pocket);
    } catch (err) {
        res.status(500).send(err);
    }
}

// DELETE
async function removeAll(req: Request, res: Response) {
    return Pocket.deleteMany({ user: req.params.userId })
        .then(() => {
            res.status(200).send('All pockets have been removed');
        })
        .catch((err) => {
            res.status(500).send(err);
        });
}

async function removeById(req: Request, res: Response) {
    const user = await getUserFromToken(req);
    return Pocket.findOneAndDelete({ _id: req.params.pocketId, user: user._id })
        .then((result) => {
            res.status(202).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
}

export default {
    list,
    getById,
    updateById,
    create,
    removeAll,
    removeById,
};
