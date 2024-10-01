// models/subscriptionModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database'); // Adjust the path to your sequelize instance

const SubscriptionModel = sequelize.define('SubscriptionModel', {
  subscription_id: {
    type: DataTypes.INTEGER, // Auto-incrementing integer
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  strategy_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  subscribe_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  amount: {
    type: DataTypes.NUMERIC,
    allowNull: false
  },
  period_months: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  expiry_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  payment_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  payment_mode: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
}, {
  tableName: 'subscriptions',
  timestamps: false
});

module.exports = SubscriptionModel;
