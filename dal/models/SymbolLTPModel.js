// models/BrokerSymbolLTP.js

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database'); // Adjust the path as needed

const SymbolLTPModel  = sequelize.define('SymbolLTPModel ', {
    ltp_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    ticker_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    ticker_symbol: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    price: {
        type: DataTypes.NUMERIC,
        allowNull: false,
    },
    time_stamp: {
        type: DataTypes.TIME,
        allowNull: false,
    },
}, {
    tableName: 'broker_symbol_ltp',
    timestamps: false,
});

module.exports = SymbolLTPModel ;
