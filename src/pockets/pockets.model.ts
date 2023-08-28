import { Schema, model } from 'mongoose';

export interface IPocket {
    name: string;
    amount: number;
    user: string;
    groupId?: string;
}

const pocketSchema = new Schema<IPocket>(
    {
        name: { type: String, required: true },
        amount: { type: Number, required: true },
        user: { type: String, required: true },
        groupId: { type: String, required: false },
    },
    { timestamps: true }
);

export default model<IPocket>('Pockets', pocketSchema);
