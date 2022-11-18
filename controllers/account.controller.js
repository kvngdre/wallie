const Account = require('../models/account.model');
const ServerResponse = require('../utils/serverResponse');
const logger = require('../utils/logger')('authCtrl.js');
const debug = require('debug')('app:authCtrl');
const User = require('../models/user.model');


module.exports = new AccountController();