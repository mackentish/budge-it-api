import { Schema, model } from 'mongoose';

export interface IPocket {
    name: string;
    amount: number;
    user: string;
    note?: string;
    groupId?: string;
}

const pocketSchema = new Schema<IPocket>(
    {
        name: { type: String, required: true },
        amount: { type: Number, required: true },
        user: { type: String, required: true },
        note: { type: String, required: false },
        groupId: { type: String, required: false },
    },
    { timestamps: true }
);

export default model<IPocket>('Pockets', pocketSchema);
