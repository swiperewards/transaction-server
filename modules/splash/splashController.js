var path = require('path');
var config = require(path.resolve('./', 'config'));
var logger = require(path.resolve('./logger'));
var request = require('request');

function getMerchants(callback) {

    request({
        url: config.splashApiUrl + "/merchants",
        method: 'GET',
        headers:
            {
                'Content-Type': 'application/json',
                'APIKEY': config.splashApiPrivateKey
            },
        json: true
    }, function (err, res) {
        callback(err, res);
    })

}


function createMerchant(Reqbody, callback) {
    
    request({
        url: config.splashApiUrl + "/merchants",
        method: 'POST',
        headers:
            {
                'Postman-Token': '9cb7d219-c4a8-4ac4-9b6c-6cf2683b1742',
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/x-www-form-urlencoded',
                APIKEY: config.splashApiPrivateKey
            },
        form: Reqbody,
        json: true
    }, function (err, res) {
        callback(err, res);
    })

}


function deleteMerchant(Reqbody, callback) {
    
    request({
        url: config.splashApiUrl + "/merchants/" + Reqbody.merchantId,
        method: 'PUT',
        headers:
            {
                'Postman-Token': '9cb7d219-c4a8-4ac4-9b6c-6cf2683b1742',
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/x-www-form-urlencoded',
                APIKEY: config.splashApiPrivateKey
            },
        form: Reqbody,
        json: true
    }, function (err, res) {
        callback(err, res);
    })

}


function updateMerchant(Reqbody, callback) {
    
    request({
        url: config.splashApiUrl + "/merchants/" + Reqbody.merchantId,
        method: 'PUT',
        headers:
            {
                'Postman-Token': '9cb7d219-c4a8-4ac4-9b6c-6cf2683b1742',
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/x-www-form-urlencoded',
                APIKEY: config.splashApiPrivateKey
            },
        form: Reqbody,
        json: true
    }, function (err, res) {
        callback(err, res);
    })

}


function updateEntity(Reqbody, callback) {
    
    request({
        url: config.splashApiUrl + "/entities/" + Reqbody.entityId,
        method: 'PUT',
        headers:
            {
                'Postman-Token': '9cb7d219-c4a8-4ac4-9b6c-6cf2683b1742',
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/x-www-form-urlencoded',
                APIKEY: config.splashApiPrivateKey
            },
        form: Reqbody,
        json: true
    }, function (err, res) {
        callback(err, res);
    })

}


function createMember(Reqbody, callback) {
    request({
        url: config.splashApiUrl + "/members",
        method: 'POST',
        headers:
            {
                'Postman-Token': '9cb7d219-c4a8-4ac4-9b6c-6cf2683b1742',
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/x-www-form-urlencoded',
                APIKEY: config.splashApiPrivateKey
            },
        form: Reqbody,
        json: true
    }, function (err, res) {
        callback(err, res);
    })
}

function updateMember(Reqbody, callback) {
    request({
        url: config.splashApiUrl + "/members/" + Reqbody.memberId,
        method: 'PUT',
        headers:
            {
                'Postman-Token': '9cb7d219-c4a8-4ac4-9b6c-6cf2683b1742',
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/x-www-form-urlencoded',
                APIKEY: config.splashApiPrivateKey
            },
        form: Reqbody,
        json: true
    }, function (err, res) {
        callback(err, res);
    })
}


function updateAccount(Reqbody, callback) {
    request({
        url: config.splashApiUrl + "/accounts/" + Reqbody.accountId,
        method: 'PUT',
        headers:
            {
                'Postman-Token': '9cb7d219-c4a8-4ac4-9b6c-6cf2683b1742',
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/x-www-form-urlencoded',
                APIKEY: config.splashApiPrivateKey
            },
        form: Reqbody,
        json: true
    }, function (err, res) {
        callback(err, res);
    })
}

module.exports = {
    getMerchants: getMerchants,
    createMerchant: createMerchant,
    deleteMerchant: deleteMerchant,
    updateMerchant: updateMerchant,
    updateEntity: updateEntity,
    updateMember: updateMember,
    updateAccount: updateAccount,
    createMember: createMember
}

