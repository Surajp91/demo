const express = require('express');
const router = express.Router();
const UserStrategy = require('../dal/models/UserStrategyModel'); // adjust the path as per your project structure
const StrategySymbol = require('../dal/models/StrategySymbolModel');
const UserMaster = require('../dal/models/UserMasterModel');
const StrategyIndicator = require('../dal/models/StrategyIndicatorModel');
const StrategyAction = require('../dal/models/StrategyActionModel');
const IndicatorMaster = require('../dal/models/IndicatorMasterModel.js');
const OrderModel = require('../dal/models/OrderModel.js');
const { getActiveStrategies } = require('../controllers/CombineStrategyData');




const { Read_Csv } = require('../datafiles/Read_Csv.js');
const { getIndicatorParameters,getUserIdFromContext,getUserFromContext } = require('../controllers/IndicatorController');


router.post('/StrategyDesc', async (req, res) => {
  console.log('/StrategyDesc');
  try {
    // Extract strategy description data from the request body
    const strategyDescData = req.body;
    console.log('strategyDescData:', strategyDescData);

    // Map incoming data to match the model's field names
    const formattedData = {
      user_id: strategyDescData.user_id,
      required_fund: strategyDescData.required_fund,
      strategy_name: strategyDescData.StrategyName,
      description: strategyDescData.strategyDescription,
    };

    if (strategyDescData.strategy_id) {
      // Check if a record with the same strategy_id exists
      let existingStrategy = await UserStrategy.findOne({ where: { strategy_id: strategyDescData.strategy_id } });

      if (existingStrategy) {
        // Update the existing record with only the description
        await existingStrategy.update({ description: formattedData.description });
        res.status(200).json({
          is_success: true,
          message: 'Strategy description updated successfully',
          details: {
            strategy_id: existingStrategy.strategy_id,
            description: existingStrategy.description,
          },
        });
      } else {
        res.status(404).json({
          is_success: false,
          message: 'Strategy not found',
          details: {},
        });
      }
    } else {
      // Create a new record


      const newStrategy = await UserStrategy.create(formattedData);
      res.status(200).json({
        is_success: true,
        message: 'Strategy description saved successfully',
        details: {
          strategy_id: newStrategy.strategy_id,
          description: newStrategy.description,
        },
      });
    }
  } catch (error) {
    console.error('Error saving strategy description:', error);
    res.status(500).json({
      is_success: false,
      message: 'Failed to save strategy description',
      details: {},
    });
  }
});


router.get('/unique-values', async (req, res) => {
  try {
    path="../datafiles/dhan_securities.csv"
    const data = await Read_Csv(path);
    const uniqueValues = {};

    data.forEach((row) => {
      const exchId = row['SEM_EXM_EXCH_ID'];
      const category = row['SEM_INSTRUMENT_NAME'];

      if (!uniqueValues[exchId]) {
        uniqueValues[exchId] = new Set();
      }

      uniqueValues[exchId].add(category);
    });

    for (const exchId in uniqueValues) {
      uniqueValues[exchId] = Array.from(uniqueValues[exchId]);
    }

    res.status(200).json({
      is_success: true,
      message: 'Unique values retrieved successfully',
      details: uniqueValues,
    });
  } catch (err) {
    console.error('Error reading CSV:', err);
    res.status(500).json({
      is_success: false,
      message: 'Failed to retrieve unique values',
      details: {},
    });
  }
});


router.get('/symbols/:exchange/:instrumentType', async (req, res) => {
  try {
    const { exchange, instrumentType } = req.params;
    path = '../datafiles/dhan_securities.csv'
    const data = await Read_Csv(path);
    const symbols = [];

    // Filter symbols based on the exchange and instrumentType
    data.forEach((row) => {
      if (row['SEM_EXM_EXCH_ID'] === exchange && row['SEM_INSTRUMENT_NAME'] === instrumentType) {
        symbols.push({
          SEM_TRADING_SYMBOL: row['SEM_TRADING_SYMBOL'],
          SEM_CUSTOM_SYMBOL: row['SEM_CUSTOM_SYMBOL']
        });
      }
    });

    // Respond with a success message
    res.status(200).json({
      is_success: true,
      message: 'Symbols retrieved successfully',
      details: symbols,
    });
  } catch (err) {
    console.error('Error reading CSV:', err);
    res.status(500).json({
      is_success: false,
      message: 'Failed to retrieve symbols',
      details: {},
    });
  }
});


