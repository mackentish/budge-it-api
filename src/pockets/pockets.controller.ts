import Pocket from './pockets.model';
import User from '../users/users.model';
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
        const newPocketData = req.body as { name: string; amount: number };
        const existingPocketData = await Pocket.findById(
            req.params.pocketId
        ).exec();
        if (!existingPocketData) {
            res.status(404).send('Pocket not found');
            return;
        }
        const pocketUser = await User.findById(existingPocketData.user).exec();
        if (!pocketUser) {
            res.status(404).send('User not found');
            return;
        }
        // add funds to pocket
        if (newPocketData.amount > existingPocketData.amount) {
            // validate that there is enough in unallocated to remove
            const amountChanged =
                newPocketData.amount - existingPocketData.amount;
            if (amountChanged > pocketUser.unallocated) {
                res.status(400).send('Insufficient funds in unallocated');
                return;
            } else {
                // remove amountChanged from unallocated
                pocketUser.unallocated -= amountChanged;
                await pocketUser.save();
                // add amountChanged to pocket
                existingPocketData.amount = newPocketData.amount;
                await existingPocketData.save();
                res.status(201).send(existingPocketData);
            }
        }
        // remove funds from pocket
        else {
            // remove funds from pocket and add same amount to unallocated
            const amountChanged =
                existingPocketData.amount - newPocketData.amount;
            pocketUser.unallocated += amountChanged;
            await pocketUser.save();
            existingPocketData.amount = newPocketData.amount;
            await existingPocketData.save();
            res.status(201).send(existingPocketData);
        }
    } catch (err) {
        res.status(500).send(err);
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
        .then(() => {
            res.status(202).send('Pocket has been removed');
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
