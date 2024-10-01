// routes/brokerAccountSymbolLTPRoutes.js

const express = require('express');
const router = express.Router();
// models/UserBrokerAccount.js
const UserBrokerAccount = require('../dal/models/UserBrokerAccountModel'); // Adjust the path as needed
// models/BrokerSymbolLTP.js
const BrokerSymbolLTP = require('../dal/models/SymbolLTPModel'); // Adjust the path as needed
const UserBrokerAccountModel = require('../dal/models/UserBrokerAccountModel'); // Adjust the path as needed
const BrokerMasterModel = require('../dal/models/Broker_Master');
const availableBrokerController = require('../controllers/AvailableBrokerController'); // Adjust the path as needed
const { getUserIdFromContext, getUserFromContext } = require('../controllers/IndicatorController');
const { Op } = require('sequelize'); // Import Op from Sequelize

router.post('/addBrokerAccount', async (req, res) => {
    try {
        const brokerAccountData = req.body;

        // Create new broker account entry
        const newBrokerAccount = await UserBrokerAccount.create({
            user_id: brokerAccountData.user_id,
            broker_id: brokerAccountData.broker_id,
            api_key: brokerAccountData.api_key,
            api_secret_key: brokerAccountData.api_secret_key,
            status: brokerAccountData.status,
            connected_date: new Date(), // Default to current date
            updated_by: brokerAccountData.updated_by || '',
            updated_date: new Date(),
            is_deleted: brokerAccountData.is_deleted || false,
        });

        // Respond with success message and broker account details
        res.json({
            is_success: true,
            message: 'Successfully added broker account',
            details: {
                id: newBrokerAccount.user_bro_acc_id,
                description: `Broker account for user_id: ${newBrokerAccount.user_id}`,
            },
        });
    } catch (error) {
        console.error('Error adding broker account:', error);
        res.status(500).json({
            is_success: false,
            message: 'Failed to add broker account',
        });
    }
});




module.exports = router;




// POST route to add a new record
router.post('/addBrokerSymbolLTP', async (req, res) => {
    console.log('in /addBrokerSymbolLTP');
    try {
        const { ticker_id, ticker_symbol, price, time_stamp } = req.body;

        // Validate input
        if (!ticker_id || !ticker_symbol || price == null || !time_stamp) {
            return res.status(400).json({
                is_success: false,
                message: 'Missing required fields',
            });
        }

        // Create new record
        const newRecord = await BrokerSymbolLTP.create({
            ticker_id,
            ticker_symbol,
            price,
            time_stamp,
        });

        // Respond with success
        res.json({
            is_success: true,
            message: 'Successfully added broker symbol LTP',
            details: {
                id: newRecord.ltp_id,
                ticker_symbol: newRecord.ticker_symbol,
            },
        });
    } catch (error) {
        console.error('Error adding broker symbol LTP:', error);
        res.status(500).json({
            is_success: false,
            message: 'Failed to add broker symbol LTP',
            error: error.message,
        });
    }
});

// GET route to retrieve all records
router.get('/getBrokerSymbolLTPs', async (req, res) => {
    console.log('in /getBrokerSymbolLTPs');
    try {
        const records = await BrokerSymbolLTP.findAll();

        // Respond with the retrieved records
        res.json({
            is_success: true,
            message: 'Successfully retrieved broker symbol LTPs',
            details: records.map(record => ({
                id: record.ltp_id,
                ticker_symbol: record.ticker_symbol,
                price: record.price,
                time_stamp: record.time_stamp,
            })),
        });
    } catch (error) {
        console.error('Error retrieving broker symbol LTPs:', error);
        res.status(500).json({
            is_success: false,
            message: 'Failed to retrieve broker symbol LTPs',
            error: error.message,
        });
    }
});

// Route to get all available brokers
router.get('/available-brokers', availableBrokerController.getAllAvailableBrokers);

// POST /api/saveBrokerData
// router.post('/saveBrokerData', async (req, res) => {
//   console.log("req.body in saveBrokerData",req.body);
  
//     try {
//       const { account_number, apiKey, apiSecret, id, IsActive, brokerName } = req.body;

      

//       const user_id = getUserIdFromContext(req);
//       const user_name = getUserFromContext(req);
      
//       // Validate the incoming data
//       if ( !id ) {
//         return res.status(400).json({ message: 'Missing required fields' });
//       }
  
//       // Check if a record with the same user_id already exists
//     //   const existingRecord = await UserBrokerAccountModel.findOne({
//     //     where: { user_id: user_id }
//     //   });
  
//     //   if (existingRecord) {
//     //     // If a record with the same user_id exists, return an appropriate error message
//     //     return res.status(400).json({ message: 'Broker already connected for this user.' });
//     //   }
  
//       // Save the broker data into the UserBrokerAccountModel table
//       const brokerData = await UserBrokerAccountModel.create({
//         user_id: user_id,
//         broker_id: id, // Assuming this is the ID of the broker in the Broker_Master table
//         api_key: apiKey,
//         api_secret_key: apiSecret,
//         status: IsActive ? 'Active' : 'Inactive',
//         connected_date: new Date(),
//         updated_by: user_name, // Replace with actual user info if available
//         updated_date: new Date(),
//         is_deleted: false,
//       });
  
//       // Respond with success message
//       res.status(201).json({ message: 'Broker data saved successfully', brokerData });
//     } catch (error) {
//       console.error('Error saving broker data:', error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   });

