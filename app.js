const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const { API_VERSION } = require('./config');

// setting
app.set('port', process.env.PORT || 4000);

// Configure Header HTTP
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method'
    );
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Load routing
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const menuRoutes = require('./routes/menu');

// Middleares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configure Header HTTP

// Router Basic
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', menuRoutes);

module.exports = app;
