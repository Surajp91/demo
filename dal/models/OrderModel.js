// models/Order.js

// const { DataTypes } = require('sequelize');
// const sequelize = require('../../config/database');

// const OrderModel = sequelize.define('OrderModel', {
//     order_id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//         allowNull: false,
//     },
//     strategy_id: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//     },
//     user_id: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//     },
//     main_order_id: {
//         type: DataTypes.TEXT,
//         allowNull: true,
//     },
//     order_category: {
//         type: DataTypes.TEXT,
//         allowNull: true,
//     },
//     broker_client_id: {
//         type: DataTypes.TEXT,
//         allowNull: true,
//     },
//     broker_order_id: {
//         type: DataTypes.TEXT,
//         allowNull: true,
//     },
//     correlation_id: {
//         type: DataTypes.TEXT,
//         allowNull: true,
//     },
//     order_status: {
//         type: DataTypes.TEXT,
//         allowNull: true,
//     },
//     transaction_type: {
//         type: DataTypes.TEXT,
//         allowNull: true,
//     },
//     exchange_segment: {
//         type: DataTypes.TEXT,
//         allowNull: true,
//     },
//     product_type: {
//         type: DataTypes.TEXT,
//         allowNull: true,
//     },
//     order_type: {
//         type: DataTypes.TEXT,
//         allowNull: true,
//     },
//     validity: {
//         type: DataTypes.TEXT,
//         allowNull: true,
//     },
//     trading_symbol: {
//         type: DataTypes.TEXT,
//         allowNull: true,
//     },
//     security_id: {
//         type: DataTypes.TEXT,
//         allowNull: true,
//     },
//     quantity: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//     },
//     disclosed_quantity: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//     },
//     execution_price: {
//         type: DataTypes.NUMERIC,
//         allowNull: true,
//     },
//     trigger_price: {
//         type: DataTypes.NUMERIC,
//         allowNull: true,
//     },
//     is_amo: {
//         type: DataTypes.BOOLEAN,
//         allowNull: true,
//     },
//     bo_profit_value: {
//         type: DataTypes.NUMERIC,
//         allowNull: true,
//     },
//     bo_stop_loss_value: {
//         type: DataTypes.NUMERIC,
//         allowNull: true,
//     },
//     leg_name: {
//         type: DataTypes.TEXT,
//         allowNull: true,
//     },
//     create_time: {
//         type: DataTypes.DATE,
//         allowNull: true,
//     },
//     update_time: {
//         type: DataTypes.DATE,
//         allowNull: true,
//     },
//     exchange_time: {
//         type: DataTypes.DATE,
//         allowNull: true,
//     },
//     drv_expiry_date: {
//         type: DataTypes.DATE,
//         allowNull: true,
//     },
//     drv_option_type: {
//         type: DataTypes.TEXT,
//         allowNull: true,
//     },
//     drv_strike_price: {
//         type: DataTypes.NUMERIC,
//         allowNull: true,
//     },
//     oms_error_code: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//     },
//     oms_error_description: {
//         type: DataTypes.TEXT,
//         allowNull: true,
//     },
//     filled_qty: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//     },
//     algo_id: {
//         type: DataTypes.TEXT,
//         allowNull: true,
//     },
//     net_pnl: {
//         type: DataTypes.NUMERIC,
//         allowNull: true,
//     },
//     pnl: {
//         type: DataTypes.NUMERIC,
//         allowNull: true,
//     },
// }, {
//     tableName: 'orders',
//     timestamps: false,
// });

// module.exports = OrderModel;



const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const OrderModel = sequelize.define('OrderModel', {
    order_id: {
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
    main_order_id: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    order_category: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    broker_client_id: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    broker_order_id: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    correlation_id: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    order_status: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    transaction_type: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    exchange_segment: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    product_type: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    order_type: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    validity: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    trading_symbol: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    security_id: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    disclosed_quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    execution_price: {
        type: DataTypes.NUMERIC,
        allowNull: true,
    },
    trigger_price: {
        type: DataTypes.NUMERIC,
        allowNull: true,
    },
    is_amo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    bo_profit_value: {
        type: DataTypes.NUMERIC,
        allowNull: true,
    },
    bo_stop_loss_value: {
        type: DataTypes.NUMERIC,
        allowNull: true,
    },
    leg_name: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    create_time: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    update_time: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    exchange_time: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    drv_expiry_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    drv_option_type: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    drv_strike_price: {
        type: DataTypes.NUMERIC,
        allowNull: true,
    },
    oms_error_code: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    oms_error_description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    filled_qty: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    algo_id: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    net_pnl: {
        type: DataTypes.NUMERIC,
        allowNull: true,
    },
    pnl: {
        type: DataTypes.NUMERIC,
        allowNull: true,
    },
    order_result_status: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: 'open', // Setting default value as "open"
    },
}, {
    tableName: 'orders',
    timestamps: false,
});

module.exports = OrderModel;
