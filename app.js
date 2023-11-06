const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const config = require('./config/config');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Import Routes
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Swagger configuration
const swaggerOptions = {
    swaggerDefinition: {
      info: {
        title: 'User Authentication API',
        version: '1.0.0',
      }, 
    },
    apis: ['./swagger.yaml'], 
  };

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Configure session middleware
app.use(
    session({
      secret: config.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    })
  );

// Connect to MongoDB
mongoose.connect(config.mongoURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));

// Initialize Passport and configure it to use sessions
app.use(passport.initialize());
app.use(passport.session());

// Import the Passport configuration
require('./config/passport-config');



// Declare Routes
app.use('/api/v1/auth', authRoutes); 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  

// Start the server
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});