router.post('/saveBrokerData', async (req, res) => {
  console.log("req.body in saveBrokerData", req.body);
  
  try {
    const { account_number, apiKey, apiSecret, id, IsActive, brokerName } = req.body;

    const user_id = getUserIdFromContext(req);
    const user_name = getUserFromContext(req);
    
    // Validate the incoming data
    if (!id || !brokerName) { // Ensure brokerName is also validated
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if a record with the same user_id already exists
    // const existingRecord = await UserBrokerAccountModel.findOne({
    //   where: { user_id: user_id }
    // });

    // if (existingRecord) {
    //   return res.status(400).json({ message: 'Broker already connected for this user.' });
    // }

    // Save the broker data into the UserBrokerAccountModel table
    const brokerData = await UserBrokerAccountModel.create({
      user_id: user_id,
      broker_id: id, // Assuming this is the ID of the broker in the Broker_Master table
      api_key: apiKey,
      api_secret_key: apiSecret,
      status: IsActive ? 'Active' : 'Inactive',
      connected_date: new Date(),
      updated_by: user_name,
      updated_date: new Date(),
      is_deleted: false,
      broker_name: brokerName // Add this line to save the broker name
    });

    // Respond with success message
    res.status(201).json({ message: 'Broker data saved successfully', brokerData });
  } catch (error) {
    console.error('Error saving broker data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


  

  router.get('/getBrokerAcountData', async (req, res) => {
    try {
      // Fetch all rows from the UserBrokerAccountModel table where is_deleted is false
      const brokerData = await UserBrokerAccountModel.findAll({
        where: { is_deleted: false } // Add this condition to filter out deleted records
      });
      // console.log("brokerData:",brokerData);
      // Check if data is found
      if (brokerData.length === 0) {
        return res.status(404).json({ message: 'No broker data found' });
      }
  
      // Respond with the retrieved data
      res.status(200).json({ brokerData });
    } catch (error) {
      console.error('Error retrieving broker data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  router.post('/deleteBroker', async (req, res) => {
    try {
      const { brokerId } = req.body;
      const user_id = getUserIdFromContext(req);
      const user_name = getUserFromContext(req);
      
      // Validate the incoming data
      if (!brokerId) {
        return res.status(400).json({ message: 'Broker ID is required' });
      }
    
      // Check if the broker record exists and is not already deleted
      const brokerRecord = await UserBrokerAccountModel.findOne({
        where: {
          user_id: user_id,
          broker_id: brokerId,
          is_deleted: false
        }
      });
    
      if (!brokerRecord) {
        // Broker not found or already deleted
        return res.status(404).json({ message: 'Broker not found or already deleted' });
      }
    
      // Update the record to mark it as deleted
      brokerRecord.is_deleted = true;
      brokerRecord.updated_by = user_name;
      brokerRecord.updated_date = new Date();
      await brokerRecord.save();
    
      // Respond with success message
      res.status(200).json({ message: 'Broker data marked as deleted successfully' });
    } catch (error) {
      console.error('Error deleting broker data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Route to update broker status
  router.post('/updatebrokerstatus/:user_bro_acc_id/:status', async (req, res) => {
    try {
      const { user_bro_acc_id, status } = req.params;
      const user_name = getUserFromContext(req);
  
      // Validate the incoming data
      if (!user_bro_acc_id || !status) {
        return res.status(400).json({ message: 'User broker account ID and status are required' });
      }
  
      console.log("user_bro_acc_id:", user_bro_acc_id);
  
      // Find the broker record to update
      const brokerRecord = await UserBrokerAccountModel.findOne({
        where: {
          user_bro_acc_id: user_bro_acc_id,
          is_deleted: false
        }
      });
  
      if (!brokerRecord) {
        return res.status(404).json({ message: 'Broker not found or already deleted' });
      }
  
      if (status === 'Active') {
        // Set all other brokers for the same user to "Inactive"
        await UserBrokerAccountModel.update(
          { status: 'Inactive', updated_by: user_name, updated_date: new Date() },
          {
            where: {
              user_id: brokerRecord.user_id,
              status: 'Active', // Ensure only currently active brokers are set to inactive
              is_deleted: false,
              user_bro_acc_id: { [Op.ne]: user_bro_acc_id } // Exclude the current broker
            }
          }
        );
      }
  
      // Update the status of the specific broker record
      brokerRecord.status = status;
      brokerRecord.updated_by = user_name;
      brokerRecord.updated_date = new Date();
      await brokerRecord.save();
  
      res.status(200).json({ message: 'Broker status updated successfully' });
    } catch (error) {
      console.error('Error updating broker status:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
 
  
  

  // Define the route to get broker information by broker_id
router.get('/getBrokerInfo/:broker_id', async (req, res) => {
    try {
        const { broker_id } = req.params;

        // Query the BrokerMasterModel to find the broker with the given broker_id
        const broker = await BrokerMasterModel.findOne({
            where: { avail_broker_id: broker_id }
        });

        // If no broker is found, return a 404 error
        if (!broker) {
            return res.status(404).json({ message: 'Broker not found' });
        }

        // Return the broker information as JSON
        res.status(200).json({ broker });
    } catch (error) {
        console.error('Error fetching broker info:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.get('/active-brokers', async (req, res) => {
  try {
      const activeBrokers = await UserBrokerAccountModel.findAll({
          where: {
              status: 'Active',
              is_deleted: false,
          },
      });

      if (activeBrokers.length === 0) {
          return res.status(404).json({ message: 'No active brokers found' });
      }

      res.json(activeBrokers);
  } catch (error) {
      console.error('Error fetching active brokers:', error);
      res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;
