import { DataTypes, Sequelize } from 'sequelize';

export default async function DefineTag(sequelize: Sequelize) {
    const Tag = await sequelize.define('Tag', {
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
    });
    console.log('Tag model created: ', Tag === sequelize.models.Tag);
    return Tag;
}
