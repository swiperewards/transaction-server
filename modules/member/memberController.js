var path = require('path');
var splash = require(path.resolve('.', 'modules/splash/splashController.js'));
var responseGenerator = require(path.resolve('.', 'utils/responseGenerator.js'));
var config = require(path.resolve('./', 'config'));
var logger = require(path.resolve('./logger'));
var msg = require(path.resolve('./', 'utils/errorMessages.js'));
var db = require(path.resolve('.', 'modules/database/databaseConnector.js'));



exports.createMember = function (req, res) {

    Reqbody = {};
    req.body.requestData.merchant ? (Reqbody.merchant = req.body.requestData.merchant) : 0;
    req.body.requestData.title ? (Reqbody.title = req.body.requestData.title) : 0;
    req.body.requestData.first ? (Reqbody.first = req.body.requestData.first) : 0;
    req.body.requestData.middle ? (Reqbody.middle = req.body.requestData.middle) : 0;
    req.body.requestData.last ? (Reqbody.last = req.body.requestData.last) : 0;
    req.body.requestData.dob ? (Reqbody.dob = req.body.requestData.dob) : 0;
    req.body.requestData.ownership ? (Reqbody.ownership = req.body.requestData.ownership) : 0;
    req.body.requestData.email ? (Reqbody.email = req.body.requestData.email) : 0;
    req.body.requestData.ssn ? (Reqbody.ssn = req.body.requestData.ssn) : 0;
    req.body.requestData.address1 ? (Reqbody.address1 = req.body.requestData.address1) : 0;
    req.body.requestData.address2 ? (Reqbody.address2 = req.body.requestData.address2) : 0;
    req.body.requestData.city ? (Reqbody.city = req.body.requestData.city) : 0;
    req.body.requestData.state ? (Reqbody.state = req.body.requestData.state) : 0;
    req.body.requestData.zip ? (Reqbody.zip = req.body.requestData.zip) : 0;
    req.body.requestData.country ? (Reqbody.country = req.body.requestData.country) : 0;
    req.body.requestData.timezone ? (Reqbody.timezone = req.body.requestData.timezone) : 0;
    req.body.requestData.dl ? (Reqbody.dl = req.body.requestData.dl) : 0;
    req.body.requestData.dlstate ? (Reqbody.dlstate = req.body.requestData.dlstate) : 0;
    req.body.requestData.primary ? (Reqbody.primary = req.body.requestData.primary) : 0;
    req.body.requestData.phone ? (Reqbody.phone = req.body.requestData.phone) : 0;
    req.body.requestData.fax ? (Reqbody.fax = req.body.requestData.fax) : 0;
    req.body.requestData.inactive ? (Reqbody.inactive = req.body.requestData.inactive) : 0;
    req.body.requestData.frozen ? (Reqbody.frozen = req.body.requestData.frozen) : 0;

    splash.createMember(Reqbody, function (error, results) {
        if (error) {
            logger.info("Error while creating merchants - " + req.body.userId);
            res.send(responseGenerator.getResponse(1081, msg.splashError, error));
        }
        else if (results) {
            if (results.body) {

                if (results.body.response.errors.length > 0) {
                    logger.info("Error while updating member - " + req.body.userId);
                    res.send(responseGenerator.getResponse(1087, "Error while creating member", results.body.response.errors));
                }
                else if (results.body.response.data.length > 0) {
                    //Success callback
                    var memberData = {
                        "id": results.body.response.data[0].id ? results.body.response.data[0].id : null,
                        "created": results.body.response.data[0].created ? results.body.response.data[0].created : null,
                        "modified": results.body.response.data[0].modified ? results.body.response.data[0].modified : null,
                        "creator": results.body.response.data[0].creator ? results.body.response.data[0].creator : null,
                        "modifier": results.body.response.data[0].modifier ? results.body.response.data[0].modifier : null,
                        "merchant": results.body.response.data[0].merchant ? results.body.response.data[0].merchant : null,
                        "title": results.body.response.data[0].title ? results.body.response.data[0].title : null,
                        "first": results.body.response.data[0].first ? results.body.response.data[0].first : null,
                        "middle": results.body.response.data[0].middle ? results.body.response.data[0].middle : null,
                        "last": results.body.response.data[0].last ? results.body.response.data[0].last : null,
                        "ssn": results.body.response.data[0].ssn ? results.body.response.data[0].ssn : null,
                        "dob": results.body.response.data[0].dob ? results.body.response.data[0].dob : null,
                        "dl": results.body.response.data[0].dl ? results.body.response.data[0].dl : null,
                        "dlstate": results.body.response.data[0].dlstate ? results.body.response.data[0].dlstate : null,
                        "ownership": results.body.response.data[0].ownership ? results.body.response.data[0].ownership : null,
                        "email": results.body.response.data[0].email ? results.body.response.data[0].email : null,
                        "fax": results.body.response.data[0].fax ? results.body.response.data[0].fax : null,
                        "phone": results.body.response.data[0].phone ? results.body.response.data[0].phone : null,
                        "country": results.body.response.data[0].country ? results.body.response.data[0].country : null,
                        "zip": results.body.response.data[0].zip ? results.body.response.data[0].zip : null,
                        "state": results.body.response.data[0].state ? results.body.response.data[0].state : null,
                        "city": results.body.response.data[0].city ? results.body.response.data[0].city : null,
                        "address2": results.body.response.data[0].address2 ? results.body.response.data[0].address2 : null,
                        "address1": results.body.response.data[0].address1 ? results.body.response.data[0].address1 : null,
                        "primary": results.body.response.data[0].primary ? results.body.response.data[0].primary : null,
                        "inactive": results.body.response.data[0].inactive ? results.body.response.data[0].inactive : null,
                        "frozen": results.body.response.data[0].frozen ? results.body.response.data[0].frozen : null,
                        "timezone": results.body.response.data[0].timezone ? results.body.response.data[0].timezone : null
                    };
                    var params = [memberData.id, memberData.created, memberData.modified,
                        memberData.creator, memberData.modifier, memberData.merchant,
                        memberData.title, memberData.first, memberData.last,
                        memberData.ssn, memberData.dob, memberData.dl,
                        memberData.dlstate, memberData.ownership, memberData.email,
                        memberData.country, memberData.zip, memberData.state,
                        memberData.city, memberData.address2, memberData.address1,
                        memberData.primary, memberData.inactive, memberData.frozen,
                        memberData.timezone, memberData.phone];

                    var query = "INSERT INTO members (`id`,`created_v`,`modified_v`," +
                    "`creator_v`,`modifier_v`,`merchant_v`,`title_v`,`first_v`,`last_v`," +
                    "`ssn_v`,`dob_v`,`dl_v`,`dlstate_v`,`ownership_v`,`email_v`,`country_v`," +
                    "`zip_v`,`state_v`,`city_v`,`address2_v`,`address1_v`,`primary_v`," +
                    "`inactive_v`,`frozen_v`,`timezone_v`,`phone_v`)" +
                    "VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

                    db.query(query, params, function (errorMemberCreate, resultsMemberCreate) {
                        if (!errorMemberCreate) {
                            if (resultsMemberCreate.affectedRows == 1) {
                                logger.info("Member updated successfully");
                                res.send(responseGenerator.getResponse(200, "Member created successfully", memberData));
                            }
                            else {
                                logger.info("Something went wrong - " + req.body.userId);
                                res.send(responseGenerator.getResponse(1083, "Something went wrong", null));
                            }
                        }
                        else {
                            logger.error("Error while processing your request", errorMemberCreate);
                            res.send(responseGenerator.getResponse(1005, msg.dbError, null))
                        }
                    });

                }
                else {
                    logger.info("Invalid member id - " + req.body.userId);
                    res.send(responseGenerator.getResponse(1085, "Invalid member id", null));
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



exports.updateMember = function (req, res) {

    Reqbody = {};
    req.body.requestData.merchant ? (Reqbody.merchant = req.body.requestData.merchant) : 0;
    req.body.requestData.title ? (Reqbody.title = req.body.requestData.title) : 0;
    req.body.requestData.first ? (Reqbody.first = req.body.requestData.first) : 0;
    req.body.requestData.middle ? (Reqbody.middle = req.body.requestData.middle) : 0;
    req.body.requestData.last ? (Reqbody.last = req.body.requestData.last) : 0;
    req.body.requestData.dob ? (Reqbody.dob = req.body.requestData.dob) : 0;
    req.body.requestData.ownership ? (Reqbody.ownership = req.body.requestData.ownership) : 0;
    req.body.requestData.email ? (Reqbody.email = req.body.requestData.email) : 0;
    req.body.requestData.ssn ? (Reqbody.ssn = req.body.requestData.ssn) : 0;
    req.body.requestData.address1 ? (Reqbody.address1 = req.body.requestData.address1) : 0;
    req.body.requestData.address2 ? (Reqbody.address2 = req.body.requestData.address2) : 0;
    req.body.requestData.city ? (Reqbody.city = req.body.requestData.city) : 0;
    req.body.requestData.state ? (Reqbody.state = req.body.requestData.state) : 0;
    req.body.requestData.zip ? (Reqbody.zip = req.body.requestData.zip) : 0;
    req.body.requestData.country ? (Reqbody.country = req.body.requestData.country) : 0;
    req.body.requestData.timezone ? (Reqbody.timezone = req.body.requestData.timezone) : 0;
    req.body.requestData.dl ? (Reqbody.dl = req.body.requestData.dl) : 0;
    req.body.requestData.dlstate ? (Reqbody.dlstate = req.body.requestData.dlstate) : 0;
    req.body.requestData.primary ? (Reqbody.primary = req.body.requestData.primary) : 0;
    req.body.requestData.phone ? (Reqbody.phone = req.body.requestData.phone) : 0;
    req.body.requestData.fax ? (Reqbody.fax = req.body.requestData.fax) : 0;
    req.body.requestData.inactive ? (Reqbody.inactive = req.body.requestData.inactive) : 0;
    req.body.requestData.frozen ? (Reqbody.frozen = req.body.requestData.frozen) : 0;
    req.body.requestData.memberId ? (Reqbody.memberId = req.body.requestData.memberId) : 0;

    splash.updateMember(Reqbody, function (error, results) {
        if (error) {
            logger.info("Error while creating merchants - " + req.body.userId);
            res.send(responseGenerator.getResponse(1081, msg.splashError, error));
        }
        else if (results) {
            if (results.body) {

                if (results.body.response.errors.length > 0) {
                    logger.info("Error while updating member - " + req.body.userId);
                    res.send(responseGenerator.getResponse(1084, "Error while updating member", results.body.response.errors));
                }
                else if (results.body.response.data.length > 0) {
                    //Success callback
                    var memberData = {
                        "id": results.body.response.data[0].id ? results.body.response.data[0].id : null,
                        "created": results.body.response.data[0].created ? results.body.response.data[0].created : null,
                        "modified": results.body.response.data[0].modified ? results.body.response.data[0].modified : null,
                        "creator": results.body.response.data[0].creator ? results.body.response.data[0].creator : null,
                        "modifier": results.body.response.data[0].modifier ? results.body.response.data[0].modifier : null,
                        "merchant": results.body.response.data[0].merchant ? results.body.response.data[0].merchant : null,
                        "title": results.body.response.data[0].title ? results.body.response.data[0].title : null,
                        "first": results.body.response.data[0].first ? results.body.response.data[0].first : null,
                        "middle": results.body.response.data[0].middle ? results.body.response.data[0].middle : null,
                        "last": results.body.response.data[0].last ? results.body.response.data[0].last : null,
                        "ssn": results.body.response.data[0].ssn ? results.body.response.data[0].ssn : null,
                        "dob": results.body.response.data[0].dob ? results.body.response.data[0].dob : null,
                        "dl": results.body.response.data[0].dl ? results.body.response.data[0].dl : null,
                        "dlstate": results.body.response.data[0].dlstate ? results.body.response.data[0].dlstate : null,
                        "ownership": results.body.response.data[0].ownership ? results.body.response.data[0].ownership : null,
                        "email": results.body.response.data[0].email ? results.body.response.data[0].email : null,
                        "fax": results.body.response.data[0].fax ? results.body.response.data[0].fax : null,
                        "phone": results.body.response.data[0].phone ? results.body.response.data[0].phone : null,
                        "country": results.body.response.data[0].country ? results.body.response.data[0].country : null,
                        "zip": results.body.response.data[0].zip ? results.body.response.data[0].zip : null,
                        "state": results.body.response.data[0].state ? results.body.response.data[0].state : null,
                        "city": results.body.response.data[0].city ? results.body.response.data[0].city : null,
                        "address2": results.body.response.data[0].address2 ? results.body.response.data[0].address2 : null,
                        "address1": results.body.response.data[0].address1 ? results.body.response.data[0].address1 : null,
                        "primary": results.body.response.data[0].primary ? results.body.response.data[0].primary : null,
                        "inactive": results.body.response.data[0].inactive ? results.body.response.data[0].inactive : null,
                        "frozen": results.body.response.data[0].frozen ? results.body.response.data[0].frozen : null,
                        "timezone": results.body.response.data[0].timezone ? results.body.response.data[0].timezone : null
                    };
                    var params = [memberData.modified,
                        memberData.modifier, memberData.merchant,
                        memberData.title, memberData.first, memberData.last,
                        memberData.ssn, memberData.dob, memberData.dl,
                        memberData.dlstate, memberData.ownership, memberData.email,
                        memberData.country, memberData.zip, memberData.state,
                        memberData.city, memberData.address2, memberData.address1,
                        memberData.primary, memberData.inactive, memberData.frozen,
                        memberData.timezone, memberData.phone, memberData.id];

                    var query = "update members set `modified_v` = ?," +
                    "`modifier_v` = ?,`merchant_v` = ?,`title_v` = ?,`first_v` = ?,`last_v` = ?," +
                    "`ssn_v` = ?,`dob_v` = ?,`dl_v` = ?,`dlstate_v` = ?,`ownership_v` = ?,`email_v` = ?,`country_v` = ?," +
                    "`zip_v` = ?,`state_v` = ?,`city_v` = ?,`address2_v` = ?,`address1_v` = ?,`primary_v` = ?," +
                    "`inactive_v` = ?,`frozen_v` = ?,`timezone_v` = ?,`phone_v` = ? where `id` = ?";

                    db.query(query, params, function (errorMemberUpdate, resultsMemberUpdate) {
                        if (!errorMemberUpdate) {
                            if (resultsMemberUpdate.affectedRows == 1) {
                                logger.info("Member updated successfully");
                                res.send(responseGenerator.getResponse(200, "Member updated successfully", memberData));
                            }
                            else {
                                logger.info("Something went wrong - " + req.body.userId);
                                res.send(responseGenerator.getResponse(1083, "Something went wrong", null));
                            }
                        }
                        else {
                            logger.error("Error while processing your request", errorMemberUpdate);
                            res.send(responseGenerator.getResponse(1005, msg.dbError, null))
                        }
                    });

                }
                else {
                    logger.info("Invalid member id - " + req.body.userId);
                    res.send(responseGenerator.getResponse(1085, "Invalid member id", null));
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