router.post('/saveSymbolSelection', async (req, res) => {
  console.log('in /saveSymbolSelection');
  try {
    const { exchange, category, symbol,  StrategyID } = req.body;
    const user_id = getUserIdFromContext(req);


    // Check if required fields are present
    if (!exchange || !category || !symbol) {
      return res.status(400).json({
        is_success: false,
        message: 'Exchange, category, and symbol are required',
        details: null
      });
    }

    // Check if the user_id exists in the user_master table
    const user = await UserMaster.findByPk(user_id);
    if (!user) {
      return res.status(400).json({
        is_success: false,
        message: 'Invalid user_id',
        details: null
      });
    }

    // Check if a record with the same strategy_id and symbol exists
    let existingStrategySymbol = await StrategySymbol.findOne({
      where: { strategy_id: StrategyID }
    });

    if (existingStrategySymbol) {
      // Update the existing record
      await existingStrategySymbol.update({ exchange, category, symbol });
      res.json({
        is_success: true,
        message: 'Symbol selection updated successfully',
        details: existingStrategySymbol
      });
    } else {
      // Create new StrategySymbol entry
      const newStrategySymbol = await StrategySymbol.create({
        exchange,
        category,
        symbol,
        user_id,
        strategy_id: StrategyID
      });

      // Update completed_stages to 2 in the user_strategies table
      const strategy = await UserStrategy.findByPk(StrategyID);
      if (strategy) {
        strategy.completed_stages = 2;
        await strategy.save();
      } else {
        return res.status(404).json({
          is_success: false,
          message: 'Strategy not found',
          details: null
        });
      }

      res.json({
        is_success: true,
        message: 'Symbol Selection Saved and stages updated',
        details: newStrategySymbol
      });
    }
  } catch (error) {
    console.error('Error saving symbol selection:', error);
    res.status(500).json({
      is_success: false,
      message: 'Failed to save symbol selection',
      details: null
    });
  }
});


router.post('/actiondefinition', async (req, res) => {
  console.log("in actiondefinition",req.body);
    // Log the incoming request body
 
  try {
    const {
      Action,
      ActionType,
      Quantity,
      LimitPrice,
      CoverPrice,
      CoverStopLoss,
      CoverTriggerPrice,
      TriggerPriceAt,
      TriggerTriggerPrice,
      BracketPriceAt,
      BracketTarget,
      BracketStopLoss,
      StrategyID,
      StartDate,
      EndDate,
      Bookprofit,Stoploss,
      executionCount
    } = req.body;


    
    const user_id = getUserIdFromContext(req);
    
    // Validate required fields
    if ( !StrategyID || !user_id) {
      return res.status(400).json({
        success: false,
        message: 'Action, ActionType, StrategyID, and user_id are required'
      });
    }

    const newAction = {
      action: Action,
      order_type: ActionType,
      quantity: Quantity,
      limit_price: LimitPrice,
      cover_price: CoverPrice,
      cover_stop_loss: CoverStopLoss,
      cover_trigger_price: CoverTriggerPrice,
      trigger_price_at: TriggerPriceAt,
      trigger_trigger_price: TriggerTriggerPrice,
      bracket_price_at: BracketPriceAt,
      bracket_target: BracketTarget,
      bracket_stop_loss: BracketStopLoss,
      strategy_id: StrategyID,
      start_date: StartDate,
      end_date: EndDate,
      execution_count: executionCount,
      user_id: user_id,
      target_percent:Bookprofit,
      stoploss_percent:Stoploss,

    };

    const filteredAction = Object.fromEntries(
      Object.entries(newAction).filter(
        ([key, value]) => value !== null && value !== ""
      )
    );

    // Check if a record with the same strategy_id and action exists
    let existingAction = await StrategyAction.findOne({
      where: { strategy_id: StrategyID }
    });

    if (existingAction) {
      // Update the existing record
      console.log("in edit existingAction");
      await existingAction.update(filteredAction);
      res.json({
        success: true,
        message: 'Action definition updated successfully',
        data: existingAction
      });
    } else {
      // Create a new action
      const createdAction = await StrategyAction.create(filteredAction);

      // Update completed_stages to 3 in the user_strategies table
      const strategy = await UserStrategy.findByPk(StrategyID);
      if (strategy) {
        strategy.completed_stages = 3;
        await strategy.save();
      } else {
        return res.status(404).json({
          success: false,
          message: 'Strategy not found'
        });
      }

      res.json({
        success: true,
        message: 'Action definition submitted and stages updated',
        data: createdAction
      });
    }
  } catch (error) {
    console.error('Error submitting action definition:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit action definition'
    });
  }
});


