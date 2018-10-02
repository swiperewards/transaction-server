var path =require('path');
var api=require(path.resolve('.','modules/merchant/merchantController.js'));
var express = require('express');
var functions = require(path.resolve('./', 'utils/functions.js'));
var router=express.Router();

// api to get merchants
router.post("/getMerchants", functions.decryptDataMiddleWare, api.getMerchants);

// api to get merchants
router.post("/getMerchantsWithFilter", functions.decryptDataMiddleWare, api.getMerchantsWithFilter);

// api to create merchant
router.post("/createMerchant", functions.decryptDataMiddleWare, api.createMerchant);

// api to get merchants
router.post("/getMerchantDetails", functions.decryptDataMiddleWare, api.getMerchantDetails);

// api to delete merchant
router.post("/deleteMerchant", functions.decryptDataMiddleWare, api.deleteMerchant);

// api to update merchant
router.post("/updateMerchant", functions.decryptDataMiddleWare, api.updateMerchant);


module.exports=router;
