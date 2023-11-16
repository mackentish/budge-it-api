import { DataTypes, Model } from 'sequelize';
import sequelize from './sequelize';

export class Tag extends Model {
    public id!: number;
    public name!: string;
    public userId!: number;
}

Tag.init(
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
        //foreign keys
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Tag',
    }
);

export type TagType = InstanceType<typeof Tag>;
