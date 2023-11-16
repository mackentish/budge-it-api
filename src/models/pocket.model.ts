import { DataTypes, Model } from 'sequelize';
import sequelize from './sequelize';

export class Pocket extends Model {
    public id!: number;
    public name!: string;
    public amount!: number;
    public note?: string;
    public userId!: number;
    public groupId?: number;
}

Pocket.init(
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
        note: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        //foreign keys
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        groupId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'Pocket',
    }
);

export type PocketType = InstanceType<typeof Pocket>;
