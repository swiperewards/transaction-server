var path =require('path');
var api=require(path.resolve('.','modules/account/accountController.js'));
var express = require('express');
var functions = require(path.resolve('./', 'utils/functions.js'));
var router=express.Router();


// api to update account
router.post("/updateAccount", functions.decryptDataMiddleWare, api.updateAccount);


module.exports=router;
