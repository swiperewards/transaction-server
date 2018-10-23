var path = require('path');
var api = require(path.resolve('.', 'modules/customer/customerController.js'))
var express = require('express');
var functions = require(path.resolve('./', 'utils/functions.js'));
var router = express.Router();

router.post("/createCustomer", functions.decryptDataMiddleWare, api.createCustomer);

//not used
router.post("/createToken", api.createToken);

router.post("/addCard", functions.decryptDataMiddleWare, api.addCard);

module.exports = router;