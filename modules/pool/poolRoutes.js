var path =require('path');
var api=require(path.resolve('.','modules/pool/poolController.js'))
var express = require('express');
var router=express.Router();

// router.post("/getPoolAmountByMerchantId", api.getPoolAmountByMerchantId);

module.exports=router;