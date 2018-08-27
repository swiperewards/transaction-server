var path =require('path');
var api=require(path.resolve('.','modules/member/memberController.js'));
var express = require('express');
var router=express.Router();



// api to update member
router.post("/createMember", api.createMember);


// api to update member
router.post("/updateMember", api.updateMember);


module.exports=router;
