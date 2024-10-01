// models/Invoice.js

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database'); // Adjust the path as needed
const UserSubscription = require('./UserSubscriptionModel'); // Import the UserSubscription model for the foreign key relationship

const InvoiceModel = sequelize.define('InvoiceModel', {
    invoice_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    invoice_number: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    invoice_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    sub_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: UserSubscription,
            key: 'sub_id',
        },
    },
    is_paid: {
        type: DataTypes.TEXT,
        validate: {
            isIn: [['true', 'false']],
        },
    },
    paid_date: {
        type: DataTypes.DATE,
    },
    amount: {
        type: DataTypes.NUMERIC,
        allowNull: false,
    },
    total_tax: {
        type: DataTypes.NUMERIC,
    },
    net_payable_amount: {
        type: DataTypes.NUMERIC,
    },
    cgst: {
        type: DataTypes.NUMERIC,
    },
    sgst: {
        type: DataTypes.NUMERIC,
    },
    igst: {
        type: DataTypes.NUMERIC,
    },
}, {
    tableName: 'invoices',
    timestamps: false,
});

module.exports = InvoiceModel;

