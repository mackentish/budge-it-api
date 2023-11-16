import { Request, Response } from 'express';
import { getUserFromToken } from '../middleware/authentication';
import { Pocket } from '../models';

// GET
async function list(req: Request, res: Response) {
    try {
        const user = await getUserFromToken(req);
        const pockets = await Pocket.findAll({ where: { userId: user.id } });
        return res.status(200).send(pockets);
    } catch (err) {
        return res.status(500).send(err);
    }
}

async function getById(req: Request, res: Response) {
    try {
        const user = await getUserFromToken(req);
        const pocket = await Pocket.findOne({
            where: { id: req.params.pocketId, userId: user.id },
        });
        if (!pocket) {
            return res.status(404).send('Pocket not found');
        }
        return res.status(200).send(pocket);
    } catch (err) {
        return res.status(500).send(err);
    }
}

// PUT
async function updateById(req: Request, res: Response) {
    try {
        const user = await getUserFromToken(req);
        const newPocketData = req.body as { name: string; groupId?: number };
        const existingPocketData = await Pocket.findOne({
            where: {
                id: req.params.pocketId,
                userId: user.id,
            },
        });
        if (!existingPocketData) {
            return res.status(404).send('Pocket not found');
        }

        // update pocket
        existingPocketData.name = newPocketData.name;
        if (newPocketData.groupId) {
            existingPocketData.groupId = newPocketData.groupId;
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
        const newPocketData = req.body as {
            name: string;
            amount: number;
            note?: string;
            groupId?: number;
        };
        const pocket = await Pocket.create({
            ...newPocketData,
            userId: user.id,
        });
        res.status(201).send(pocket);
    } catch (err) {
        res.status(500).send(err);
    }
}

// DELETE
async function removeAll(req: Request, res: Response) {
    try {
        const user = await getUserFromToken(req);
        await Pocket.destroy({ where: { userId: user.id } });
        return res.status(200).send('All pockets have been removed');
    } catch (err) {
        return res.status(500).send(err);
    }
}

async function removeById(req: Request, res: Response) {
    try {
        const user = await getUserFromToken(req);
        await Pocket.destroy({
            where: {
                id: req.params.pocketId,
                userId: user.id,
            },
        });
        res.status(202).send('Pocket has been removed');
    } catch (err) {
        res.status(500).send(err);
    }
}

export default {
    list,
    getById,
    updateById,
    create,
    removeAll,
    removeById,
};
