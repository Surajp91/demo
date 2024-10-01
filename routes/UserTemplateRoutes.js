const express = require('express');
const { getUserIdFromContext } = require('../controllers/IndicatorController');
const router = express.Router();
const Subscription = require('../dal/models/SubscriptionModel');
const UserStrategy = require('../dal/models/UserStrategyModel');
const Plan = require('../dal/models/PlanModel');
const UserSubscription = require('../dal/models/UserSubscriptionModel');
const UserBrokerAccountModel = require('../dal/models/UserBrokerAccountModel');
const StrategySymbol = require('../dal/models/StrategySymbolModel');
const UserMaster = require('../dal/models/UserMasterModel');
const StrategyIndicator = require('../dal/models/StrategyIndicatorModel');
const StrategyAction = require('../dal/models/StrategyActionModel');
const IndicatorMaster = require('../dal/models/IndicatorMasterModel.js');
const sequelize = require('../config/database'); // Ensure this path is correct


// router.post('/Subscribe', async (req, res) => {
//   const { strategyId, availableBalance } = req.body;

//   const user_id = getUserIdFromContext(req);

//   try {
//     // Check if strategy exists
//     const strategy = await UserStrategy.findOne({ where: { strategy_id: strategyId } });
//     if (!strategy) {
//       return res.status(400).json({
//         is_success: false,
//         message: 'Strategy ID not found.',
//         details: null
//       });
//     }

//     const requiredFund = strategy.required_fund;
//     console.log("availableBalance, requiredFund:", availableBalance, requiredFund);

//     if (availableBalance < requiredFund) {
//       return res.status(400).json({
//         is_success: false,
//         message: 'Insufficient funds to subscribe to this strategy.',
//         details: null
//       });
//     }

//     // Check if user is already subscribed
//     const existingSubscription = await Subscription.findOne({ where: { user_id } });
//     if (existingSubscription) {
//       return res.status(400).json({
//         is_success: false,
//         message: 'UserID already subscribed to a strategy.',
//         details: null
//       });
//     }

//     // Get the current date for SubscribeDate
//     const currentDate = new Date().toISOString().split('T')[0];

//     // Calculate the expiry date by adding 90 days to the current date
//     const expiryDate = new Date();
//     expiryDate.setDate(expiryDate.getDate() + 90);
//     const expiryDateString = expiryDate.toISOString().split('T')[0];

//     // Create a new subscription object
//     const newSubscription = {
//       user_id: user_id,
//       strategy_id: strategyId,
//       subscribe_date: currentDate,
//       amount: 20,
//       period_months: 3,
//       expiry_date: expiryDateString,
//       payment_id: 0,
//       payment_mode: 'free',
//       is_active: false,
//       is_deleted: false
//     };

//     // Insert new subscription into the database
//     await Subscription.create(newSubscription);

//     res.status(200).json({
//       is_success: true,
//       message: 'Subscription created successfully',
//       details: newSubscription
//     });
//   } catch (error) {
//     console.error('Error subscribing to strategy:', error);
//     res.status(500).json({
//       is_success: false,
//       message: 'Internal Server Error',
//       details: error.message
//     });
//   }
// });

router.post('/Subscribe', async (req, res) => {
  const { strategyId, availableBalance } = req.body;

  const user_id = getUserIdFromContext(req);

  try {


    const connectedBroker = await UserBrokerAccountModel.findOne({ where: { user_id } });
    if (!connectedBroker) {
      return res.status(400).json({
        is_success: false,
        error: 'Broker not connected. Please connect to the broker first.',
        details: null
      });
    }


    // Check if strategy exists
    const strategy = await UserStrategy.findOne({ where: { strategy_id: strategyId } });
    if (!strategy) {
      return res.status(400).json({
        is_success: false,
        error: 'Strategy ID not found.',
        details: null
      });
    }

    const requiredFund = strategy.required_fund;
    console.log("availableBalance, requiredFund:", availableBalance, requiredFund);

    if (availableBalance < requiredFund) {
      return res.status(400).json({
        is_success: false,
        error: 'Insufficient funds to subscribe to this strategy.',
        details: null
      });
    }

    // Check if user is already subscribed
    const existingSubscription = await Subscription.findOne({ where: { user_id } });
    if (existingSubscription) {
      return res.status(400).json({
        is_success: false,
        error: 'User is already subscribed to a strategy.',
        details: null
      });
    }

    // Get the current date for SubscribeDate
    const currentDate = new Date().toISOString().split('T')[0];

    // Calculate the expiry date by adding 90 days to the current date
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 90);
    const expiryDateString = expiryDate.toISOString().split('T')[0];

    // Create a new subscription object
    const newSubscription = {
      user_id: user_id,
      strategy_id: strategyId,
      subscribe_date: currentDate,
      amount: 20,
      period_months: 3,
      expiry_date: expiryDateString,
      payment_id: 0,
      payment_mode: 'free',
      is_active: false,
      is_deleted: false
    };

    // Insert new subscription into the database
    await Subscription.create(newSubscription);

    res.status(200).json({
      is_success: true,
      message: 'Subscription created successfully',
      details: newSubscription
    });
  } catch (error) {
    console.error('Error subscribing to strategy:', error.message);
    res.status(500).json({
      is_success: false,
      error: 'Internal Server Error',
      details: error.message
    });
  }
});


