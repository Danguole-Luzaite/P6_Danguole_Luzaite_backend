const express = require('express');
const router = express.Router();
const userCtrl = require ('../controllers/user');
// pour password-validator
const passwordValidator = require('../middleware/password_validator');

router.post('/signup', passwordValidator, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;