router.get('/indicatorParameters', getIndicatorParameters);

 
  const extractParams = (condition) => {
    let extractedParams = [];
  
    Object.keys(condition).forEach(param => {
      if (param !== 'Indicator' && condition[param] !== undefined && condition[param] !== '') {
        extractedParams.push({
          param_name: param,
          param_value: condition[param]
        });
      }
    });
  
    return extractedParams;
  };


  router.post('/saveIndicators', async (req, res) => {
    try {
      const { conditions, StrategyID } = req.body;
  
      const user_id = getUserIdFromContext(req);
      const created_by = getUserFromContext(req);
      console.log("user_id, created_by:", user_id, created_by);
  
      if (!conditions || !StrategyID) {
        return res.status(400).json({ message: 'Conditions and StrategyID are required' });
      }
  
      // Remove existing indicators for the given StrategyID
      await StrategyIndicator.destroy({
        where: { strategy_id: StrategyID }
      });
  
      // Validate and insert new indicators
      for (const condition of conditions) {
        const indicatorName = condition.Indicator;
        
        // Fetch the indicator by name from the IndicatorMaster table
        const indicator = await IndicatorMaster.findOne({ where: { name: indicatorName } });
  
        if (!indicator) {
          throw new Error(`Indicator ${indicatorName} not found in indicator_master`);
        }
  
        const extractedParams = extractParams(condition);
  
        for (const param of extractedParams) {
          // Create new StrategyIndicator entry
          await StrategyIndicator.create({
            strategy_id: StrategyID,
            user_id: user_id,
            indicator_id: indicator.id,
            param_name: param.param_name,
            param_value: param.param_value,
            created_by: created_by,
            created_date: new Date(),
            is_deleted: false,
          });
        }
      }
  
      // Update completed_stages to 4 in the user_strategies table
      const strategy = await UserStrategy.findByPk(StrategyID);
      if (strategy) {
        strategy.completed_stages = 4;
        await strategy.save();
      } else {
        return res.status(404).json({
          message: 'Strategy not found'
        });
      }
  
      res.status(200).json({ message: 'Indicators saved successfully and stages updated' });
    } catch (error) {
      console.error('Error saving indicators:', error);
      res.status(500).json({ message: 'Failed to save indicators', error: error.message });
    }
  });
  

  router.get("/consolidated/:StrategyID", async (req, res) => {
    console.log("/in /consolidated/:StrategyID");
    const { StrategyID } = req.params;
  
    try {
      // Fetch strategy description
      const strategyDesc = await UserStrategy.findOne({
        where: { strategy_id: StrategyID }
      });
  
      if (!strategyDesc) {
        return res.status(404).json({ error: "Strategy description not found" });
      }
  
      // Fetch symbols related to the strategy
      const symbolSelection = await StrategySymbol.findAll({
        where: { strategy_id: StrategyID }
      });
  
      // Fetch actions related to the strategy
      const actionSelection = await StrategyAction.findAll({
        where: { strategy_id: StrategyID }
      });
  
      // Fetch indicators related to the strategy
      const indicators = await StrategyIndicator.findAll({
        where: { strategy_id: StrategyID }
      });
  
      // Structure the consolidated data
      const consolidatedData = {
        strategyDesc,
        symbolSelection,
        actionSelection,
        indicators
      };
  
      res.json(consolidatedData);
    } catch (error) {
      console.error("Error fetching consolidated data:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });

 
  router.get('/getallstartegies', async (req, res) => {
    console.log('In /completeStrategies');
    const user_id = getUserIdFromContext(req);
    try {
      // Fetch complete strategies
      const completeStrategies = await UserStrategy.findAll({
        where: { user_id: user_id },
        raw: true
      });
  
      if (!completeStrategies.length) {
        return res.status(404).json({
          is_success: false,
          message: 'No complete strategies found',
          details: {}
        });
      }
  
      // Prepare an array to hold consolidated data for each strategy
      const consolidatedStrategies = await Promise.all(completeStrategies.map(async (strategy) => {
        const strategyID = strategy.strategy_id;
  
        // Fetch symbols related to the strategy
        const symbolSelection = await StrategySymbol.findAll({
          where: { strategy_id: strategyID },
          raw: true
        });
  
        // console.log(`Symbol Selection for strategy ${strategyID}: `, symbolSelection);
  
        // Fetch actions related to the strategy
        const actionSelection = await StrategyAction.findAll({
          where: { strategy_id: strategyID },
          raw: true
        });
  
        // console.log(`Action Selection for strategy ${strategyID}: `, actionSelection);
  
        // Fetch indicators related to the strategy
        const indicators = await StrategyIndicator.findAll({
          where: { strategy_id: strategyID },
          raw: true
        });
  
        // console.log(`Indicators for strategy ${strategyID}: `, indicators);
  
        // Structure the consolidated data for the current strategy
        return {
          strategyDesc: strategy,
          symbolSelection: symbolSelection || [],
          actionSelection: actionSelection || [],
          indicators: indicators || []
        };
      }));
  
      res.status(200).json({
        is_success: true,
        message: 'Complete strategies fetched successfully',
        details: consolidatedStrategies
      });
    } catch (error) {
      console.error('Error fetching complete strategies:', error.message);
      res.status(500).json({
        is_success: false,
        message: 'Failed to fetch complete strategies',
        details: {}
      });
    }
  });

  router.get('/getCompleteStrategies', async (req, res) => {
    console.log('In /getCompleteStrategies');
    const user_id = getUserIdFromContext(req);
    
    try {
      // Fetch complete strategies where is_complete is true
      const completeStrategies = await UserStrategy.findAll({
        where: {
          user_id: user_id,
          is_complete: true
        },
        raw: true
      });
  
      if (!completeStrategies.length) {
        return res.status(404).json({
          is_success: false,
          message: 'No complete strategies found',
          details: {}
        });
      }
  
      // Prepare an array to hold consolidated data for each strategy
      const consolidatedStrategies = await Promise.all(completeStrategies.map(async (strategy) => {
        const strategyID = strategy.strategy_id;
  
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
  
      res.status(200).json({
        is_success: true,
        message: 'Complete strategies fetched successfully',
        details: consolidatedStrategies
      });
    } catch (error) {
      console.error('Error fetching complete strategies:', error.message);
      res.status(500).json({
        is_success: false,
        message: 'Failed to fetch complete strategies',
        details: {}
      });
    }
  });
  

  router.put('/updateStrategyCompletion/:StrategyID', async (req, res) => {
    console.log('/updateStrategyCompletion');
    try {
      // Extract StrategyID from URL parameters
      const { StrategyID } = req.params;
      console.log('StrategyID:', StrategyID);
  
      // Ensure StrategyID is a valid number
      if (isNaN(StrategyID)) {
        return res.status(400).json({
          is_success: false,
          message: 'Invalid StrategyID',
          details: {},
        });
      }
  
      // Update the is_complete field to true for the given StrategyID
      const [updatedRows] = await UserStrategy.update(
        { is_complete: true },
        { where: { strategy_id: StrategyID } }
      );
  
      // Check if any rows were updated
      if (updatedRows === 0) {
        return res.status(404).json({
          is_success: false,
          message: 'No strategy found with the given StrategyID',
          details: {},
        });
      }
  
      // Respond with a success message
      res.status(200).json({
        is_success: true,
        message: 'Strategy completion status updated successfully',
        details: {
          strategy_id: StrategyID,
        },
      });
    } catch (error) {
      console.error('Error updating strategy completion status:', error);
      res.status(500).json({
        is_success: false,
        message: 'Failed to update strategy completion status',
        details: { error: error.message },
      });
    }
  });


  router.get('/fundlimit', async (req, res) => {
    // Extract headers from the request headers
    const accessToken = req.headers['access-token'];
    const contentType = req.headers['content-type'];

    // Construct headers for the external API call
    const headers = {
        'access-token': accessToken,
        'Content-Type': contentType
    };
 try {
     const response = await fetch('https://api.dhan.co/fundlimit', {
         headers: headers
     });
     const data = await response.json();
     res.json(data);

 } catch (error) {
     console.error('Error retrieving fund limit:', error);
     res.status(500).json({ error: 'An error occurred while retrieving fund limit' });
 }
});


  // Get combined strategy data by strategy ID
router.get('/activestrategy', async (req, res) => {
  console.log("in activestrategy");
try {
  // const strategyId = req.params.strategyId;
  const combinedData = await getActiveStrategies();
  
  res.json(combinedData);
} catch (error) {
  res.status(500).json({ error: error.message });
}
});


router.post('/complete-strategy', async (req, res) => {
  const { strategy_id } = req.body;

  if (!strategy_id) {
    return res.status(400).json({ success: false, message: 'strategy_id is required' });
  }

  try {
    // Update the is_complete field to true
    const [updated] = await UserStrategy.update(
      { is_active : true,
      execution_status: "waiting"},
      { where: { strategy_id } }
    );

    if (updated) {
      return res.json({ success: true, message: 'Strategy Chnged To Live Mode' });
    } else {
      return res.status(404).json({ success: false, message: 'Strategy not found' });
    }
  } catch (error) {
    console.error('Error updating strategy:', error);
    res.status(500).json({ success: false, message: 'Failed to update strategy' });
  }
});

router.post('/stop-strategy', async (req, res) => {
  const { strategy_id } = req.body;

  if (!strategy_id) {
    return res.status(400).json({ success: false, message: 'strategy_id is required' });
  }

  try {
    // Update the is_complete field to false and set execution_status as desired (e.g., "stopped")
    const [updated] = await UserStrategy.update(
      { 
        is_active : false,
        execution_status: "" 
      },
      { where: { strategy_id } }
    );

    if (updated) {
      return res.json({ success: true, message: 'Strategy marked as stopped' });
    } else {
      return res.status(404).json({ success: false, message: 'Strategy not found' });
    }
  } catch (error) {
    console.error('Error stopping strategy:', error);
    res.status(500).json({ success: false, message: 'Failed to stop strategy' });
  }
});


router.delete('/delete-strategy', async (req, res) => {
  const { strategy_id } = req.body;

  if (!strategy_id) {
    return res.status(400).json({ success: false, message: 'strategy_id is required' });
  }

  try {
    // Check if the strategy_id exists in the orders table
    const existingOrder = await OrderModel.findOne({
      where: { strategy_id },
    });

    if (existingOrder) {
      return res.status(400).json({ success: false, message: 'Cannot delete strategy because it has associated orders' });
    }

    // Delete actions related to the strategy
    await StrategyAction.destroy({
      where: { strategy_id },
    });

    // Delete symbols related to the strategy
    await StrategySymbol.destroy({
      where: { strategy_id },
    });

    // Delete indicators related to the strategy
    await StrategyIndicator.destroy({
      where: { strategy_id },
    });

    // Delete the strategy itself
    await UserStrategy.destroy({
      where: { strategy_id },
    });

    res.json({ success: true, message: 'Strategy and all related data deleted successfully' });
  } catch (error) {
    console.error('Error deleting strategy:', error);
    res.status(500).json({ success: false, message: 'Failed to delete strategy' });
  }
});

router.get('/getpnlstartegies', async (req, res) => {
  console.log('In /getpnlstrategies');
  const user_id = getUserIdFromContext(req);

  try {
    // Fetch complete strategies with the specified conditions
    const completeStrategies = await UserStrategy.findAll({
      where: {
        user_id: user_id,
        is_complete: true,
        is_deleted: false,
        is_active: true
      },
      raw: true
    });

    if (!completeStrategies.length) {
      return res.status(404).json({
        is_success: false,
        message: 'No complete strategies found',
        details: {}
      });
    }

    // Prepare an array to hold consolidated data for each strategy
    const consolidatedStrategies = await Promise.all(completeStrategies.map(async (strategy) => {
      const strategyID = strategy.strategy_id;

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

    res.status(200).json({
      is_success: true,
      message: 'Complete strategies fetched successfully',
      details: consolidatedStrategies
    });
  } catch (error) {
    console.error('Error fetching complete strategies:', error.message);
    res.status(500).json({
      is_success: false,
      message: 'Failed to fetch complete strategies',
      details: {}
    });
  }
});





module.exports = router;
