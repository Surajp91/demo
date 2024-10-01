// routes/invoiceRoutes.js
const express = require('express');
const router = express.Router();
const OrderModel = require('../dal/models/OrderModel'); // Adjust the path as needed
const OrderHistory = require('../dal/models/OrderHistory');
const { updateOrderAndStrategyStatus } = require('../controllers/OrderController');

// Example usage: Fetch all order history records


const sequelize = require('../config/database'); // Ensure this path is correct
// GET route to fetch positions
router.get('/positions', async (req, res) => {
    console.log('in /positions');
    try {
        const positions = await OrderModel.findAll({
            attributes: [
                'trading_symbol',
                [sequelize.literal(`
                    SUM(CASE 
                        WHEN order_category = 'Entry' AND transaction_type = 'BUY' THEN quantity
                        WHEN order_category IN ('Target', 'Stop_Loss') AND transaction_type = 'SELL' THEN -quantity
                        ELSE 0 
                    END)`), 'net_quantity'],
                [sequelize.literal(`
                    SUM(CASE 
                        WHEN order_category = 'Entry' THEN execution_price * quantity 
                        ELSE 0 
                    END)`), 'total_investment']
            ],
            group: ['trading_symbol'],
            having: sequelize.literal(`
                SUM(CASE 
                    WHEN order_category = 'Entry' AND transaction_type = 'BUY' THEN quantity
                    WHEN order_category IN ('Target', 'Stop_Loss') AND transaction_type = 'SELL' THEN -quantity
                    ELSE 0 
                END) <> 0`)
        });

        // Respond with the retrieved positions
        res.json({
            is_success: true,
            message: 'Successfully retrieved positions',
            details: positions.map(position => ({
                trading_symbol: position.trading_symbol,
                net_quantity: position.dataValues.net_quantity,
                total_investment: position.dataValues.total_investment,
            })),
        });
    } catch (error) {
        console.error('Error retrieving positions:', error);
        res.status(500).json({
            is_success: false,
            message: 'Failed to retrieve positions',
            error: error.message,
        });
    }
});

// Route to get order details by strategy_id
// router.get('/orders/:strategy_id', async (req, res) => {
//     const { strategy_id } = req.params;

//     try {
//         // Find all orders with the given strategy_id
//         const orders = await OrderModel.findAll({
//             where: {
//                 strategy_id: strategy_id
//             }
//         });

//         if (orders.length > 0) {
//             res.json({
//                 is_success: true,
//                 message: `Orders retrieved successfully for strategy_id: ${strategy_id}`,
//                 details: orders
//             });
//         } else {
//             res.json({
//                 is_success: false,
//                 message: `No orders found for strategy_id: ${strategy_id}`
//             });
//         }
//     } catch (error) {
//         console.error('Error retrieving orders:', error);
//         res.status(500).json({
//             is_success: false,
//             message: 'Failed to retrieve orders',
//             error: error.message
//         });
//     }
// });

// router.get('/orders/:strategy_id', async (req, res) => {
//     const { strategy_id } = req.params;

//     try {
//         // Find all orders with the given strategy_id and include their order histories
//         const orders = await OrderModel.findAll({
//             where: {
//                 strategy_id: strategy_id
//             },
//             include: [{
//                 model: OrderHistory, // Include the related order history data
//                 required: false // If you want to include orders even without history
//             }]
//         });

//         if (orders.length > 0) {
//             res.json({
//                 is_success: true,
//                 message: `Orders retrieved successfully for strategy_id: ${strategy_id}`,
//                 details: orders
//             });
//         } else {
//             res.json({
//                 is_success: false,
//                 message: `No orders found for strategy_id: ${strategy_id}`
//             });
//         }
//     } catch (error) {
//         console.error('Error retrieving orders:', error);
//         res.status(500).json({
//             is_success: false,
//             message: 'Failed to retrieve orders',
//             error: error.message
//         });
//     }
// });

// router.get('/orders/:strategy_id', async (req, res) => {
    

//     const { strategy_id } = req.params;
//     console.log("in /orders/:strategy_id:", req.params);
//     try {
//         // Fetch orders based on strategy_id
//         const orders = await OrderModel.findAll({
//             where: { strategy_id }
//         });

//         if (orders.length === 0) {
//             return res.json({
//                 success: false,
//                 message: `No orders found for strategy_id: ${strategy_id}`
//             });
//         }
//         console.log("orders:", orders);

//         // Fetch order histories for the same order_ids
//         // const strategy_id = orders.map(order => order.strategy_id); // Get the order IDs from orders
//         const orderHistories = await OrderHistory.findAll({
//             where: { strategy_id: strategy_id } // Match order histories based on order_id
//         });

//         // Combine orders with their histories manually
//         const combinedData = orders.map(order => {
//             const history = orderHistories.filter(hist => hist.order_id === order.order_id);

