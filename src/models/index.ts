import { User, UserType } from './user.model';
import { Pocket, PocketType } from './pocket.model';
import { PocketGroup, PocketGroupType } from './pocketGroup.model';
import { Tag, TagType } from './tag.model';
import { Transaction, TransactionType } from './transaction.model';
import sequelize from './sequelize';

export default async function SyncModels() {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

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

    // verify models are synced
    if (User !== sequelize.models.User) {
        throw new Error('User model not synced properly');
    } else if (Pocket !== sequelize.models.Pocket) {
        throw new Error('Pocket model not synced properly');
    } else if (PocketGroup !== sequelize.models.PocketGroup) {
        throw new Error('PocketGroup model not synced properly');
    } else if (Tag !== sequelize.models.Tag) {
        throw new Error('Tag model not synced properly');
    } else if (Transaction !== sequelize.models.Transaction) {
        throw new Error('Transaction model not synced properly');
    }
    console.log('Models synced successfully.');
}

export {
    sequelize,
    User,
    UserType,
    Pocket,
    PocketType,
    PocketGroup,
    PocketGroupType,
    Tag,
    TagType,
    Transaction,
    TransactionType,
};
