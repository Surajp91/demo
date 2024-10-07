// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package
const userRoutes = require('./routes/UserRoutes'); // Adjust the path as needed
const userStrategies = require('./routes/UserStrategiesRoutes'); // Adjust the path as needed
const userTemplates = require('./routes/UserTemplateRoutes'); // Adjust the path as needed
const broker = require('./routes/BrokerRoutes');
const invoiceRoutes = require('./routes/InvoiceRoutes');
const PythonRoutes = require('./routes/PythonRoutes');
const OrderRoutes = require('./routes/OrderRoutes');
const { jwtDecode } = require('jwt-decode');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for verification

const app = express();

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors()); // Allow all origins

// Middleware to authenticate JWT tokens
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    console.error('No token provided.');
    return res.sendStatus(401); // If no token, return 401
  }

  // Decode the token without verification
  let decodedToken;
  try {
    decodedToken = jwtDecode(token);
  } catch (err) {
    console.error('Token decoding error:', err);
    return res.sendStatus(403); // If decoding fails, return 403
  }

  // Verify the token using jsonwebtoken
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Token verification error:', err);
      return res.sendStatus(403); // If token invalid, return 403
    }
    req.user = user; // Attach user information to request
    next(); // Pass control to the next handler
  });
};

// Apply the JWT authentication middleware to the desired routes
app.use(authenticateToken); // Adjust if you want to apply it selectively

// Define your routes
app.use('/api', userRoutes);
app.use('/strategy', userStrategies);
app.use('/temp', userTemplates);
app.use('/broker', broker);
app.use('/invoice', invoiceRoutes);
app.use('/python', PythonRoutes);
app.use('/order', OrderRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

module.exports = app;
