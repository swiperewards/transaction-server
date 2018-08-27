var path =require('path');
var api=require(path.resolve('.','modules/merchant/merchantController.js'));
var express = require('express');
var router=express.Router();

// api to get merchants
router.post("/getMerchants", api.getMerchants);

// api to get merchants
router.post("/getMerchantsWithFilter", api.getMerchantsWithFilter);

// api to create merchant
router.post("/createMerchant", api.createMerchant);

// api to get merchants
router.post("/getMerchantDetails", api.getMerchantDetails);

// api to delete merchant
router.post("/deleteMerchant", api.deleteMerchant);

// api to update merchant
router.post("/updateMerchant", api.updateMerchant);


module.exports=router;