router.get('/SubscribeStrategies', async (req, res) => {
  console.log('In /SubscribeStrategies');
  const user_id = getUserIdFromContext(req);

  try {
      // Fetch subscriptions for the user
      const userSubscriptions = await Subscription.findAll({
          where: { user_id: user_id },
          raw: true
      });

      if (!userSubscriptions.length) {
          return res.status(404).json({
              is_success: false,
              message: 'No subscriptions found for this user',
              details: {}
          });
      }

      // Prepare an array to hold consolidated data for each strategy
      const consolidatedStrategies = await Promise.all(userSubscriptions.map(async (subscription) => {
          const strategyID = subscription.strategy_id;

          // Fetch the strategy details
          const strategy = await UserStrategy.findOne({
              where: { strategy_id: strategyID },
              raw: true
          });

          if (!strategy) {
              return null; // Skip if the strategy doesn't exist
          }

          // Fetch symbols related to the strategy
          const symbolSelection = await StrategySymbol.findAll({
              where: { strategy_id: strategyID },
              raw: true
          });

          // Fetch actions related to the strategy
          const actionSelection = await StrategyAction.findAll({
              where: { strategy_id: strategyID },
              raw: true
          });

          // Fetch indicators related to the strategy
          const indicators = await StrategyIndicator.findAll({
              where: { strategy_id: strategyID },
              raw: true
          });

          // Structure the consolidated data for the current strategy
          return {
              strategyDesc: strategy,
              symbolSelection: symbolSelection || [],
              actionSelection: actionSelection || [],
              indicators: indicators || []
          };
      }));

      // Filter out null values (if any strategy was not found)
      const filteredStrategies = consolidatedStrategies.filter(strategy => strategy !== null);

      if (!filteredStrategies.length) {
          return res.status(404).json({
              is_success: false,
              message: 'No valid strategies found',
              details: {}
          });
      }

      res.status(200).json({
          is_success: true,
          message: 'Subscribed strategies fetched successfully',
          details: filteredStrategies
      });
  } catch (error) {
      console.error('Error fetching subscribed strategies:', error.message);
      res.status(500).json({
          is_success: false,
          message: 'Failed to fetch subscribed strategies',
          details: error.message
      });
  }
});


router.post('/addPlan', async (req, res) => {
  try {
      const planData = req.body;

      const newPlan = await Plan.create({
          plan_name: planData.plan_name,
          description: planData.description,
          price: planData.price,
          period_in_month: planData.period_in_month,
          created_by: planData.created_by || 'admin',
          created_date: new Date(),
          updated_by: planData.updated_by || 'admin',
          updated_date: new Date(),
          is_deleted: planData.is_deleted || false,
      });

      res.json({
          is_success: true,
          message: 'Successfully added plan',
          details: {
              id: newPlan.plan_id,
              description: newPlan.description,
          }
      });
  } catch (error) {
      console.error('Error adding plan:', error);
      res.status(500).json({
          is_success: false,
          message: 'Failed to add plan',
          details: null
      });
  }
});

module.exports = router;





router.post('/addSubscription', async (req, res) => {
  try {
      const subscriptionData = req.body;
      const user_id = getUserIdFromContext(req);
      
      // Create new subscription entry
      const newSubscription = await UserSubscription.create({
          user_id: user_id,
          start_date: new Date(subscriptionData.start_date),
          amount: subscriptionData.amount,
          period_in_months: subscriptionData.period_in_months,
          expiry_date: new Date(subscriptionData.expiry_date),
          payment_mode: subscriptionData.payment_mode || '',
          payment_ref_id: subscriptionData.payment_ref_id || '',
          is_active: subscriptionData.is_active || true,
      });

      // Respond with success message and subscription details
      res.json({
          is_success: true,
          message: 'Successfully added subscription',
          details: {
              id: newSubscription.sub_id,
              description: `Subscription for user_id: ${newSubscription.user_id}`,
          },
      });
  } catch (error) {
      console.error('Error adding subscription:', error);
      // Respond with error message
      res.status(500).json({
          is_success: false,
          message: 'Failed to add subscription',
          details: null,
      });
  }
});



module.exports = router;