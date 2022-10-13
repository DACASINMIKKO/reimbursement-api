const express = require('express');
const router = express.Router();
const db = require('../database');
const jwt = require('jsonwebtoken')
require('dotenv').config();
const userController = require('../controller/userController')

const auth = require('../utilities/authentication');
const checkEmployeeRole = require('../utilities/roleChecker');

router.post('/signup', userController.signup)

router.post('/login', userController.login)

router.get('/', auth.authenticateToken, checkEmployeeRole.checkRole, userController.getAllUsers)

module.exports = router;