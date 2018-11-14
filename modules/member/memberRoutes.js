var path =require('path');
var api=require(path.resolve('.','modules/member/memberController.js'));
var express = require('express');
var functions = require(path.resolve('./', 'utils/functions.js'));
var router=express.Router();



// api to update member
router.post("/createMember", functions.decryptDataMiddleWare, api.createMember);


// api to update member
router.post("/updateMember", functions.decryptDataMiddleWare, api.updateMember);


module.exports=router;
