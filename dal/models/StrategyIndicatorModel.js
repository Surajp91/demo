// const { DataTypes } = require('sequelize');
// const sequelize = require('../../config/database'); // Adjust the path according to your setup
// const IndicatorMasterModel = require('./IndicatorMasterModel');

// const StrategyIndicatorModel = sequelize.define('StrategyIndicatorModel', {
//   str_indi_id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//     allowNull: false,
//   },
//   strategy_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   user_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   indicator_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   param_name: {
//     type: DataTypes.TEXT,
//     allowNull: true,
//   },
//   param_value: {
//     type: DataTypes.TEXT,
//     allowNull: true,
//   },
//   created_by: {
//     type: DataTypes.TEXT,
//     allowNull: true,
//   },
//   created_date: {
//     type: DataTypes.DATE,
//     allowNull: true,
//   },
//   updated_by: {
//     type: DataTypes.TEXT,
//     allowNull: true,
//   },
//   updated_date: {
//     type: DataTypes.DATE,
//     allowNull: true,
//   },
//   is_deleted: {
//     type: DataTypes.BOOLEAN,
//     allowNull: true,
//   },
// }, {
//   tableName: 'strategy_indicators',
//   timestamps: false, // Set to true if you want Sequelize to manage `createdAt` and `updatedAt` fields

  
// });

//   // Define associations
//   StrategyIndicatorModel.belongsTo(IndicatorMasterModel, {
//     foreignKey: 'indicator_id',
//     as: 'indicator'
//   });
// module.exports = StrategyIndicatorModel;


const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database'); // Adjust the path as needed
const IndicatorMasterModel = require('./IndicatorMasterModel'); // Import the IndicatorMasterModel

const StrategyIndicatorModel = sequelize.define('StrategyIndicatorModel', {
  str_indi_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  strategy_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  indicator_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  param_name: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  param_value: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  created_by: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  created_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  updated_by: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  updated_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
}, {
  tableName: 'strategy_indicators',
  timestamps: false,
});

module.exports = StrategyIndicatorModel;

