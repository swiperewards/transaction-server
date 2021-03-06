var path = require('path');
var con = require('../database/databaseConnector');
var config = require(path.resolve('./', 'config'))
var logger = require(path.resolve('./logger'))
var request = require('request');
var schedule = require('node-schedule');
var each = require('sync-each');
var nouvoController = require(path.resolve('.', 'modules/nouvo/nouvoController.js'));
var poolController = require(path.resolve('.', 'modules/pool/poolController.js'));
var defaultPageIndex = 1;
var cronIntervalTimeInMillis = 300000; // Interval of 300 seconds to get the transactions from splash server.
var myresp;
var responseGenerator = require(path.resolve('.', 'utils/responseGenerator.js'));
var functions = require(path.resolve('./', 'utils/functions.js'));

/**
 * This class performs below function
 * 1) Fetch the new and updated transactions recursively from Splash server.
 * 2) Call poolcontroler class function to get the active deals and calculate their transaction over period of time
 * @author vishal.bharati
 */

//Init transaction fetch process once server starts.
init();

/**
 * This function get the max modified date of the already fetched transactins and send it to splash server to fetch
 * further transactions.
 */
function init() {
    getMaxModifedDate(
        function (maxModifiedDate) {
            fetchTransactoinFromSplash(defaultPageIndex, maxModifiedDate)
        }
    );
}


/**
 * This function call the Splash api to fetch the transactions.
 * "Database transactions" has been used to imprved the performance and ensuring the integrity of the data.
 * @param {*} pageNumber  - In case of pagination this works as index of the page to be fetched.
 * @param {*} maxModifiedDate  - Max modifed date of already fetched transactions.
 */

