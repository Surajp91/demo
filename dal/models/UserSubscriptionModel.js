// models/UserSubscription.js

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database'); // Adjust the path as needed
const UserMaster = require('./UserMasterModel'); // Import the UserMaster model for the foreign key relationship

const UserSubscriptionModel = sequelize.define('UserSubscriptionModel', {
    sub_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: UserMaster,
            key: 'user_id',
        },
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    amount: {
        type: DataTypes.NUMERIC,
        allowNull: false,
    },
    period_in_months: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    expiry_date: {
        type: DataTypes.DATE,
    },
    payment_mode: {
        type: DataTypes.TEXT,
    },
    payment_ref_id: {
        type: DataTypes.TEXT,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    tableName: 'user_subscriptions',
    timestamps: false,
});

module.exports = UserSubscriptionModel;
