import { DataTypes, Sequelize } from 'sequelize';

export default async function DefinePocket(sequelize: Sequelize) {
    const Pocket = await sequelize.define('Pocket', {
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
            allowNull: false,
        },
    });
    console.log('Pocket model created: ', Pocket === sequelize.models.Pocket);
    return Pocket;
}
