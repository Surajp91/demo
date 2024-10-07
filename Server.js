// server.js
const app = require('./app'); // Import the app
const sequelize = require('./config/database'); // Adjust the path as needed

// Test database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connected...');
    // You can synchronize your database if needed
    // return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('Database synchronized...');
  })
  .catch(err => {
    console.log('Error: ' + err);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
