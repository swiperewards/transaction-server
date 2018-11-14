var path =require('path');
var api=require(path.resolve('.','modules/config/configController.js'))
var express = require('express');
var functions = require(path.resolve('./', 'utils/functions.js'));
var router=express.Router();

module.exports=router;