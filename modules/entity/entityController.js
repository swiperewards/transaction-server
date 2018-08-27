var path = require('path');
var splash = require(path.resolve('.', 'modules/splash/splashController.js'));
var responseGenerator = require(path.resolve('.', 'utils/responseGenerator.js'));
var config = require(path.resolve('./', 'config'));
var logger = require(path.resolve('./logger'));
var msg = require(path.resolve('./', 'utils/errorMessages.js'));
var db = require(path.resolve('.', 'modules/database/databaseConnector.js'));


exports.updateEntity = function (req, res) {

    Reqbody = {};
    Reqbody.login = config.entityLogin;
    req.body.requestData.type ? (Reqbody.type = req.body.requestData.type) : 0;
    req.body.requestData.address1 ? (Reqbody.address1 = req.body.requestData.address1) : 0;
    req.body.requestData.address2 ? (Reqbody.address2 = req.body.requestData.address2) : 0;
    req.body.requestData.city ? (Reqbody.city = req.body.requestData.city) : 0;
    req.body.requestData.state ? (Reqbody.state = req.body.requestData.state) : 0;
    req.body.requestData.zip ? (Reqbody.zip = req.body.requestData.zip) : 0;
    req.body.requestData.country ? (Reqbody.country = req.body.requestData.country) : 0;
    req.body.requestData.timezone ? (Reqbody.timezone = req.body.requestData.timezone) : 0;
    req.body.requestData.phone ? (Reqbody.phone = req.body.requestData.phone) : 0;
    req.body.requestData.fax ? (Reqbody.fax = req.body.requestData.fax) : 0;
    req.body.requestData.email ? (Reqbody.email = req.body.requestData.email) : 0;
    req.body.requestData.website ? (Reqbody.website = req.body.requestData.website) : 0;
    req.body.requestData.ein ? (Reqbody.ein = req.body.requestData.ein) : 0;
    req.body.requestData.tcVersion ? (Reqbody.tcVersion = req.body.requestData.tcVersion) : 0;
    req.body.requestData.tcDate ? (Reqbody.tcDate = req.body.requestData.tcDate) : 0;
    req.body.requestData.tcIp ? (Reqbody.tcIp = req.body.requestData.tcIp) : 0;
    req.body.requestData.tcAcceptDate ? (Reqbody.tcAcceptDate = req.body.requestData.tcAcceptDate) : 0;
    req.body.requestData.tcAcceptIp ? (Reqbody.tcAcceptIp = req.body.requestData.tcAcceptIp) : 0;
    req.body.requestData.custom ? (Reqbody.custom = req.body.requestData.custom) : 0;
    req.body.requestData.inactive ? (Reqbody.inactive = req.body.requestData.inactive) : 0;
    req.body.requestData.frozen ? (Reqbody.frozen = req.body.requestData.frozen) : 0;
    req.body.requestData.reserved ? (Reqbody.reserved = req.body.requestData.reserved) : 0;
    req.body.requestData.checkStage ? (Reqbody.checkStage = req.body.requestData.checkStage) : 0;
    req.body.requestData.public ? (Reqbody.public = req.body.requestData.public) : 0;
    req.body.requestData.customerPhone ? (Reqbody.customerPhone = req.body.requestData.customerPhone) : 0;
    req.body.requestData.entityId ? (Reqbody.entityId = req.body.requestData.entityId) : 0;

    splash.updateEntity(Reqbody, function (error, results) {
        if (error) {
            logger.info("Error while creating merchants - " + req.body.userId);
            res.send(responseGenerator.getResponse(1081, msg.splashError, error));
        }
        else if (results) {
            if (results.body) {

                if (results.body.response.errors.length > 0) {
                    logger.info("Error while deleting merchant - " + req.body.userId);
                    res.send(responseGenerator.getResponse(1084, "Error while deleting merchant", results.body.response.errors));
                }
                else if (results.body.response.data.length > 0) {
                    //Success callback
                    var entityData = {
                        "id": results.body.response.data[0].id,
                        "created": results.body.response.data[0].created ? results.body.response.data[0].created : null,
                        "modified": results.body.response.data[0].modified ? results.body.response.data[0].modified : null,
                        "creator": results.body.response.data[0].creator ? results.body.response.data[0].creator : null,
                        "modifier": results.body.response.data[0].modifier ? results.body.response.data[0].modifier : null,
                        "ipCreated": results.body.response.data[0].ipCreated ? results.body.response.data[0].ipCreated : null,
                        "ipModified": results.body.response.data[0].ipModified ? results.body.response.data[0].ipModified : null,
                        "login": results.body.response.data[0].login ? results.body.response.data[0].login : null,
                        "type": results.body.response.data[0].type ? results.body.response.data[0].type : null,
                        "name": results.body.response.data[0].name ? results.body.response.data[0].name : null,
                        "address1": results.body.response.data[0].address1 ? results.body.response.data[0].address1 : null,

                        "address2": results.body.response.data[0].address2 ? results.body.response.data[0].address2 : null,

                        "city": results.body.response.data[0].city ? results.body.response.data[0].city : null,
                        "state": results.body.response.data[0].state ? results.body.response.data[0].state : null,
                        "zip": results.body.response.data[0].zip ? results.body.response.data[0].zip : null,
                        "country": results.body.response.data[0].country ? results.body.response.data[0].country : null,
                        "timezone": results.body.response.data[0].timezone ? results.body.response.data[0].timezone : null,
                        "phone": results.body.response.data[0].phone ? results.body.response.data[0].phone : null,

                        "fax": results.body.response.data[0].fax ? results.body.response.data[0].fax : null,

                        "email": results.body.response.data[0].email ? results.body.response.data[0].email : null,
                        "website": results.body.response.data[0].website ? results.body.response.data[0].website : null,
                        "ein": results.body.response.data[0].ein ? results.body.response.data[0].ein : null,

                        "tcAcceptDate": results.body.response.data[0].tcAcceptDate ? results.body.response.data[0].tcAcceptDate : null,
                        "tcVersion": results.body.response.data[0].tcVersion ? results.body.response.data[0].tcVersion : null,
                        "tcAcceptIp": results.body.response.data[0].tcAcceptIp ? results.body.response.data[0].tcAcceptIp : null,

                        "custom": results.body.response.data[0].custom ? results.body.response.data[0].custom : null,
                        "inactive": results.body.response.data[0].inactive,
                        "frozen": results.body.response.data[0].frozen,
                        "tinStatus": results.body.response.data[0].tinStatus ? results.body.response.data[0].tinStatus : null,
                        "reserved": results.body.response.data[0].reserved ? results.body.response.data[0].reserved : null,
                        "checkStage": results.body.response.data[0].checkStage ? results.body.response.data[0].checkStage : null,
                        "public": results.body.response.data[0].public ? results.body.response.data[0].public : null,

                        "customerPhone": results.body.response.data[0].customerPhone ? results.body.response.data[0].customerPhone : null
                    };
                    var params = [entityData.id, entityData.created, entityData.modified,
                    entityData.creator, entityData.modifier, entityData.ipCreated,
                    entityData.ipModified, entityData.login, entityData.type,
                    entityData.name, entityData.address1, entityData.city,
                    entityData.state, entityData.zip, entityData.country,
                    entityData.timezone, entityData.phone, entityData.email,
                    entityData.website, entityData.ein, entityData.custom,
                    entityData.inactive, entityData.frozen, entityData.tinStatus,
                    entityData.reserved, entityData.checkStage, entityData.public,
                    entityData.address2, entityData.fax, entityData.tcAcceptDate, entityData.tcVersion,
                    entityData.tcAcceptIp, entityData.customerPhone, entityData.id];

                    var query = "update entities set `id` = ?,`created_v` = ?,`modified_v` = ?," +
                        "`creator_v` = ?,`modifier_v` = ?,`ipCreated_v` = ?,`ipModified_v` = ?,`login_v` = ?," +
                        "`type_v` = ?,`name_v` = ?,`address1_v` = ?,`city_v` = ?,`state_v` = ?,`zip_v` = ?,`country_v` = ?," +
                        "`timezone_v` = ?,`phone_v` = ?,`email_v` = ?,`website_v` = ?,`ein_v` = ?,`custom_v` = ?," +
                        "`inactive_v` = ?,`frozen_v` = ?,`tinStatus_v` = ?,`reserved_v` = ?,`checkStage_v` = ?," +
                        "`public_v` = ?,`address2_v` = ?,`fax_v` = ?,`tcAcceptDate_v` = ?,`tcVersion_v` = ?,`tcAcceptIp_v` = ?,`customerPhone_v` = ?" +
                        " where id = ?";

                    db.query(query, params, function (errorEntityCreation, resultsEntityCreation) {
                        if (!errorEntityCreation) {
                            if (resultsEntityCreation.affectedRows == 1) {
                                logger.info("Entity updated successfully");
                                res.send(responseGenerator.getResponse(200, "Entity updated successfully", entityData));
                            }
                            else {
                                logger.info("Something went wrong - " + req.body.userId);
                                res.send(responseGenerator.getResponse(1083, "Something went wrong", null));
                            }
                        }
                        else {
                            logger.error("Error while processing your request", errorAccountCreation);
                            res.send(responseGenerator.getResponse(1005, msg.dbError, null))
                        }
                    });

                }
                else {
                    logger.info("Invalid entity id - " + req.body.userId);
                    res.send(responseGenerator.getResponse(1085, "Invalid entity id", null));
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
