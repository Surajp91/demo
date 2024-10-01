
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database'); // Adjust the path as needed

const UniqueSymbolsData = sequelize.define('UniqueSymbolsData', {
    uni_sym_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    symbol: {
        type: DataTypes.STRING,
        allowNull: false
    },
    exchange_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    security_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'unique_symbols_data',
    timestamps: false
});

module.exports = { UniqueSymbolsData, sequelize };
