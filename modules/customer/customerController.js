var path = require('path');
var logger = require(path.resolve('./logger'))
var responseGenerator = require(path.resolve('.', 'utils/responseGenerator.js'))
var request = require('request');
var splash = require(path.resolve('.', 'modules/splash/splashController.js'));
var db = require(path.resolve('.', 'modules/database/databaseConnector.js'));


/**
 * This function is used to onboard the customer to splash server.
 * It is required to onboard every customer from splash to get their customer id's.
 * This api will get called once user register from native apps.
 * On register request Nouvo server 1 will call this Nouvo transaction server api, if onboarding successful then 
 * only user will be onboarded to server 1.
 * @author vishal.bharati
 * @param {*} req 
 * @param {*} res 
 */
exports.createCustomer = function (req, res) {
    splash.createCustomer(req.body, function (error, results) {
        if (error) {
            logger.info("Error while creating customer");
            res.send(responseGenerator.getResponse(1181, msg.splashError, error));
        }
        else if (results) {
            if (results.body) {

                if (results.body.response.errors.length > 50) {
                    logger.info("Error while creating customer");
                    res.send(responseGenerator.getResponse(1184, "Error while creating customer", results.body.response.errors));
                }
                else if (results.body.response.data.length > 0) {
                    res.send(responseGenerator.getResponse(200, "Customer created successfully", results.body.response.data));
                }
            }
        }
    });
}


/**
 * This function is used to onboard the customer credit cards to splash server.
 * It is required to onboard every customer from splash to get their customtokens id's.
 * This api will get called once user register from native apps.
 * On register request Nouvo server 1 will call this Nouvo transaction server api, if onboarding successful then 
 * only tokens/credit careds will be onboarded to server 1.
 * @author vishal.bharati
 * @param {*} req 
 * @param {*} res 
 */
exports.createToken = function (req, res) {
    splash.createToken(req.body, function (error, results) {
        if (error) {
            logger.info("Error while creating token");
            res.send(responseGenerator.getResponse(1181, msg.splashError, error));
        }
        else if (results) {
            if (results.body) {
                if (results.body.response.errors.length > 0) {
                    logger.info("Error while creating token");
                    res.send(responseGenerator.getResponse(1184, "Error while creating token", results.body.response.errors));
                }
                else if (results.body.response.data.length > 0) {
                    //INSERT CREDIT CARD DETAILS HERE
                    res.send(responseGenerator.getResponse(200, "Token created successfully", results.body.response.data));
                }
            }
        }
    });
}


exports.addCard = function (req, res) {
    var params = [req.body.requestData.id, req.body.requestData.cardNumber, req.body.requestData.userId];
    var query = "insert into cards (id, cardNumber, userId) values(?,?,?)";
    db.query(query, params, function (errorAddCard, resultsAddCard) {
        if (!errorAddCard) {
            var params = [req.body.requestData.userId];
            var query = "select * from users where userId = ?";
            db.query(query, params, function (errorIfUserExists, resultsIfUserExists) {
                if (!errorIfUserExists) {
                    if (resultsIfUserExists.length > 0) {
                        res.send(responseGenerator.getResponse(200, "Success", null));
                    }
                    else {
                        var params = [req.body.requestData.userId];
                        var query = "insert into users (userId) values(?)";
                        db.query(query, params, function (errorInsertUser, resultsInsertUser) {
                            if (!errorInsertUser) {
                                res.send(responseGenerator.getResponse(200, "Success", null));
                            }
                            else {
                                logger.error("Error while processing your request", errorInsertUser);
                                res.send(responseGenerator.getResponse(1005, msg.dbError, errorInsertUser))
                            }
                        });
                    }
                }
                else {
                    logger.error("Error while processing your request", errorIfUserExists);
                    res.send(responseGenerator.getResponse(1005, msg.dbError, errorIfUserExists))
                }
            });
        }
        else {
            logger.error("Error while processing your request", errorAddCard);
            res.send(responseGenerator.getResponse(1005, msg.dbError, errorAddCard))
        }
    });
}
