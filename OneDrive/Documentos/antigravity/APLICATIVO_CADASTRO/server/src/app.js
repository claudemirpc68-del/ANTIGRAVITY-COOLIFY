const express = require('express');
const cors = require('cors');
const clientRoutes = require('./routes/clients');
const sequelize = require('./config/database');

const app = express();

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    next();
});

app.use('/api/clients', clientRoutes);

app.get('/health', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.json({ status: 'UP', database: 'connected' });
    } catch (error) {
        res.status(500).json({ status: 'DOWN', database: 'disconnected', error: error.message });
    }
});

module.exports = app;
