var path =require('path');
var api=require(path.resolve('.','modules/entity/entityController.js'));
var express = require('express');
var router=express.Router();

// api to update merchant
router.post("/updateEntity", api.updateEntity);


module.exports=router;
