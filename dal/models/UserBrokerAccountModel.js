// // models/UserBrokerAccount.js

// const { DataTypes } = require('sequelize');
// const sequelize = require('../../config/database'); // Adjust the path as needed
// const UserMaster = require('./UserMasterModel'); // Import the UserMaster model for the foreign key relationship

// const UserBrokerAccountModel = sequelize.define('UserBrokerAccountModel', {
//     user_bro_acc_id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//     },
//     user_id: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         references: {
//             model: UserMaster,
//             key: 'user_id',
//         },
//     },
//     broker_id: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//     },
//     api_key: {
//         type: DataTypes.TEXT,
//         allowNull: false,
//     },
//     api_secret_key: {
//         type: DataTypes.TEXT,
//         allowNull: false,
//     },
//     status: {
//         type: DataTypes.TEXT,
//         allowNull: false,
//     },
//     connected_date: {
//         type: DataTypes.DATE,
//         defaultValue: DataTypes.NOW,
//     },
//     updated_by: {
//         type: DataTypes.TEXT,
//     },
//     updated_date: {
//         type: DataTypes.DATE,
//     },
//     is_deleted: {
//         type: DataTypes.BOOLEAN,
//         defaultValue: false,
//     },
// }, {
//     tableName: 'user_broker_accounts',
//     timestamps: false,
// });

// module.exports = UserBrokerAccountModel;

// models/UserBrokerAccount.js

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database'); // Adjust the path as needed
const UserMaster = require('./UserMasterModel'); // Import the UserMaster model for the foreign key relationship

const UserBrokerAccountModel = sequelize.define('UserBrokerAccountModel', {
    user_bro_acc_id: {
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
    broker_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    broker_name: { // New field added
        type: DataTypes.TEXT,
        allowNull: true, // Adjust as needed (true or false)
    },
    api_key: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    api_secret_key: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    connected_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_by: {
        type: DataTypes.TEXT,
    },
    updated_date: {
        type: DataTypes.DATE,
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: 'user_broker_accounts',
    timestamps: false,
});

module.exports = UserBrokerAccountModel;
