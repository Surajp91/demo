// models/AvailableBroker.js

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database'); // Adjust the path as needed

const Broker_Master = sequelize.define('Broker_Master', {
    avail_broker_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    logo_url: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    input_fields: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    connection_api: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    market: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'created_at'
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'updated_at',
        onUpdate: DataTypes.NOW
    },
}, {
    tableName: 'broker_master',
    timestamps: false, // Disable automatic timestamps
    underscored: true, // Ensure Sequelize uses snake_case column names
});

module.exports = Broker_Master;
