const express = require('express');
const router = express.Router();
const db = require('../database');
const jwt = require('jsonwebtoken')
require('dotenv').config();
const reimbursementController = require('../controller/reimbursementController')

const auth = require('../utilities/authentication');
const checkEmployeeRole = require('../utilities/roleChecker');

router.get('/', auth.authenticateToken, checkEmployeeRole.checkRole, reimbursementController.getUsersReimbursement)

router.get('/employeeId/:id', auth.authenticateToken, checkEmployeeRole.checkRole, reimbursementController.getUsersReimbursementByEmployeeId)

router.get('/firstname/:firstName', auth.authenticateToken, checkEmployeeRole.checkRole, reimbursementController.getUsersReimbursementByEmployeeFirstName)

router.get('/lastname/:lastName', auth.authenticateToken, checkEmployeeRole.checkRole, reimbursementController.getUsersReimbursementByEmployeeLastName)

router.put('/:id/approve', auth.authenticateToken, checkEmployeeRole.checkRole, reimbursementController.approveReimbursement)

router.put('/:id/reject', auth.authenticateToken, checkEmployeeRole.checkRole, reimbursementController.rejectReimbursement)

module.exports = router;