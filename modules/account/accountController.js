var path = require('path');
var splash = require(path.resolve('.', 'modules/splash/splashController.js'));
var responseGenerator = require(path.resolve('.', 'utils/responseGenerator.js'));
var config = require(path.resolve('./', 'config'));
var logger = require(path.resolve('./logger'));
var msg = require(path.resolve('./', 'utils/errorMessages.js'));
var db = require(path.resolve('.', 'modules/database/databaseConnector.js'));
var each = require("sync-each");



exports.updateAccount = function (req, res) {

    Reqbody = {};
    req.body.requestData.account ? (Reqbody.account = req.body.requestData.account) : 0;
    req.body.requestData.name ? (Reqbody.name = req.body.requestData.name) : 0;
    req.body.requestData.description ? (Reqbody.description = req.body.requestData.description) : 0;
    req.body.requestData.primary ? (Reqbody.primary = req.body.requestData.primary) : 0;
    req.body.requestData.status ? (Reqbody.status = req.body.requestData.status) : 0;
    req.body.requestData.accountId ? (Reqbody.accountId = req.body.requestData.accountId) : 0;

    splash.updateAccount(Reqbody, function (error, results) {
        if (error) {
            logger.info("Error while updating account - " + req.body.userId);
            res.send(responseGenerator.getResponse(1081, msg.splashError, error));
        }
        else if (results) {
            if (results.body) {

                if (results.body.response.errors.length > 0) {
                    logger.info("Error while updating account - " + req.body.userId);
                    res.send(responseGenerator.getResponse(1084, "Error while updating account", results.body.response.errors));
                }
                else if (results.body.response.data.length > 0) {
                    var accountNum, routingNum;
                    var str = req.body.requestData.account.number;
                    var index = str.indexOf(results.body.response.data[0].account.number);
                    if (index >= 0) {
                        accountNum = req.body.requestData.account.number;
                        routingNum = req.body.requestData.account.routing;
                    }

                    var accountObjAfterSubstitution = results.body.response.data[0].account;
                    accountObjAfterSubstitution.number = accountNum;
                    accountObjAfterSubstitution.routing = routingNum;

                    var accountData = {
                        "id": results.body.response.data[0].id,
                        "account": results.body.response.data[0].account ? JSON.stringify(accountObjAfterSubstitution) : null,
                        "created": results.body.response.data[0].created ? results.body.response.data[0].created : null,
                        "modified": results.body.response.data[0].modified ? results.body.response.data[0].modified : null,
                        "modifier": results.body.response.data[0].modifier ? results.body.response.data[0].modifier : null,
                        "entity": results.body.response.data[0].entity ? results.body.response.data[0].entity : null,
                        "token": results.body.response.data[0].token ? results.body.response.data[0].token : null,
                        "name": results.body.response.data[0].name ? results.body.response.data[0].name : null,
                        "description": results.body.response.data[0].description ? results.body.response.data[0].description : null,
                        "primary": results.body.response.data[0].primary,
                        "status": results.body.response.data[0].status,
                        "currency": results.body.response.data[0].currency ? results.body.response.data[0].currency : null,
                        "inactive": results.body.response.data[0].inactive,
                        "frozen": results.body.response.data[0].frozen
                    };
                    var params = [accountData.account, accountData.created,
                    accountData.modified, accountData.modifier,
                    accountData.entity, accountData.token, accountData.name,
                    accountData.description, accountData.primary, accountData.status,
                    accountData.currency, accountData.inactive, accountData.frozen, accountData.id];
                    var query = "update accounts set `account_v`= ?,`created_v`= ?,`modified_v`= ?," +
                        "`modifier_v`= ?,`entity_v`= ?,`token_v`= ?,`name_v`= ?,`description_v`= ?," +
                        "`primary_v`= ?,`status_v`= ?,`currency_v`= ?,`inactive_v`= ?,`frozen_v`= ? where `id`=?";
                    db.query(query, params, function (errorAccountUpdate, resultsAccountUpdate) {
                        if (!errorAccountUpdate) {
                            if (resultsAccountUpdate.affectedRows == 1) {
                                logger.info("Account updated successfully");
                                res.send(responseGenerator.getResponse(200, "Account updated successfully", accountData));
                            }
                            else {
                                logger.info("Something went wrong - " + req.body.userId);
                                res.send(responseGenerator.getResponse(1083, "Something went wrong", null));
                            }
                        }
                        else {
                            logger.error("Error while processing your request", errorAccountUpdate);
                            res.send(responseGenerator.getResponse(1005, msg.dbError, errorAccountUpdate))
                        }
                    });

                }
                else {
                    logger.info("Invalid account id - " + req.body.userId);
                    res.send(responseGenerator.getResponse(1085, "Invalid account id", null));
                }
            }
            else {
                logger.info("Something went wrong - " + req.body.userId);
                res.send(responseGenerator.getResponse(1083, "Something went wrong", null));
            }

        }
        else {
            logger.info("Something went wrong - " + req.body.userId);
            res.send(responseGenerator.getResponse(1083, "Something went wrong", null));
        }
    });
}
