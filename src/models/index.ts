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
    User.hasMany(Pocket, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
    });
    Pocket.belongsTo(User, { foreignKey: 'userId' });

    User.hasMany(PocketGroup, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
    });
    PocketGroup.belongsTo(User, { foreignKey: 'userId' });

    PocketGroup.hasMany(Pocket, {
        foreignKey: 'groupId',
        onDelete: 'SET NULL',
    });
    Pocket.belongsTo(PocketGroup, {
        foreignKey: 'groupId',
    });

    User.hasMany(Tag, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
    });
    Tag.belongsTo(User, { foreignKey: 'userId' });

    User.hasMany(Transaction, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
    });
    Transaction.belongsTo(User, { foreignKey: 'userId' });

    // Pocket can be linked to a Transaction as either an inflow or outflow
    // See note in src/models/transaction.ts for more details
    Pocket.hasMany(Transaction, {
        foreignKey: 'inflowId',
        onDelete: 'SET NULL',
    });
    Transaction.belongsTo(Pocket, {
        foreignKey: 'inflowId',
    });
    Pocket.hasMany(Transaction, {
        foreignKey: 'outflowId',
        onDelete: 'SET NULL',
    });
    Transaction.belongsTo(Pocket, {
        foreignKey: 'outflowId',
    });

    // sync models to database
    await sequelize.sync({ alter: true });

    // verify models are synced
    if (User !== sequelize.models.user) {
        throw new Error('User model not synced properly');
    } else if (Pocket !== sequelize.models.pocket) {
        throw new Error('Pocket model not synced properly');
    } else if (PocketGroup !== sequelize.models.pocketGroup) {
        throw new Error('PocketGroup model not synced properly');
    } else if (Tag !== sequelize.models.tag) {
        throw new Error('Tag model not synced properly');
    } else if (Transaction !== sequelize.models.transaction) {
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
