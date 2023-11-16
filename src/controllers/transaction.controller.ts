import { Request, Response } from 'express';
import { literal } from 'sequelize';
import { getUserFromToken } from '../middleware/authentication';
import { Transaction, Pocket, TransactionType } from '../models';

// GET
async function list(req: Request, res: Response) {
    try {
        const user = await getUserFromToken(req);
        const transactions = await Transaction.findAll({
            where: { userId: user.id },
        });
        return res.status(200).send(transactions);
    } catch (err) {
        return res.status(500).send(err);
    }
}

async function getById(req: Request, res: Response) {
    try {
        const user = await getUserFromToken(req);
        const transaction = await Transaction.findOne({
            where: { id: req.params.transactionId, userId: user.id },
        });
        if (!transaction) {
            return res.status(404).send('Transaction not found');
        }
        return res.status(200).send(transaction);
    } catch (err) {
        return res.status(500).send(err);
    }
}

// POST
async function create(req: Request, res: Response) {
    try {
        const user = await getUserFromToken(req);
        const { inflowId, outflowId } = req.body as TransactionType;
        if (inflowId === outflowId) {
            return res
                .status(400)
                .send('Inflow and outflow cannot be the same');
        } else if (!inflowId && !outflowId) {
            return res
                .status(400)
                .send('Inflow and outflow cannot both be empty');
        }
        const transaction = await Transaction.create({
            ...req.body,
            userId: user.id,
        });

        // decrease the amount in the inflow pocket
        if (!!transaction.inflowId) {
            Pocket.update(
                {
                    amount: literal(`amount - ${transaction.amount}`),
                },
                { where: { id: transaction.inflowId } }
            );
        }

        // increase the amount in the outflow pocket
        if (!!transaction.outflowId) {
            Pocket.update(
                {
                    amount: literal(`amount + ${transaction.amount}`),
                },
                { where: { id: transaction.outflowId } }
            );
        }

        return res.status(201).send(transaction);
    } catch (err) {
        return res.status(500).send(err);
    }
}

// DELETE
async function removeAll(req: Request, res: Response) {
    try {
        const user = await getUserFromToken(req);
        await Transaction.destroy({ where: { userId: user.id } });
        return res
            .status(200)
            .send('All transactions have been removed for this user');
    } catch (err) {
        return res.status(500).send(err);
    }
}

export default {
    list,
    getById,
    create,
    removeAll,
};
