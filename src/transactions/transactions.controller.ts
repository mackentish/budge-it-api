import Transaction from './transactions.model';
import { Request, Response } from 'express';
import { getUserFromToken } from '../middleware/authentication';

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
    return Transaction.deleteMany({ user: req.params.userId })
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
    create,
    removeAll,
};
