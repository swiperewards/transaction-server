var path =require('path');
var api=require(path.resolve('.','modules/account/accountController.js'));
var express = require('express');
var router=express.Router();


// api to update account
router.post("/updateAccount", api.updateAccount);


module.exports=router;
