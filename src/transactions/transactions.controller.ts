import Transaction from './transactions.model';
import { Request, Response } from 'express';
import { getUserFromToken } from '../middleware/authentication';

// GET
async function list(req: Request, res: Response) {
    const user = await getUserFromToken(req);
    return Transaction.find({ user: user._id })
        .then((result) => {
            return res.status(200).send(result);
        })
        .catch((err) => {
            return res.status(500).send(err);
        });
}

async function getById(req: Request, res: Response) {
    return Transaction.findById(req.params.transactionId)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.status(500).send(err);
        });
}

// POST
async function create(req: Request, res: Response) {
    try {
        const user = await getUserFromToken(req);
        if (req.body.inflow === req.body.outflow) {
            return res
                .status(400)
                .send('Inflow and outflow cannot be the same');
        }
        const transaction = new Transaction({
            ...req.body,
            user: user._id,
        });
        await transaction.save();
        return res.status(201).send(transaction);
    } catch (err) {
        return res.status(500).send(err);
    }
}

// DELETE
async function removeAll(req: Request, res: Response) {
    const user = await getUserFromToken(req);
    return Transaction.deleteMany({ user: user._id })
        .then(() => {
            return res
                .status(200)
                .send('All transactions have been removed for this user');
        })
        .catch((err) => {
            return res.status(500).send(err);
        });
}

export default {
    list,
    getById,
    create,
    removeAll,
};
