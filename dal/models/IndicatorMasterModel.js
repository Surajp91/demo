// const { DataTypes } = require('sequelize');
// const sequelize = require('../../config/database'); // Adjust the path as needed
// const StrategyIndicatorModel = require('./StrategyIndicatorModel');

// const IndicatorMasterModel = sequelize.define('IndicatorMasterModel', {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   // Add other fields as needed
// }, {
//   tableName: 'indicator_master',
//   timestamps: false,
// });

// // Define associations
// // Define associations
// IndicatorMasterModel.hasMany(require('./StrategyIndicatorModel'), {
//   foreignKey: 'indicator_id',
//   as: 'indicators'
// });

// module.exports = IndicatorMasterModel;



const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database'); // Adjust the path as needed

const IndicatorMasterModel = sequelize.define('IndicatorMasterModel', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  // Add other fields as needed
}, {
  tableName: 'indicator_master',
  timestamps: false,
});

module.exports = IndicatorMasterModel;
