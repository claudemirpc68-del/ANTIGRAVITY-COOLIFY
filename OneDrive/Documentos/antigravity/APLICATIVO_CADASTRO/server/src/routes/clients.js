const express = require('express');
const router = express.Router();
const clientsController = require('../controllers/clientsController');

router.post('/', clientsController.createClient);
router.get('/', clientsController.getClients);

module.exports = router;
