import { DataTypes, Model } from 'sequelize';
import sequelize from './sequelize';

export class PocketGroup extends Model {
    public id!: number;
    public name!: string;
    public note?: string;
    public userId!: number;
}

PocketGroup.init(
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
        note: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        //foreign keys
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'PocketGroup',
    }
);

export type PocketGroupType = InstanceType<typeof PocketGroup>;
