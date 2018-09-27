var path =require('path');
var api=require(path.resolve('.','modules/cron/cronController.js'))
var express = require('express');
var router=express.Router();

router.post("/getTransactionViaCronJob", api.getTransactionViaCronJob);

module.exports=router;