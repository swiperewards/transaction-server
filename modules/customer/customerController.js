var path = require('path');
var logger = require(path.resolve('./logger'))
var responseGenerator = require(path.resolve('.', 'utils/responseGenerator.js'))
var request = require('request');
var splash = require(path.resolve('.', 'modules/splash/splashController.js'));


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
