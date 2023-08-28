import { Schema, model } from 'mongoose';
import { IPocket } from '../pockets/pockets.model';

export interface IGroup {
    name: string;
    note?: string;
    user: string;
    pockets: IPocket[];
}

const groupSchema = new Schema<IGroup>(
    {
        name: { type: String, required: true },
        note: { type: String, required: false },
        user: { type: String, required: true },
        pockets: [{ type: Schema.Types.ObjectId, ref: 'Pockets' }],
    },
    { timestamps: true }
);

export default model<IGroup>('Groups', groupSchema);
