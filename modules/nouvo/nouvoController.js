var path = require('path');
var config = require(path.resolve('./', 'config'));
var logger = require(path.resolve('./logger'));
var request = require('request');
/**
 * This class is used to call the Nouvo server 1 api's from Nouvo transaction server (server 2).
 * @author vishal.bharati
 */

 /**
  * This function is used to get the active deals from Nouvo server 1 and pass the result back to caller with array of deals.
  * @param {*} Reqbody 
  * @param {*} callback 
  */
function getActiveDeals(Reqbody,callback) {

    request({
        url: config.nouvoApiUrl + "/deals/getActiveDeals",
        method: 'POST',
        headers:
            {
                'Content-Type': 'application/json'
            },
        json: true,
        body: Reqbody
    }, function (err, res) {
        callback(err, res);
    })

}


/**
  * This function is update the total swipe amounts of active deals which is placed at Nouvo server 1.
  * @param {*} Reqbody 
  * @param {*} callback 
  */
function updatePoolAmounts(Reqbody,callback) {

    request({
        url: config.nouvoApiUrl + "/deals/updatePoolAmounts",
        method: 'POST',
        headers:
            {
                'Content-Type': 'application/json'
            },
        json: true,
        body: Reqbody
    }, function (err, res) {
        callback(err, res);
    })

}



module.exports = {
    getActiveDeals: getActiveDeals,
    updatePoolAmounts:updatePoolAmounts
}

