import { Schema, model } from 'mongoose';

export interface ITransaction {
    user: string;
    name: string;
    amount: number;
    date: Date;
    /** Pocket ID or 'external' if not coming from a pocket.
     * This is where the money is coming _from_
     */
    inflow: string;
    /** Pocket ID or 'external' if not coming from a pocket.
     * This is where the money is going _to_
     */
    outflow: string;
    tags?: string[];
    note?: string;
}

const transactionSchema = new Schema<ITransaction>(
    {
        user: { type: String, required: true },
        name: { type: String, required: true },
        amount: { type: Number, required: true },
        date: { type: Date, required: true },
        inflow: { type: String, required: true },
        outflow: { type: String, required: true },
        tags: { type: [String], required: false, default: [] },
        note: { type: String, required: false },
    },
    { timestamps: false }
);

export default model<ITransaction>('Transactions', transactionSchema);