function fetchTransactoinFromSplash(pageNumber, maxModifiedDate) {
    // maxModifiedDate = maxModifiedDate.toISOString();
    console.log('modifiedDate ' + maxModifiedDate);

    // and[][modified][sort]=asc&and[][modified][Greater]=
    request({
        url: config.splashApiUrl + "/txns/?expand[payment][]&page[limit]=5&page[number]=" + pageNumber,
        method: 'GET',
        headers:
            {
                'Content-Type': 'application/json',
                'APIKEY': config.splashApiPrivateKey,
                // 'search': 'modified[Greater]=' + maxModifiedDate,
                'search': 'and[][modified][sort]=asc&and[][modified][Greater]=' + maxModifiedDate
            },
        json: true
    }, function (err, splashResponse) {

        if (err) {
            console.log('Error while communicating with Splash.' + err);
            setNextScheduledBatchInterval();
        } else {
            // saveTransactionToDatabase(res,splashResponse.body.data)
            if (splashResponse != null && splashResponse.body != null && splashResponse.body.response != null && splashResponse.body.response.data != null) {

                // if (myresp != null) {
                //     myresp.send(responseGenerator.getResponse(200, null, splashResponse));

                // }
                con.beginTransaction(function (err) {
                    if (err) {
                        throw err;
                    }
                    console.log('Total Transactions received ' + splashResponse.body.response.data.length);
                    var arr = [];
                    //Inserting transactions one by one into the database using db transactions.
                    each(splashResponse.body.response.data,
                        function (txn, next) {
                            con.query("SELECT c.cardNumber, c.userId, u.txnXP from cards c join users u on c.userId = u.userId where c.cardNumber like ?", [txn.payment.bin + "%" + txn.payment.number], function (errCheckCardExists, resultCheckCardExists) {
                                var userId = null;
                                var isNouvoUser = (resultCheckCardExists.length > 0) ? "1" : "0";
                                if (isNouvoUser == 1) {
                                    userId = resultCheckCardExists[0].userId;
                                }
                                con.query("select * from transactions where id = ?", [txn.id], function (errGetPreviousRecord, resultGetPreviousRecord) {

                                    if (resultGetPreviousRecord.length > 0) {
                                        // if(txn.status == "5") {

                                        // }
                                        insertRecord();
                                    }
                                    else {
                                        if (isNouvoUser == 1) {
                                            var xpCalculated = resultCheckCardExists[0].txnXP + (txn.total / 100)
                                            con.query("update users set txnXP = ? where userId = ?", [xpCalculated, resultCheckCardExists[0].userId], function (errUpdateXP, resultUpdateXP) {
                                                if (errUpdateXP) {
                                                    console.log('Callback Transaction Error.' + err);
                                                    con.rollback(function () {
                                                        console.log('Rollbacking Transactions.' + err);
                                                        // throw err;
                                                    });
                                                    setNextScheduledBatchInterval();
                                                }
                                                else {
                                                    insertRecord();
                                                }
                                            });
                                        }
                                        else
                                            insertRecord();

                                    }
                                });

                                function insertRecord() {
                                    // arr.push(txn);
                                    var params = [txn.id, txn.created, txn.modified, txn.creator, txn.modifier, txn.ipCreated, txn.ipModified, txn.merchant, txn.token, txn.fortxn, txn.fromtxn, txn.batch, txn.subscription, txn.type, txn.expiration, txn.currency, txn.authDate, txn.authCode, txn.captured, txn.settled, txn.settledCurrency, txn.settledTotal, txn.allowPartial, txn.order, txn.description, txn.descriptor, txn.terminal, txn.terminalCapability, txn.entryMode, txn.origin, txn.tax, txn.total, txn.cashback, txn.authorization, txn.approved, txn.cvv, txn.swiped, txn.emv, txn.signature, txn.unattended, txn.clientIp, txn.first, txn.middle, txn.last, txn.company, txn.email, txn.address1, txn.address2, txn.city, txn.state, txn.zip, txn.country, txn.phone, txn.status, txn.refunded, txn.reserved, txn.misused, txn.checkStage, txn.imported, txn.inactive, txn.frozen, txn.discount, txn.shipping, txn.duty, txn.pin, txn.traceNumber, txn.cvvStatus, txn.unauthReason, txn.fee, txn.fundingCurrency, txn.authentication, txn.authenticationId, txn.payment.method, txn.payment.number, txn.payment.routing, txn.payment.bin, isNouvoUser, userId];
                                    var insertQuery = 'replace INTO transactions(id,created,modified,creator,modifier,ipCreated,ipModified,merchant,token,fortxn,fromtxn,batch,subscription,txnType,expiration,currency,authDate,authCode,captured,settled,settledCurrency,settledTotal,allowPartial,txnOrder,txnDescription,descriptor,terminal,terminalCapability,entryMode,origin,tax,total,cashback,authorization,approved,cvv,swiped,emv,signature,unattended,clientIp,firstName,middleName,lastName,company,email,address1,address2,city,state,zip,country,phone,txnStatus,refunded,reserved,misused,checkStage,imported,inactive,frozen,discount,shipping,duty,pin,traceNumber,cvvStatus,unauthReason,fee,fundingCurrency,authentication,authenticationId,paymentMethod,paymentNumber,paymentRouting,paymentBin,isNouvoUser,userId) VALUES (?,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,?,?,?,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,?,?,?,?,?,?,?)';

                                    con.query(insertQuery, params, function (err, result) {
                                        if (err) {
                                            console.log('Callback Transaction Error.' + err);
                                            con.rollback(function () {
                                                console.log('Rollbacking Transactions.' + err);
                                                // throw err;
                                            });
                                            setNextScheduledBatchInterval();
                                        }
                                        else
                                            next(err, arr)
                                    });
                                }

                            });


                        },
                        function (err, transformedItems) {
                            if (!err) {
                                con.commit(function (err) {
                                    if (err) {
                                        con.rollback(function () {
                                            console.log('Transaction Error while commiting.' + err);
                                            setNextScheduledBatchInterval();
                                            // throw err;
                                        });
                                    }
                                    console.log('All records inserted & transaction completed.');
                                });

                            }

                            // con.end();


                            //Getting next set of statements
                            if (splashResponse != null && splashResponse.body != null
                                && splashResponse.body.response != null && splashResponse.body.response.details != null &&
                                splashResponse.body.response.details.page != null &&
                                splashResponse.body.response.details.page.hasMore == true) {

                                fetchTransactoinFromSplash(splashResponse.body.response.details.page.current + 1, maxModifiedDate);
                            } else {
                                //All transactions has been fetched.

                                //Get the active deals from Nouvo server 1 and update server 1 with updated pool amounts.
                                getActiveDealsAndUpdatePoolAmounts();
                            }
                            //Success callback
                        })
                });
            }
        }
    })
}


/**
 * Function to scheduled the next sync job for getting the transactions from Splash.
 */
function setNextScheduledBatchInterval() {
    var nextScheduledTime = new Date(Date.now() + cronIntervalTimeInMillis);
    schedule.scheduleJob(nextScheduledTime, function () {
        init();
    });
}

/**
 * Function to get the max modified date of already fetched transactions.
 * It will help sync scheulder to fetch only new transactions and updated transactions after updated date.
 * @param {*} callback  - Callback which returns the max modified date.
 */
