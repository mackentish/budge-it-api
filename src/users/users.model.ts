import { Schema, model } from 'mongoose';
import { IPocket } from '../pockets/pockets.model';

export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    unallocated: number;
}

const userSchema = new Schema<IUser>(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: { type: String, required: true },
        unallocated: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default model<IUser>('Users', userSchema);
