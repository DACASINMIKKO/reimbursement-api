const express = require('express');
const router = express.Router();
const db = require('../database');
const jwt = require('jsonwebtoken')
require('dotenv').config();
const itemController = require('../controller/itemController')

const auth = require('../utilities/authentication');
const checkEmployeeRole = require('../utilities/roleChecker');

router.post('/', auth.authenticateToken, itemController.addItem)

router.delete('/:id', auth.authenticateToken, itemController.deleteItem)

router.post('/submit', auth.authenticateToken, itemController.submitReimbursement)

router.get('/reimbursement_copy/:id', auth.authenticateToken, itemController.getCopyOfReimbursement)


module.exports = router;