//             // Construct the order data as per your required structure
//             return {
//                 order_history_id: history[0]?.order_history_id || null,  // Get first history data or null
//                 order_id: order.order_id,
//                 strategy_id: order.strategy_id,
//                 user_id: order.user_id,
//                 main_order_id: order.main_order_id || null,
//                 order_category: order.order_category,
//                 broker_client_id: order.broker_client_id || null,
//                 broker_order_id: order.broker_order_id || null,
//                 correlation_id: order.correlation_id,
//                 order_status: order.order_status,
//                 transaction_type: order.transaction_type,
//                 exchange_segment: order.exchange_segment,
//                 product_type: order.product_type,
//                 order_type: order.order_type,
//                 validity: order.validity,
//                 trading_symbol: order.trading_symbol,
//                 security_id: order.security_id,
//                 quantity: order.quantity,
//                 disclosed_quantity: order.disclosed_quantity || 0,
//                 execution_price: order.execution_price,
//                 trigger_price: order.trigger_price || "0.00",
//                 is_amo: order.is_amo || null,
//                 bo_profit_value: order.bo_profit_value || "0.00",
//                 bo_stop_loss_value: order.bo_stop_loss_value || "0.00",
//                 leg_name: order.leg_name || "NA",
//                 create_time: order.create_time,
//                 update_time: order.update_time,
//                 exchange_time: order.exchange_time || "2000-12-31T13:00:00.000Z",
//                 drv_expiry_date: order.drv_expiry_date || "0001-01-01",
//                 drv_option_type: order.drv_option_type || "NA",
//                 drv_strike_price: order.drv_strike_price || "0.00",
//                 oms_error_code: order.oms_error_code || 0,
//                 oms_error_description: order.oms_error_description || "",
//                 filled_qty: order.filled_qty || 0,
//                 algo_id: order.algo_id || "0",
//                 net_pnl: order.net_pnl || null,
//                 pnl: order.pnl || null
//             };
//         });

//         return res.json({
//             success: true,
//             message: `Orders and histories retrieved successfully for strategy_id: ${strategy_id}`,
//             orders: combinedData
//         });
//     } catch (error) {
//         console.error('Error retrieving orders:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to retrieve orders',
//             error: error.message
//         });
//     }
// });

router.get('/orders/:strategy_id', async (req, res) => {
    const { strategy_id } = req.params;
    console.log("in /orders/:strategy_id:", req.params);

    try {
        // Fetch orders based on strategy_id
        const orders = await OrderModel.findAll({
            where: { strategy_id }
        });

        // Fetch all order histories for the same strategy_id
        const orderHistories = await OrderHistory.findAll({
            where: { strategy_id }
        });

        // Directly combine both orders and histories without matching
        const combinedOrders = orders.map(order => {
            // Just use the order data without matching histories
            return {
                order_history_id: null, // Set to null or some default value
                order_id: order.order_id,
                strategy_id: order.strategy_id,
                user_id: order.user_id,
                main_order_id: order.main_order_id || null,
                order_category: order.order_category,
                broker_client_id: order.broker_client_id || null,
                broker_order_id: order.broker_order_id || "",
                correlation_id: order.correlation_id,
                order_status: order.order_status || "", // Default empty if no history
                transaction_type: order.transaction_type,
                exchange_segment: order.exchange_segment,
                product_type: order.product_type,
                order_type: order.order_type,
                validity: order.validity,
                trading_symbol: order.trading_symbol,
                security_id: order.security_id,
                quantity: order.quantity,
                disclosed_quantity: order.disclosed_quantity || 0,
                execution_price: order.execution_price || "0.00", // Default if no history
                trigger_price: order.trigger_price || "0.00",
                is_amo: order.is_amo || null,
                bo_profit_value: order.bo_profit_value || "0.00",
                bo_stop_loss_value: order.bo_stop_loss_value || "0.00",
                leg_name: order.leg_name || "NA",
                create_time: order.create_time,
                update_time: order.update_time || null, // Default if no history
                exchange_time: order.exchange_time || "2000-12-31T13:00:00.000Z",
                drv_expiry_date: order.drv_expiry_date || "0001-01-01",
                drv_option_type: order.drv_option_type || "NA",
                drv_strike_price: order.drv_strike_price || "0.00",
                oms_error_code: order.oms_error_code || 0,
                oms_error_description: order.oms_error_description || "",
                filled_qty: order.filled_qty || 0,
                algo_id: order.algo_id || "0",
                net_pnl: order.net_pnl || null,
                pnl: order.pnl || null
            };
        });

        // Optionally, include all histories in a separate field if needed
        const response = {
            success: true,
            message: `Orders and histories retrieved successfully for strategy_id: ${strategy_id}`,
            orders: combinedOrders,
            histories: orderHistories
        };

        return res.json(response);
    } catch (error) {
        console.error('Error retrieving orders:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve orders',
            error: error.message
        });
    }
});





// Define the route to get all orders
router.get('/get-all-historyorders', async (req, res) => {
    try {
      // Fetch all orders from the OrderHistory model
      const orders = await OrderHistory.findAll(); // Using Sequelize's findAll method
  
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



router.post('/close-strategy', updateOrderAndStrategyStatus);

module.exports = router;
