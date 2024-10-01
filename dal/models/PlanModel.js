// models/Plan.js

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const PlanModel = sequelize.define('PlanModel', {
    plan_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    plan_name: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    price: {
        type: DataTypes.NUMERIC,
        allowNull: false,
    },
    period_in_month: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    created_by: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    created_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
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
        defaultValue: false,
    },
}, {
    tableName: 'plan_master',
    timestamps: false,
});

module.exports = PlanModel;

