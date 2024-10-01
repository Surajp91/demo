const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database'); // Adjust the path as needed

const UserStrategyModel = sequelize.define('UserStrategyModel', {
  strategy_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  strategy_name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  completed_stages: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  execution_status: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  required_fund: {
    type: DataTypes.NUMERIC,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  is_complete: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: true, // Adjust as needed
    defaultValue: false // Adjust as needed
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false // Default value set to false
  }
}, {
  tableName: 'user_strategies',
  timestamps: false
});

module.exports = UserStrategyModel;
