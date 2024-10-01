// const { DataTypes } = require('sequelize');
// const sequelize = require('../../config/database'); // Adjust the path as needed

// const StrategyActionModel = sequelize.define('StrategyActionModel', {
//   str_act_id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//     allowNull: false
//   },
//   strategy_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false
//   },
//   user_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false
//   },
//   action: {
//     type: DataTypes.STRING(50),
//     allowNull: true
//   },
//   order_type: {
//     type: DataTypes.STRING(50),
//     allowNull: true
//   },
//   quantity: {
//     type: DataTypes.INTEGER,
//     allowNull: true
//   },
//   target_percent: {
//     type: DataTypes.DECIMAL,
//     allowNull: true
//   },
//   stoploss_percent: {
//     type: DataTypes.DECIMAL,
//     allowNull: true
//   },
//   limit_price: {
//     type: DataTypes.DECIMAL,
//     allowNull: true
//   },
//   cover_price: {
//     type: DataTypes.DECIMAL,
//     allowNull: true
//   },
//   cover_stop_loss: {
//     type: DataTypes.DECIMAL,
//     allowNull: true
//   },
//   cover_trigger_price: {
//     type: DataTypes.DECIMAL,
//     allowNull: true
//   },
//   trigger_price_at: {
//     type: DataTypes.DECIMAL,
//     allowNull: true
//   },
//   trigger_trigger_price: {
//     type: DataTypes.DECIMAL,
//     allowNull: true
//   },
//   bracket_price_at: {
//     type: DataTypes.DECIMAL,
//     allowNull: true
//   },
//   bracket_target: {
//     type: DataTypes.DECIMAL,
//     allowNull: true
//   },
//   bracket_stop_loss: {
//     type: DataTypes.DECIMAL,
//     allowNull: true
//   },
//   execution_count: {
//     type: DataTypes.INTEGER,
//     allowNull: true
//   },
//   start_date: {
//     type: DataTypes.DATE,
//     allowNull: true
//   },
//   end_date: {
//     type: DataTypes.DATE,
//     allowNull: true
//   }
// }, {
//   tableName: 'strategy_actions', // Specify the table name explicitly
//   timestamps: false // Disable createdAt and updatedAt fields
// });

// module.exports = StrategyActionModel;



const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database'); // Adjust the path as needed

const StrategyActionModel = sequelize.define('StrategyActionModel', {
  str_act_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  strategy_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  action: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  order_type: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  target_percent: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  stoploss_percent: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  limit_price: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  cover_price: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  cover_stop_loss: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  cover_trigger_price: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  trigger_price_at: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  trigger_trigger_price: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  bracket_price_at: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  bracket_target: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  bracket_stop_loss: {
    type: DataTypes.DECIMAL,
    allowNull: true
  },
  execution_count: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  operationcount: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'strategy_actions', // Specify the table name explicitly
  timestamps: false // Disable createdAt and updatedAt fields
});

module.exports = StrategyActionModel;

