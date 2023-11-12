import DefineUser from './user';
import DefinePocket from './pocket';
import DefinePocketGroup from './pocketGroup';
import DefineTag from './tag';
import DefineTransaction from './transaction';

export default async function DefineModels(sequelize: any) {
    // define models
    const User = await DefineUser(sequelize);
    const Pocket = await DefinePocket(sequelize);
    const PocketGroup = await DefinePocketGroup(sequelize);
    const Tag = await DefineTag(sequelize);
    const Transaction = await DefineTransaction(sequelize);

    // define relationships
    User.hasMany(Pocket, { foreignKey: 'userId' });
    Pocket.belongsTo(User, { foreignKey: 'userId' });

    User.hasMany(PocketGroup, { foreignKey: 'userId' });
    PocketGroup.belongsTo(User, { foreignKey: 'userId' });

    PocketGroup.hasMany(Pocket, { foreignKey: 'groupId' });
    Pocket.belongsTo(PocketGroup, { foreignKey: 'groupId' });

    User.hasMany(Tag, { foreignKey: 'userId' });
    Tag.belongsTo(User, { foreignKey: 'userId' });

    User.hasMany(Transaction, { foreignKey: 'userId' });
    Transaction.belongsTo(User, { foreignKey: 'userId' });

    // Pocket can be linked to a Transaction as either an inflow or outflow
    // See note in src/models/transaction.ts for more details
    Pocket.hasMany(Transaction, { foreignKey: 'inflowId' });
    Transaction.belongsTo(Pocket, { foreignKey: 'inflowId' });
    Pocket.hasMany(Transaction, { foreignKey: 'outflowId' });
    Transaction.belongsTo(Pocket, { foreignKey: 'outflowId' });

    // sync models to database
    await sequelize.sync({ alter: true });
}
