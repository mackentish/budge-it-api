import { DataTypes, Sequelize } from 'sequelize';

export default async function DefinePocketGroup(sequelize: Sequelize) {
    const PocketGroup = await sequelize.define('PocketGroup', {
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
    });
    console.log(
        'PocketGroup model created: ',
        PocketGroup === sequelize.models.PocketGroup
    );
    return PocketGroup;
}
