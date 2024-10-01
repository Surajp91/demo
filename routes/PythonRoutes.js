const express = require('express');
const router = express.Router();
const { getActiveStrategies } = require('../controllers/CombineStrategyData');
const StrategySymbols = require('../dal/models/StrategySymbolModel');
const StrategyActionModel = require('../dal/models/StrategyActionModel');
const UserStrategy = require('../dal/models/UserStrategyModel');
const OrderModel  = require('../dal/models/OrderModel');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { searchSecurityIds } = require('../controllers/SearchSecurityController');
const { getIndicatorParameters,getUserIdFromContext,getUserFromContext } = require('../controllers/IndicatorController');

const { Parser: Json2CsvParser } = require('json2csv');
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



router.get('/get_unique_symbols', async (req, res) => {
  try {
      // Query the database for all strategy symbols
      const strategySymbols = await StrategySymbols.findAll();
      
      // Process the data to get unique symbols
      const symbolsInfo = {};
      strategySymbols.forEach(row => {
          const { symbol, exchange, category } = row;
          
          if (symbolsInfo[symbol]) {
              symbolsInfo[symbol].exchanges.add(exchange);
              symbolsInfo[symbol].categories.add(category);
          } else {
              symbolsInfo[symbol] = { exchanges: new Set([exchange]), categories: new Set([category]) };
          }
      });
      
      // Convert the dictionary to a list of dictionaries
      const uniqueSymbolsList = Object.keys(symbolsInfo).map(symbol => ({
          symbol,
          exchanges: Array.from(symbolsInfo[symbol].exchanges),
          categories: Array.from(symbolsInfo[symbol].categories)
      }));
      
      // Send the response
      res.json({
          is_success: true,
          message: "Unique symbols retrieved successfully",
          details: uniqueSymbolsList
      });
  } catch (error) {
      console.error("Error fetching unique symbols:", error);
      res.status(500).json({
          is_success: false,
          message: "An error occurred while retrieving unique symbols",
          details: error.message
      });
  }
});


// API to get unique symbols and update the database
router.get('/search_security_ids', async (req, res) => {
  try {
      const apiUrl = 'http://localhost:5000/python/get_unique_symbols';
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (!data.is_success) {
          return res.status(500).json({
              is_success: false,
              message: "Failed to retrieve unique symbols",
              details: data.message
          });
      }

      const uniqueSymbols = data.details;
      const securityIds = await searchSecurityIds(uniqueSymbols);

      for (const { symbol, exchangeId, securityId } of securityIds) {
          await UniqueSymbolsData.create({ symbol, exchange_id: exchangeId, security_id: securityId });
      }

      res.json({
          is_success: true,
          message: "Unique symbols and security IDs updated successfully",
          details: securityIds
      });
  } catch (error) {
      console.error("Error updating unique symbols:", error);
      res.status(500).json({
          is_success: false,
          message: "An error occurred while updating unique symbols",
          details: error.message
      });
  }
});





