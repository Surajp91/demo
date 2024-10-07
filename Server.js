// server.js or app.js
const express = require('express');
const app = express();
const sequelize = require('./config/database'); // Adjust the path as needed
const bodyParser = require('body-parser');

const userRoutes = require('./routes/UserRoutes'); // Adjust the path as needed
const userStrategies = require('./routes/UserStrategiesRoutes'); // Adjust the path as needed
const userTemplates = require('./routes/UserTemplateRoutes'); // Adjust the path as needed
const broker = require('./routes/BrokerRoutes');
const invoiceRoutes = require('./routes/InvoiceRoutes');
const PythonRoutes = require('./routes/PythonRoutes');
const OrderRoutes = require('./routes/OrderRoutes');
const cors = require('cors'); // Import the cors package
const {jwtDecode} = require('jwt-decode');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for verification








// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors()); // Allow all origins

// Test database connection
// sequelize.authenticate()
//   .then(() => console.log('Database connected...'))
//   .catch(err => console.log('Error: ' + err));


// Authenticate and synchronize
sequelize.authenticate()
  .then(() => {
    console.log('Database connected...');
    // return sequelize.sync({ alter: true }); // Use { force: true } to drop and recreate the table
  })
  .then(() => {
    console.log('Database synchronized...');
  })
  .catch(err => {
    console.log('Error: ' + err);
  });

// Middleware to simulate simple OAuth2 security check (for example purposes only)
const oauth2Middleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // For demonstration, we assume the token is always valid
    const token = authHeader.split(' ')[1];
    // In a real application, validate the token properly
    if (token === process.env.JWT_SECRET) {
      next();
    } else {
      res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    res.status(401).json({ message: 'No token provided' });
  }
};




// Middleware to authenticate JWT tokens
const authenticateToken = async (req, res, next) => {
  // Extract the Authorization header
  const authHeader = req.headers['authorization'];
  // console.log(`authHeader:\n${authHeader}`);
  
  // Extract the token from the Authorization header
  const token = authHeader && authHeader.split(' ')[1]; 
  // console.log(`Extracted token:\n${token}`);

  // Check if the token is present
  if (token == null) {
    console.error('No token provided.');
    return res.sendStatus(401); // If no token, return 401
  }

  // Decode the token without verification
  let decodedToken;
  try {
    decodedToken = jwtDecode(token);
    // console.log("Decoded token:", decodedToken); // Print decodedToken for debugging
  } catch (err) {
    console.error('Token decoding error:', err);
    return res.sendStatus(403); // If decoding fails, return 403
  }

  // Verify the token using jsonwebtoken
  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      console.error('Token verification error:', err);
      return res.sendStatus(403); // If token invalid, return 403
    }

    // console.log("Verified user:", user);

    // Verify if user exists in the database
    // try {
    //   const userInDb = await UserMaster.findOne({ where: { email_id: user.email_id } });
    //   if (!userInDb) {
    //     console.error('User not found in database.');
    //     return res.sendStatus(403); // User not found, return 403
    //   }
    // } catch (dbError) {
    //   console.error('Database error:', dbError);
    //   return res.sendStatus(500); // Database error, return 500
    // }

    req.user = user; // Attach user information to request
    next(); // Pass control to the next handler
  });
};
// Apply the OAuth2 middleware to all routes
// app.use('/api', oauth2Middleware);



app.use('/strategy', authenticateToken, userStrategies);

// Define your routes
app.use('/api', userRoutes);

app.use('/strategy', userStrategies);

app.use('/temp', userTemplates);

app.use('/broker', broker);

app.use('/invoice', invoiceRoutes);

app.use('/python', PythonRoutes);

app.use('/order', OrderRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