function getMaxModifedDate(callback) {
    var query = "SELECT max(modified) as maxModified FROM transactions";
    con.query(query, function (err, resultMaxDate) {
        if (!err && resultMaxDate != null && resultMaxDate[0]['maxModified'] != null && resultMaxDate.length > 0) {
            maxModifiedDate = resultMaxDate[0]['maxModified']
            maxModifiedDate = maxModifiedDate.toISOString();
            callback(maxModifiedDate);
        } else {
            // return default date in case of error or in case no records found
            callback('1970-01-01T00:00:00.000Z');
        }
    })
}

/**
 * Function which get the active deals along with their deal id, merchant id, start & end date
 *  and calculate their total transaction amount as per the provided date range. 
 */
function getActiveDealsAndUpdatePoolAmounts() {
    var body = {};
    nouvoController.getActiveDeals(function (error, response) {
        if (error) {
            logger.error("Error while getting active deals", error);
            setNextScheduledBatchInterval();
        } else {

            response.body.responseData = functions.decryptData(response.body.responseData);
            if (response != null && response.body != null && response.body.responseData != null) {
                //If active deals found then get the pool amount using below function of poolController class.
                poolController.getPoolAmountByMerchantDetails(response.body.responseData, function (error, poolAmtResponse) {
                    if (error) {
                        logger.error("Error while getting active deals", error);
                        setNextScheduledBatchInterval();
                    } else {
                        //Once pool amount is calculated call Nouvo server 1 api to update the  amounts total nouvo user transactions & non nouvo transactions..
                        nouvoController.updatePoolAmounts(poolAmtResponse, function (error, response) {
                            if (error) {
                                logger.error("Error while getting active deals", error);
                                setNextScheduledBatchInterval();
                            } else {
                                //Pool amounts has been updated successfully at Nouvo server 1 
                                //Now XP points needs to be calculated.
                                console.log('Success callback pool amount update at server 2 from server 1');

                                //All transactions has been fetched set next transaction sync scheduler
                                // commenting below function call to add new function call before it
                                // setNextScheduledBatchInterval();
                                getExpiredDealsAndUpdateRewards();

                            }
                        });
                    }
                });
            }
            else {
                logger.error("Error while getting active deals", error);
                setNextScheduledBatchInterval();
            }
        }
    })
}

// function to get expired deals, calculate stakes and distribute rewards
function getExpiredDealsAndUpdateRewards() {

    var body = {};
    nouvoController.getExpiredDeals(function (error, response) {
        if (error) {
            logger.error("Error while getting active deals", error);
            setNextScheduledBatchInterval();
        } else {
            var stakeCalculated = [];
            response.body.responseData = functions.decryptData(response.body.responseData);
            if (response != null && response.body != null && response.body.responseData != null) {
                
                if (response.body.responseData.length > 0) {
                    each(response.body.responseData,
                        function (deal, next) {

                            var params = [deal.merchantId, deal.startDate, deal.endDate];
                            var query = 'call GetStakeOfAllUsersForMerchant(?,?,?)';

                            var stakeForMerchant = {};
                            stakeForMerchant.merchantId = deal.merchantId;
                            stakeForMerchant.endDate = deal.endDate;
                            stakeForMerchant.id = deal.id;
                            con.query(query, params, function (err, result) {
                                if (err) {
                                    setNextScheduledBatchInterval();
                                }
                                else {
                                    if (result[0].length > 0) {
                                        stakeForMerchant.stake = result[0];
                                        stakeCalculated.push(stakeForMerchant);
                                        next(err);
                                    }
                                    else {
                                        stakeForMerchant.stake = [];
                                        stakeCalculated.push(stakeForMerchant);
                                        next(err);
                                    }
                                    
                                }
                            });
                            // next(err);
                        },
                        function (err) {
                            if (!err) {
                                // stakeCalculated
                                // setNextScheduledBatchInterval();
                                nouvoController.distributeRewards(stakeCalculated, function (error, response) {
                                    if (error) {
                                        logger.error("Error while getting active deals", error);
                                        setNextScheduledBatchInterval();
                                    } else {
                                        setNextScheduledBatchInterval();
                                    }
                                });
                            }
                        })
                }
                else {
                    setNextScheduledBatchInterval();
                }

            }
            else {
                logger.error("Error while getting active deals", error);
                setNextScheduledBatchInterval();
            }
        }
    })
}