router.post('/saveError', (req, res) => {
  console.log('in /saveError');

  const { error_message, file_name } = req.body;

  if (!error_message || !file_name) {
    return res.status(400).json({ success: false, message: 'error_message and file_name are required' });
  }

  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${file_name}: ${error_message}\n`; // Use \n for newline
  const logFilePath = path.join(__dirname, 'datafiles', 'pythonerrors.log');
  const logDir = path.dirname(logFilePath);

  // Create the directory if it doesn't exist
  fs.mkdir(logDir, { recursive: true }, (err) => {
    if (err) {
      console.error('Error creating directory:', err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }

    // Append the log message to the file
    fs.appendFile(logFilePath, logMessage, (err) => {
      if (err) {
        console.error('Error writing to log file:', err);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
      res.json({ success: true, message: 'Error message logged successfully' });
    });
  });
});

router.post('/', async (req, res) => {
  const { strategy_id } = req.body;

  if (!strategy_id) {
    return res.status(400).json({ success: false, message: 'strategy_id is required' });
  }

  try {
    // Update the execution_status field to "executed"
    const [updated] = await UserStrategy.update(
      { execution_status: 'executed' },
      { where: { strategy_id } }
    );

    if (updated) {
      return res.json({ success: true, message: 'Execution status updated to executed' });
    } else {
      return res.status(404).json({ success: false, message: 'Strategy not found' });
    }
  } catch (error) {
    console.error('Error updating execution status:', error);
    res.status(500).json({ success: false, message: 'Failed to update execution status' });
  }
});


router.get('/getltp/:securityId', (req, res) => {
  const securityId = req.params.securityId;  // Access the securityId from route parameters
  const csvFilePath = "D:/shashikant kamthe/Main code/svn/repo_Trading/Strategy_Builder/Python_StrategyBuilder_v1/live_web_socket/dhan_LTP.csv";
  console.log("securityId:",securityId);

  if (!securityId) {
      return res.status(400).json({ error: 'Security ID is required' });
  }s

  const data = [];

  fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
          data.push(row);
      })
      .on('end', () => {
          // Find the row with the matching Security ID
          const matchedRow = data.find(row => row['Security ID'] === securityId);

          if (matchedRow) {
              // console.log(":matchedRow",matchedRow);
              res.json({ matchedRow });
          } else {
              res.status(404).json({ error: 'Security ID not found' });
          }
      })
      .on('error', (error) => {
          console.error('Error reading CSV file:', error);
          res.status(500).json({ error: 'Internal Server Error' });
      });
});


router.post('/reactsaveError', (req, res) => {
  console.log('In /reactsaveError endpoint');

  const { error_message, file_name } = req.body;

  if (!error_message || !file_name) {
    return res.status(400).json({ success: false, message: 'error_message and file_name are required' });
  }

  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${file_name}: ${error_message}\n`; // Use \n for newline
  const logFilePath = path.join(__dirname, 'datafiles', 'reacterrors.log');
  const logDir = path.dirname(logFilePath);

  // console.log('Log directory:', logDir);
  // console.log('Log file path:', logFilePath);

  // Create the directory if it doesn't exist
  fs.mkdir(logDir, { recursive: true }, (err) => {
    if (err) {
      console.error('Error creating directory:', err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }

    // Append the log message to the file
    fs.appendFile(logFilePath, logMessage, (err) => {
      if (err) {
        console.error('Error writing to log file:', err);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
      res.json({ success: true, message: 'Error message logged successfully' });
    });
  });
});


router.post('/save-executed-order', async (req, res) => {
  const { order_details, strategy_id, MainOrderid = null, ordertype = "mainorder" } = req.body;
  const user_id = 7;
  // Validate required fields
  if (!order_details || !strategy_id) {
    return res.status(400).json({ success: false, message: 'order_details and strategy_id are required' });
  }

  if (!user_id) {
    return res.status(400).json({ success: false, message: 'user_id is required in order_details' });
  }

  try {
    // Create a new order object
    const newOrder = await OrderModel.create({
      strategy_id: strategy_id,
      user_id: user_id,
      main_order_id: MainOrderid,
      order_category: ordertype,
      broker_client_id: order_details.BrokerClientID,
      broker_order_id: order_details.BrokerOrderID,
      correlation_id: order_details.correlationId,
      order_status: order_details.orderStatus,
      transaction_type: order_details.transactionType,
      exchange_segment: order_details.exchangeSegment,
      product_type: order_details.productType,
      order_type: order_details.orderType,
      validity: order_details.validity,
      trading_symbol: order_details.tradingSymbol,
      security_id: order_details.securityId,
      quantity: order_details.quantity,
      disclosed_quantity: order_details.disclosedQuantity,
      execution_price: order_details.ExecutionPrice,
      trigger_price: order_details.triggerPrice,
      is_amo: order_details.IsAMO,
      bo_profit_value: order_details.boProfitValue,
      bo_stop_loss_value: order_details.boStopLossValue,
      leg_name: order_details.legName,
      create_time: order_details.createTime,
      update_time: order_details.updateTime,
      exchange_time: order_details.exchangeTime,
      drv_expiry_date: order_details.drvExpiryDate,
      drv_option_type: order_details.drvOptionType,
      drv_strike_price: order_details.drvStrikePrice,
      oms_error_code: order_details.omsErrorCode,
      oms_error_description: order_details.omsErrorDescription,
      filled_qty: order_details.filled_qty,
      algo_id: order_details.algoId,
    });

    // Successfully saved the order
    return res.status(201).json({ success: true, message: 'Order saved successfully', order: newOrder });
  } catch (error) {
    // Log the error details
    console.error('Error saving order:', error.message, error.stack);

    // Respond with error details for debugging (you might want to remove error details in production)
    return res.status(500).json({ success: false, message: 'Failed to save order', error: error.message });
  }
});


router.post('/processSymbols', (req, res) => {
  const symbols = req.body.symbols;
  // console.log("symbols in processSymbols:",symbols);
  const csvFilePath = "D:/shashikant kamthe/Main code/svn/repo_Trading/Strategy_Builder/API_StrategyBuilder/API_NodeJs_StrategyBuilder_v1/trunk/datafiles/dhan_securities.csv";
  const outputFilePath = "D:/ShashikantKamthe/2024/july/19.07.24/svn/repo_Trading/Strategy_Builder/API_StrategyBuilder/API_NodeJs_StrategyBuilder_v1/API_NodeJs_StrategyBuilder_v1/trunk/datafiles/abc.csv";

  if (!symbols || symbols.length === 0) {
    return res.status(400).json({ error: 'Symbols are required' });
  }

  const exchangeMap = {
    'NSE_INDEX': 0,
    'NSE_EQUITY': 1,
    'NSE_OPTFUT': 2,
    'NSE_OPTCUR': 3,
    'BSE_EQUITY': 4,
    'MCX_OPTFUT': 5,
    'BSE_OPTCUR': 7,
    'BSE_OPTFUT': 8,
    'BSE_FUTCUR': 4
  };

  const securityIds = [];
  const data = [];

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      data.push(row);
    })
    .on('end', () => {
      symbols.forEach(item => {
        const { symbol, exchanges, categories } = item;

        exchanges.forEach(exchange => {
          categories.forEach(category => {
            const exchangeKey = `${exchange}_${category}`;
            const exchangeId = exchangeMap[exchangeKey];

            if (exchangeId !== undefined) {
              const matchedRow = data.find(row => row['SEM_TRADING_SYMBOL'] === symbol && row['SEM_EXM_EXCH_ID'] === exchange);

              if (matchedRow) {
                const securityId = matchedRow['SEM_SMST_SECURITY_ID'];
                securityIds.push({ symbol, exchangeId, securityId });
              }
            }
          });
        });
      });

      // Write the results to a new CSV file
      const fields = ['symbol', 'Exchange ID', 'Security ID'];
      const json2csvParser = new Json2CsvParser({ fields });
      const csvOutput = json2csvParser.parse(securityIds);

      // fs.writeFile(outputFilePath, csvOutput, (err) => {
      //   if (err) {
      //     console.error('Error writing to CSV file:', err);
      //     return res.status(500).json({ error: 'Error writing to CSV file' });
      //   }

    
      // });
      // console.log("return securityIds in processSymbols",securityIds);
      
      res.json({ securityIds });
    })
    .on('error', (error) => {
      console.error('Error reading CSV file:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});


router.put('/increment-operation-count/:strategy_id', async (req, res) => {
  const { strategy_id } = req.params;

  try {
      // Find the strategy action by strategy_id
      const strategyAction = await StrategyActionModel.findOne({ where: { strategy_id } });

      if (!strategyAction) {
          return res.status(404).json({ message: 'StrategyAction not found' });
      }

      // Debugging: Log the current value of operationcount
      console.log('Current operationcount:', strategyAction.operationcount);

      // Increment the operationcount value
      strategyAction.operationcount = strategyAction.operationcount ? strategyAction.operationcount + 1 : 1;
      await strategyAction.save();

      // Debugging: Log the updated value of operationcount
      console.log('Updated operationcount:', strategyAction.operationcount);

      res.status(200).json({ message: 'Operation count incremented successfully', operationcount: strategyAction.operationcount });
  } catch (error) {
      res.status(500).json({ message: 'An error occurred', error: error.message });
  }
});


// Route to get all orders
router.get('/get-all-orders', async (req, res) => {
  try {
    // Fetch all orders from the database
    const orders = await OrderModel.findAll(); // Assuming you're using Sequelize

    // Check if any orders were found
    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, message: 'No orders found' });
    }

    // Successfully fetched orders
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    // Log the error details
    console.error('Error fetching orders:', error.message, error.stack);

    // Respond with error details for debugging (you might want to remove error details in production)
    return res.status(500).json({ success: false, message: 'Failed to fetch orders', error: error.message });
  }
});

// Route to update order status based on order ID
router.post('/update-order-status', async (req, res) => {
  const { brokerOrderId, newStatus } = req.body;

  // Validate required fields
  if (!brokerOrderId || !newStatus) {
    return res.status(400).json({ success: false, message: 'brokerOrderId and newStatus are required' });
  }

  try {
    // Find the order by brokerOrderId
    const order = await OrderModel.findOne({ where: { broker_order_id: brokerOrderId } });

    // Check if the order was found
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Update the order status
    order.order_status = newStatus;
    await order.save();

    // Successfully updated the order status
    return res.status(200).json({ success: true, message: 'Order status updated successfully', order });
  } catch (error) {
    // Log the error details
    console.error('Error updating order status:', error.message, error.stack);

    // Respond with error details for debugging (you might want to remove error details in production)
    return res.status(500).json({ success: false, message: 'Failed to update order status', error: error.message });
  }
});


// Route to update status or qty of orders by order ID
router.put('/orders/:id', async (req, res) => {
  const { id } = req.params;
  const { order_status, quantity } = req.body;

  try {
    const order = await OrderModel.findByPk(id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order_status) {
      order.order_status = order_status;
    }

    if (quantity) {
      order.quantity = quantity;
    }

    await order.save();
    
    return res.status(200).json({ success: true, message: 'Order updated successfully', order });
  } catch (error) {
    console.error('Error updating order:', error.message, error.stack);
    return res.status(500).json({ success: false, message: 'Failed to update order', error: error.message });
  }
});


// Route to Get all pending orders
router.get('/orders/pending', async (req, res) => {
  console.log("in /orders/pending");
  try {
    const orders = await OrderModel.findAll({ where: { order_status: 'pending' } });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, message: 'No pending orders found' });
    }

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching pending orders:', error.message, error.stack);
    return res.status(500).json({ success: false, message: 'Failed to fetch pending orders', error: error.message });
  }
});

// Route to Get all entry orders
router.get('/orders/entry', async (req, res) => {
  try {
    const orders = await OrderModel.findAll({ where: { order_category: 'Entry' } });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, message: 'No entry orders found' });
    }

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching entry orders:', error.message, error.stack);
    return res.status(500).json({ success: false, message: 'Failed to fetch entry orders', error: error.message });
  }
});


module.exports = router;
