import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { getUserFromToken } from '../middleware/authentication';
import { PocketGroup, Pocket } from '../models';

// GET
async function list(req: Request, res: Response) {
    try {
        const user = await getUserFromToken(req);
        const pocketGroups = await PocketGroup.findAll({
            where: { userId: user.id },
            include: { model: Pocket, required: true },
        });
        return res.status(200).send(pocketGroups);
    } catch (err) {
        return res.status(500).send(err);
    }
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
        const pockets = await Pocket.findAll({
            where: { id: { [Op.in]: newGroupData.pockets }, userId: user.id },
        });
        if (pockets.length !== newGroupData.pockets.length) {
            return res.status(400).send('One or more pocket ids are invalid');
        }
        // validate that pockets are not already in a group
        const pocketsInOtherGroups = pockets.filter((p) => !!p.groupId);
        if (pocketsInOtherGroups.length > 0) {
            return res
                .status(400)
                .send('One or more pockets are already in a group');
        }

        // if all validations pass, create group and update pockets
        const newGroup = await PocketGroup.create({
            name: newGroupData.name,
            note: newGroupData.note,
            userId: user.id,
        });
        await Pocket.update(
            {
                groupId: newGroup.id,
            },
            {
                where: { id: { [Op.in]: newGroupData.pockets } },
            }
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
        await PocketGroup.destroy({
            where: {
                userId: user.id,
                id: req.params.pocketGroupsId,
            },
        });
        res.status(202).send('Group has been removed');
    } catch (err) {
        return res.status(500).send(err);
    }
}

async function removeAll(req: Request, res: Response) {
    try {
        const user = await getUserFromToken(req);
        const deletedCount = await PocketGroup.destroy({
            where: { userId: user.id },
        });
        res.status(202).send(`Deleted ${deletedCount} groups`);
    } catch (err) {
        res.status(500).send(err);
    }
}

export default { list, create, removeById, removeAll };
