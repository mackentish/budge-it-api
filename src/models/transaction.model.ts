import { DataTypes, Model } from 'sequelize';
import sequelize from './sequelize';

export class Transaction extends Model {
    public id!: number;
    public name!: string;
    public amount!: number;
    public date!: Date;
    public note?: string;
    public userId!: number;
    public inflowId?: number;
    public outflowId?: number;
}

Transaction.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        note: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        //foreign keys
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        inflowId: {
            type: DataTypes.INTEGER,
            /* NOTE: allow null to allow for 'external' transactions.
             * Will need to assert in business logic that if inflowId
             * is null, outflowId must be defined
             */
            allowNull: true,
        },
        outflowId: {
            type: DataTypes.INTEGER,
            /* NOTE: allow null to allow for 'external' transactions.
             * Will need to assert in business logic that if outflowId
             * is null, inflowId must be defined
             */
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'Transaction',
    }
);

export type TransactionType = InstanceType<typeof Transaction>;
