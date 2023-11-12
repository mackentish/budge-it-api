import { DataTypes, Sequelize } from 'sequelize';

export default async function DefineTransaction(sequelize: Sequelize) {
    const Transaction = await sequelize.define('Transaction', {
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
    });
    console.log(
        'Transaction model created: ',
        Transaction === sequelize.models.Transaction
    );
    return Transaction;
}
