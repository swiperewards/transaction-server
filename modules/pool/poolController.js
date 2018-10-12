var path = require('path');
var con = require('../database/databaseConnector');
var logger = require(path.resolve('./logger'))
var responseGenerator = require(path.resolve('.', 'utils/responseGenerator.js'))
var each = require('sync-each');
var dateFormat = require('dateformat');





/**
* Begin db transaction
* 1) truncate table deal_pool
* 2) insert the active deal detaiils to truncated deal_pool table.
* 3) Perfrom join query on temporary table deal_pool and get the total swiped amount for the merchant of the particular active deal.
* @author vishal.bharati
* @param {*} req 
* @param {*} callback 
*/

function getPoolAmountByMerchantDetails(req, callback) {

    var poolRequest = [];
    poolRequest = req;


    /**
     * Begin db transaction
    */

    con.beginTransaction(function (err) {
        if (err) {
            throw err;
        }

        // truncate the temporary active deal details table which was used to perform table join operation.
        var query = 'truncate table deal_pool';
        con.query(query, function (error, results) {
            if (!error) {
                console.log('Total pools received ' + poolRequest.length);
                var arr = [];
                //Inserting all active deals details to temporary table which is needed to perform join operation.
                each(poolRequest,
                    function (merchantDealDetail, next) {
                        arr.push(merchantDealDetail);
                        var startDate = dateFormat(merchantDealDetail.startDate, "yyyy-mm-dd");
                        var endDate = dateFormat(merchantDealDetail.endDate, "yyyy-mm-dd");
                        var params = [merchantDealDetail.id, merchantDealDetail.merchantId, startDate, endDate];
                        var insertQuery = 'replace INTO deal_pool(deal_id,merchant,start_date,end_date) VALUES (?,?,? ,?)';

                        con.query(insertQuery, params, function (err, result) {
                            if (err) {
                                console.log('Callback insert Error.' + err);
                                con.rollback(function () {
                                    console.log('Rollbacking Insert.' + err);
                                    // throw err;
                                });
                            }
                            next(err, arr)
                        });
                    },
                    function (err, transformedItems) {
                        if (!err) {
                            con.commit(function (err) {
                                if (err) {
                                    con.rollback(function () {
                                        console.log('Insertion Error while commiting.' + err);
                                        // throw err;
                                    });
                                }

                                else {
                                    console.log('All active deal details inserted to temporary table.');

                                    //All active deals fetched and inserted to temporary table now perform get 
                                    //total swipe amount for all active deals and pass the result back to caller.
                                    var query = 'SELECT t2.deal_id,t1.merchant, sum(t1.settledtotal) as registeredSwipeAmt, 0 as nonRegisteredSwipeAmt ' +
                                        'FROM transaction t1 join deal_pool t2 on t1.merchant=t2.merchant ' +
                                        'where t1.settled>=t2.start_date and t1.settled<=t2.end_date group by merchant';
                                    con.query(query, function (error, results) {
                                        callback(error, results)
                                    })
                                }
                            });
                        }
                    })

            } else {
                logger.error("Error while processing your request", error);

            }
        })

    });

}







/**
 * This api function is same as 'getPoolAmountByMerchantDetails' defined just for testing purpose which needs to be called form postman.
 * @param {*} req 
 * @param {*} resp 
 */
exports.getPoolAmountByMerchantId = function (req, resp) {

    var poolRequest = [];
    poolRequest = req.body;
    con.beginTransaction(function (err) {
        if (err) {
            throw err;
        }

        // truncateTable

        var query = 'truncate table deal_pool';
        con.query(query, function (error, results) {
            if (!error) {

                console.log('Total pools received ' + poolRequest.length);
                var arr = [];
                //arr.push();
                each(poolRequest,
                    function (merchantDealDetail, next) {
                        arr.push(merchantDealDetail);
                        var params = [merchantDealDetail.merchantId, merchantDealDetail.startDate, merchantDealDetail.endDate];
                        var insertQuery = 'replace INTO deal_pool(merchant,start_date,end_date) VALUES (?,? ,?)';

                        con.query(insertQuery, params, function (err, result) {
                            if (err) {
                                console.log('Callback insert Error.' + err);
                                con.rollback(function () {
                                    console.log('Rollbacking Insert.' + err);
                                    // throw err;
                                });
                            }
                            next(err, arr)
                        });
                    },
                    function (err, transformedItems) {
                        if (!err) {
                            con.commit(function (err) {
                                if (err) {
                                    con.rollback(function () {
                                        console.log('Insertion Error while commiting.' + err);
                                        // throw err;
                                    });
                                }


                                console.log('Transaction Complete.');

                                var query = 'SELECT t1.merchant, sum(t1.settledtotal) as registeredSwipeAmt, sum(t1.settledtotal) as nonRegisteredSwipeAmt FROM transaction t1 join deal_pool t2 on t1.merchant=t2.merchant' +
                                    ' where t1.settled>=t2.start_date and t1.settled<=t2.end_date group by merchant';
                                con.query(query, function (error, results) {
                                    if (!error) {
                                        resp.send(responseGenerator.getResponse(200, "Success", results))
                                    } else {
                                        logger.error("Error while processing your request", error);
                                        resp.send(responseGenerator.getResponse(1005, msg.dbError, null))
                                    }
                                })
                            });

                        }



                        // con.end();

                        //Success callback
                    })



            } else {
                logger.error("Error while processing your request", error);
                resp.send(responseGenerator.getResponse(1005, msg.dbError, null))
            }
        })

    });


}



module.exports = {
    getPoolAmountByMerchantDetails: getPoolAmountByMerchantDetails
}


