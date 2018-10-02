var path =require('path');
var api=require(path.resolve('.','modules/entity/entityController.js'));
var express = require('express');
var functions = require(path.resolve('./', 'utils/functions.js'));
var router=express.Router();

// api to update merchant
router.post("/updateEntity", functions.decryptDataMiddleWare, api.updateEntity);


module.exports=router;
