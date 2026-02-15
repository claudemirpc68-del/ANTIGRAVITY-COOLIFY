const Client = require('../models/Client');

exports.createClient = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const client = await Client.create({ name, email, phone });
        res.status(201).json(client);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(400).json({ error: error.message });
    }
};

exports.getClients = async (req, res) => {
    try {
        const clients = await Client.findAll();
        res.json(clients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
