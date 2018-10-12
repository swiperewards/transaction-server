var path =require('path');
var api=require(path.resolve('.','modules/customer/customerController.js'))
var express = require('express');
var router=express.Router();

router.post("/createCustomer", api.createCustomer);

router.post("/createToken", api.createToken);
module.exports=router;