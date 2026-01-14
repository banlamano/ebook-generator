const sequelize = require('../config/database');
const User = require('./User');
const Ebook = require('./Ebook');
const Chapter = require('./Chapter');
const Template = require('./Template');
const Subscription = require('./Subscription');
const Payment = require('./Payment');

// Define associations
User.hasMany(Ebook, { foreignKey: 'user_id', as: 'ebooks' });
Ebook.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Ebook.hasMany(Chapter, { foreignKey: 'ebook_id', as: 'chapters', onDelete: 'CASCADE' });
Chapter.belongsTo(Ebook, { foreignKey: 'ebook_id', as: 'ebook' });

User.hasMany(Subscription, { foreignKey: 'user_id', as: 'subscriptions' });
Subscription.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Payment, { foreignKey: 'user_id', as: 'payments' });
Payment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = {
  sequelize,
  User,
  Ebook,
  Chapter,
  Template,
  Subscription,
  Payment
};
