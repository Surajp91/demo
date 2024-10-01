const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database'); // Adjust the path as needed

const StrategySymbolModel = sequelize.define('StrategySymbolModel', {
  str_sym_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  strategy_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  exchange: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  symbol: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'strategy_symbols', // Specify the table name explicitly
  timestamps: false // Disable createdAt and updatedAt fields
});


module.exports = StrategySymbolModel;
