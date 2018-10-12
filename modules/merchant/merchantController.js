var path = require('path');
var splash = require(path.resolve('.', 'modules/splash/splashController.js'));
var responseGenerator = require(path.resolve('.', 'utils/responseGenerator.js'));
var config = require(path.resolve('./', 'config'));
var logger = require(path.resolve('./logger'));
var msg = require(path.resolve('./', 'utils/errorMessages.js'));
var db = require(path.resolve('.', 'modules/database/databaseConnector.js'));
var each = require("sync-each");
var slashes = require('slashes');

//not used
exports.getMerchants = function (req, res) {
    var params = [1];

    var query = "Select m.id, e.name_v, b.first_v, b.last_v, m.inactive_v, case when m.inactive_v = '1' then 'Deactive' else 'Active' end status, e.frozen_v, m.created_v," +
        " e.city_v, e.state_v, e.email_v, e.phone_v from entities e join merchants m on e.id = m.entityId_v" +
        " join members b on b.merchant_v = m.id where b.primary_v = ? order by m.modified_v desc";

    db.query(query, params, function (errorGetMerchants, resultsGetMerchants) {
        if (!errorGetMerchants) {
            logger.info("Merchants list pulled successfully");
            var merchantList = [];
            for (var i = 0; i < resultsGetMerchants.length; i++) {
                var obj = resultsGetMerchants[i];
                obj.serial_number = i + 1;
                merchantList.push(obj);
            }
            res.send(responseGenerator.getResponse(200, "Success", merchantList));
        } else {
            logger.error("Error while processing your request", errorGetMerchants);
            res.send(responseGenerator.getResponse(1005, msg.dbError, errorGetMerchants));
        }
    })
}



exports.getMerchantsWithFilter = function (req, res) {

    filterStrings = {
        name: req.body.requestData.nameFilter ? "%" + req.body.requestData.nameFilter + "%" : "%%",
        inactive: req.body.requestData.inactiveFilter ? "%" + req.body.requestData.inactiveFilter + "%" : "%%",
        state: req.body.requestData.stateFilter ? "%" + req.body.requestData.stateFilter + "%" : "%%"
    }
    var params = [1, filterStrings.name, filterStrings.inactive, filterStrings.state];
    var merchantsList = req.body.requestData.merchantsList;
    var str = ""
    for (var i = 0; i < merchantsList.length; ++i) {
        if (i == 0) {
            str = "?"
        }
        else
            str = str + ",?";

        params.push(merchantsList[i].merchantId);
    }
    var query = "Select m.id, e.name_v, b.first_v, b.last_v, m.inactive_v, case when m.inactive_v = '1' then 'Deactive' else 'Active' end status, e.frozen_v, m.created_v," +
        " e.city_v, e.state_v, e.email_v, e.phone_v from entities e join merchants m on e.id = m.entityId_v" +
        " join members b on b.merchant_v = m.id where b.primary_v = ? and concat(b.first_v, ' ', b.last_v) like ? and m.inactive_v like ? and e.state_v like ? and m.id in(" + str + ") order by m.modified_v desc";


    db.query(query, params, function (errorGetMerchants, resultsGetMerchants) {
        if (!errorGetMerchants) {
            logger.info("Merchants list pulled successfully");
            var merchantList = [];
            for (var i = 0; i < resultsGetMerchants.length; i++) {
                var obj = resultsGetMerchants[i];
                obj.serial_number = i + 1;
                merchantList.push(obj);
            }
            res.send(responseGenerator.getResponse(200, "Success", merchantList));
        } else {
            logger.error("Error while processing your request", errorGetMerchants);
            res.send(responseGenerator.getResponse(1005, "Error while fetching merchants", errorGetMerchants));
        }
    })
}


exports.getMerchantDetails = function (req, res) {
    var obj = {};
    var params = [req.body.requestData.merchantId];

    var query = "Select * from entities e inner join merchants m on e.id = m.entityId_v where m.id = ?";

    db.query(query, params, function (errorGetMerchants, resultsGetMerchants) {
        if (!errorGetMerchants) {
            if (resultsGetMerchants.length > 0) {
                obj = resultsGetMerchants[0];

                var query = "Select * from members where merchant_v = ?";

                db.query(query, params, function (errorGetMembers, resultsGetMembers) {
                    if (!errorGetMembers) {
                        obj.members = resultsGetMembers;
                        params = [obj.entityId_v];
                        var query = "Select * from accounts where entity_v = ?";

                        db.query(query, params, function (errorGetAccounts, resultsGetAccounts) {
                            if (!errorGetAccounts) {
                                accounts = resultsGetAccounts[0];
                                accounts.account_v = JSON.parse(slashes.strip(accounts.account_v));
                                obj.accounts = accounts;

                                logger.info("Merchants list pulled successfully");
                                res.send(responseGenerator.getResponse(200, "Success", obj));
                            } else {
                                logger.error("Error while processing your request", errorGetAccounts);
                                res.send(responseGenerator.getResponse(200, "Error while fetching merchants", errorGetAccounts));
                            }
                        })
                    } else {
                        logger.error("Error while processing your request", errorGetMembers);
                        res.send(responseGenerator.getResponse(200, "Error while fetching merchants", errorGetMembers));
                    }
                })
            }
            else {
                logger.info("No data found");
                res.send(responseGenerator.getResponse(1086, "No data found", null));
            }

        } else {
            logger.error("Error while processing your request", errorGetMerchants);
            res.send(responseGenerator.getResponse(200, "Error while fetching merchants", errorGetMerchants));
        }
    })
}


exports.createMerchant = function (req, res) {
    Reqbody = {
        new: req.body.requestData.new,
        established: req.body.requestData.established,
        annualCCSales: req.body.requestData.annualCCSales,
        mcc: req.body.requestData.mcc,
        status: req.body.requestData.status,
        dba: req.body.requestData.dba,
        environment: req.body.requestData.environment,
        'entity[login]': config.entityLogin,
        'entity[type]': req.body.requestData.entityType,
        'entity[name]': req.body.requestData.entityName,
        'entity[environment]': req.body.requestData.entityEnvironment,
        'entity[address1]': req.body.requestData.entityAddress1,
        'entity[address2]': req.body.requestData.entityAddress2,
        'entity[city]': req.body.requestData.entityCity,
        'entity[state]': req.body.requestData.entityState,
        'entity[zip]': req.body.requestData.entityZip,
        'entity[country]': req.body.requestData.entityCountry,
        'entity[phone]': req.body.requestData.entityPhone,
        'entity[customerPhone]': req.body.requestData.entityCustomerPhone,
        'entity[fax]': req.body.requestData.entityFax,
        'entity[email]': req.body.requestData.entityEmail,
        'entity[ein]': req.body.requestData.entityEin,
        'entity[public]': req.body.requestData.entityPublic,
        'entity[website]': req.body.requestData.entityWebsite,
        'entity[tcAcceptDate]': req.body.requestData.entityTcAcceptDate,
        'entity[tcAcceptIp]': req.body.requestData.entityTcAcceptIp
    }
    for (var i = 0; i < req.body.requestData.entityaccounts.length; i++) {
        Reqbody["entity[accounts][" + i + "][primary]"] = req.body.requestData.entityaccounts[i].primary;
        Reqbody["entity[accounts][" + i + "][account][method]"] = req.body.requestData.entityaccounts[i].accountMethod;
        Reqbody["entity[accounts][" + i + "][account][number]"] = req.body.requestData.entityaccounts[i].accountNumber;
        Reqbody["entity[accounts][" + i + "][account][routing]"] = req.body.requestData.entityaccounts[i].accountRouting;
    }
    for (var j = 0; j < req.body.requestData.members.length; j++) {
        Reqbody["members[" + j + "][title]"] = req.body.requestData.members[j].title;
        Reqbody["members[" + j + "][first]"] = req.body.requestData.members[j].first;
        Reqbody["members[" + j + "][last]"] = req.body.requestData.members[j].last;
        Reqbody["members[" + j + "][dob]"] = req.body.requestData.members[j].dob;
        Reqbody["members[" + j + "][ownership]"] = req.body.requestData.members[j].ownership;
        Reqbody["members[" + j + "][email]"] = req.body.requestData.members[j].email;
        Reqbody["members[" + j + "][ssn]"] = req.body.requestData.members[j].ssn;
        Reqbody["members[" + j + "][address1]"] = req.body.requestData.members[j].address1;
        Reqbody["members[" + j + "][address2]"] = req.body.requestData.members[j].address2;
        Reqbody["members[" + j + "][city]"] = req.body.requestData.members[j].city;
        Reqbody["members[" + j + "][state]"] = req.body.requestData.members[j].state;
        Reqbody["members[" + j + "][zip]"] = req.body.requestData.members[j].zip;
        Reqbody["members[" + j + "][country]"] = req.body.requestData.members[j].country;
        Reqbody["members[" + j + "][phone]"] = req.body.requestData.members[j].phone;
        Reqbody["members[" + j + "][timezone]"] = req.body.requestData.members[j].timezone;
        Reqbody["members[" + j + "][dl]"] = req.body.requestData.members[j].dl;
        Reqbody["members[" + j + "][dlstate]"] = req.body.requestData.members[j].dlstate;
        Reqbody["members[" + j + "][primary]"] = req.body.requestData.members[j].primary;
    }
    splash.createMerchant(Reqbody, function (error, results) {
        if (error) {
            logger.info("Error while creating merchants - " + req.body.userId);
            res.send(responseGenerator.getResponse(1081, msg.splashError, error));
        }
        else if (results) {
            console.log(JSON.stringify(results.body.response.data));
            if (results.body.response.errors.length > 0) {
                logger.info("Error while creating merchant - " + req.body.userId);
                res.send(responseGenerator.getResponse(1082, "Error while creating merchant", results.body.response.errors));
            }
            else if (results.body.response.data.length > 0) {
                var merchantInfo = {};
                each(results.body.response.data[0].entity.accounts,
                    function (account, nextAccount) {
                        //perform async operation with account
                        if (account.primary == 1) {
                            merchantInfo.accountId = account.id;
                        }
                        var accountNum, routingNum;
                        for (var k = 0; k < req.body.requestData.entityaccounts.length; k++) {
                            var str = req.body.requestData.entityaccounts[k].accountNumber;
                            var index = str.indexOf(account.account.number);
                            if (index >= 0) {
                                accountNum = req.body.requestData.entityaccounts[k].accountNumber;
                                routingNum = req.body.requestData.entityaccounts[k].accountRouting;
                            }
                        }
                        var accountObjAfterSubstitution = account.account;
                        accountObjAfterSubstitution.number = accountNum;
                        accountObjAfterSubstitution.routing = routingNum;

                        var accountData = {
                            "id": account.id,
                            "account": account.account ? JSON.stringify(accountObjAfterSubstitution) : null,
                            "created": account.created ? account.created : null,
                            "modified": account.modified ? account.modified : null,
                            "creator": account.creator ? account.creator : null,
                            "modifier": account.modifier ? account.modifier : null,
                            "entity": account.entity ? account.entity : null,
                            "token": account.token ? account.token : null,
                            "name": account.name ? account.name : null,
                            "description": account.description ? account.description : null,
                            "primary": account.primary ? account.primary : null,
                            "status": account.status,
                            "currency": account.currency ? account.currency : null,
                            "inactive": account.inactive,
                            "frozen": account.frozen
                        }
                        var params = [accountData.id, accountData.account, accountData.created,
                        accountData.modified, accountData.creator, accountData.modifier,
                        accountData.entity, accountData.token, accountData.name,
                        accountData.description, accountData.primary, accountData.status,
                        accountData.currency, accountData.inactive, accountData.frozen];

                        var query = "INSERT INTO accounts (`id`,`account_v`,`created_v`,`modified_v`," +
                            "`creator_v`,`modifier_v`,`entity_v`,`token_v`,`name_v`,`description_v`," +
                            "`primary_v`,`status_v`,`currency_v`,`inactive_v`,`frozen_v`)" +
                            "VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

                        db.query(query, params, function (errorAccountCreation, resultsAccountCreation) {
                            if (!errorAccountCreation) {
                                logger.info("account inserted successfully - " + account.id);
                                nextAccount()
                            } else {
                                logger.error("Error while processing your request", errorAccountCreation);
                                res.send(responseGenerator.getResponse(1005, msg.dbError, errorAccountCreation))
                            }
                        })
                    },
                    function () {
                        //Success callback
                        merchantInfo.entityId = results.body.response.data[0].entity.id;
                        merchantInfo.entityName = results.body.response.data[0].entity.name;
                        merchantInfo.email = results.body.response.data[0].entity.email;
                        var entityData = {
                            "id": results.body.response.data[0].entity.id,
                            "created": results.body.response.data[0].entity.created ? results.body.response.data[0].entity.created : null,
                            "modified": results.body.response.data[0].entity.modified ? results.body.response.data[0].entity.modified : null,
                            "creator": results.body.response.data[0].entity.creator ? results.body.response.data[0].entity.creator : null,
                            "modifier": results.body.response.data[0].entity.modifier ? results.body.response.data[0].entity.modifier : null,
                            "ipCreated": results.body.response.data[0].entity.ipCreated ? results.body.response.data[0].entity.ipCreated : null,
                            "ipModified": results.body.response.data[0].entity.ipModified ? results.body.response.data[0].entity.ipModified : null,
                            "login": results.body.response.data[0].entity.login ? results.body.response.data[0].entity.login : null,
                            "type": results.body.response.data[0].entity.type ? results.body.response.data[0].entity.type : null,
                            "name": results.body.response.data[0].entity.name ? results.body.response.data[0].entity.name : null,
                            "address1": results.body.response.data[0].entity.address1 ? results.body.response.data[0].entity.address1 : null,

                            "address2": results.body.response.data[0].entity.address2 ? results.body.response.data[0].entity.address2 : null,

                            "city": results.body.response.data[0].entity.city ? results.body.response.data[0].entity.city : null,
                            "state": results.body.response.data[0].entity.state ? results.body.response.data[0].entity.state : null,
                            "zip": results.body.response.data[0].entity.zip ? results.body.response.data[0].entity.zip : null,
                            "country": results.body.response.data[0].entity.country ? results.body.response.data[0].entity.country : null,
                            "timezone": results.body.response.data[0].entity.timezone ? results.body.response.data[0].entity.timezone : null,
                            "phone": results.body.response.data[0].entity.phone ? results.body.response.data[0].entity.phone : null,

                            "fax": results.body.response.data[0].entity.fax ? results.body.response.data[0].entity.fax : null,

                            "email": results.body.response.data[0].entity.email ? results.body.response.data[0].entity.email : null,
                            "website": results.body.response.data[0].entity.website ? results.body.response.data[0].entity.website : null,
                            "ein": results.body.response.data[0].entity.ein ? req.body.requestData.entityEin : null,

                            "tcAcceptDate": results.body.response.data[0].entity.tcAcceptDate ? results.body.response.data[0].entity.tcAcceptDate : null,
                            "tcVersion": results.body.response.data[0].entity.tcVersion ? results.body.response.data[0].entity.tcVersion : null,
                            "tcAcceptIp": results.body.response.data[0].entity.tcAcceptIp ? results.body.response.data[0].entity.tcAcceptIp : null,

                            "custom": results.body.response.data[0].entity.custom ? results.body.response.data[0].entity.custom : null,
                            "inactive": results.body.response.data[0].entity.inactive,
                            "frozen": results.body.response.data[0].entity.frozen,
                            "tinStatus": results.body.response.data[0].entity.tinStatus ? results.body.response.data[0].entity.tinStatus : null,
                            "reserved": results.body.response.data[0].entity.reserved ? results.body.response.data[0].entity.reserved : null,
                            "checkStage": results.body.response.data[0].entity.checkStage ? results.body.response.data[0].entity.checkStage : null,
                            "public": results.body.response.data[0].entity.public ? results.body.response.data[0].entity.public : null,

                            "customerPhone": results.body.response.data[0].entity.customerPhone ? results.body.response.data[0].entity.customerPhone : null,
                            "clientIp": results.body.response.data[0].entity.clientIp ? results.body.response.data[0].entity.clientIp : null,
                            "tcDate": results.body.response.data[0].entity.tcDate ? results.body.response.data[0].entity.tcDate : null,
                            "tcIp": results.body.response.data[0].entity.tcIp ? results.body.response.data[0].entity.tcIp : null

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
                        entityData.tcAcceptIp, entityData.customerPhone, entityData.clientIp, entityData.tcDate, entityData.tcIp];

                        var query = "INSERT INTO entities (`id`,`created_v`,`modified_v`," +
                            "`creator_v`,`modifier_v`,`ipCreated_v`,`ipModified_v`,`login_v`," +
                            "`type_v`,`name_v`,`address1_v`,`city_v`,`state_v`,`zip_v`,`country_v`," +
                            "`timezone_v`,`phone_v`,`email_v`,`website_v`,`ein_v`,`custom_v`," +
                            "`inactive_v`,`frozen_v`,`tinStatus_v`,`reserved_v`,`checkStage_v`," +
                            "`public_v`,`address2_v`,`fax_v`,`tcAcceptDate_v`,`tcVersion_v`,`tcAcceptIp_v`,`customerPhone_v`,`clientIp_v`,`tcDate_v`,`tcIp_v`)" +
                            " VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

                        db.query(query, params, function (errorEntityCreation, resultsEntityCreation) {
                            if (!errorEntityCreation) {
                                if (resultsEntityCreation.affectedRows == 1) {
                                    merchantInfo.merchantId = results.body.response.data[0].id;
                                    merchantInfo.created = results.body.response.data[0].created;
                                    merchantInfo.modified = results.body.response.data[0].modified;
                                    merchantInfo.creator = results.body.response.data[0].creator;
                                    merchantInfo.modifier = results.body.response.data[0].modifier;

                                    var merchantData = {
                                        "id": results.body.response.data[0].id,
                                        "created": results.body.response.data[0].created ? results.body.response.data[0].created : null,
                                        "modified": results.body.response.data[0].modified ? results.body.response.data[0].modified : null,
                                        "creator": results.body.response.data[0].creator ? results.body.response.data[0].creator : null,
                                        "modifier": results.body.response.data[0].modifier ? results.body.response.data[0].modifier : null,
                                        "new": results.body.response.data[0].new ? results.body.response.data[0].new : null,
                                        "established": results.body.response.data[0].established ? results.body.response.data[0].established : null,
                                        "annualCCSales": results.body.response.data[0].annualCCSales ? results.body.response.data[0].annualCCSales : null,
                                        "avgTicket": results.body.response.data[0].avgTicket ? results.body.response.data[0].avgTicket : null,
                                        "mcc": results.body.response.data[0].mcc ? results.body.response.data[0].mcc : null,
                                        "status": results.body.response.data[0].status != null ? results.body.response.data[0].status : null,
                                        "tcVersion": results.body.response.data[0].tcVersion ? results.body.response.data[0].tcVersion : null,
                                        "inactive": results.body.response.data[0].inactive,
                                        "frozen": results.body.response.data[0].frozen,
                                        "environment": results.body.response.data[0].environment ? results.body.response.data[0].environment : null,
                                        "entityId": results.body.response.data[0].entity.id ? results.body.response.data[0].entity.id : null,

                                        "dba": results.body.response.data[0].dba ? results.body.response.data[0].dba : null
                                    };
                                    var params = [merchantData.id, merchantData.created, merchantData.modified,
                                    merchantData.creator, merchantData.modifier, merchantData.new,
                                    merchantData.established, merchantData.annualCCSales, merchantData.avgTicket,
                                    merchantData.mcc, merchantData.status, merchantData.tcVersion,
                                    merchantData.inactive, merchantData.frozen, merchantData.environment,
                                    merchantData.entityId, merchantData.dba]
                                    db.query('call CreateMerchant(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', params, function (errorMerchantCreation, resultsMerchantCreation) {
                                        if (!errorMerchantCreation) {
                                            if (resultsMerchantCreation.affectedRows == 1) {
                                                each(results.body.response.data[0].members,
                                                    function (member, nextMember) {
                                                        if (member.primary == 1) {
                                                            merchantInfo.memberId = member.id;
                                                            merchantInfo.fullName = member.first + " " + member.last;
                                                            merchantInfo.phone = member.phone;
                                                            merchantInfo.zip = member.zip;
                                                            merchantInfo.city = member.city;
                                                        }
                                                        var dob, dl, ssn;
                                                        for (var k = 0; k < req.body.requestData.members.length; k++) {
                                                            var str = req.body.requestData.members[k].ssn;
                                                            var index = str.indexOf(member.ssn);
                                                            if (index >= 0) {
                                                                dob = req.body.requestData.members[k].dob;
                                                                dl = req.body.requestData.members[k].dl;
                                                                ssn = req.body.requestData.members[k].ssn;
                                                            }
                                                        }
                                                        var memberData = {
                                                            "id": member.id,
                                                            "created": member.created ? member.created : null,
                                                            "modified": member.modified ? member.modified : null,
                                                            "creator": member.creator ? member.creator : null,
                                                            "modifier": member.modifier ? member.modifier : null,
                                                            "merchant": member.merchant ? member.merchant : null,
                                                            "title": member.title ? member.title : null,
                                                            "first": member.first ? member.first : null,
                                                            "last": member.last ? member.last : null,
                                                            "ssn": member.ssn ? ssn : null,
                                                            "dob": member.dob ? dob : null,
                                                            "dl": member.dl ? dl : null,
                                                            "dlstate": member.dlstate ? member.dlstate : null,
                                                            "ownership": member.ownership ? member.ownership : null,
                                                            "email": member.email ? member.email : null,

                                                            "phone": member.phone ? member.phone : null,

                                                            "country": member.country ? member.country : null,
                                                            "zip": member.zip ? member.zip : null,
                                                            "state": member.state ? member.state : null,
                                                            "city": member.city ? member.city : null,
                                                            "address2": member.address2 ? member.address2 : null,
                                                            "address1": member.address1 ? member.address1 : null,
                                                            "primary": member.primary ? member.primary : null,
                                                            "inactive": member.inactive,
                                                            "frozen": member.frozen,
                                                            "timezone": member.timezone ? member.timezone : null,
                                                            "middle": member.middle ? member.middle : null,
                                                            "fax": member.fax ? member.fax : null
                                                        };

                                                        var params = [memberData.id, memberData.created, memberData.modified,
                                                        memberData.creator, memberData.modifier, memberData.merchant,
                                                        memberData.title, memberData.first, memberData.last,
                                                        memberData.ssn, memberData.dob, memberData.dl,
                                                        memberData.dlstate, memberData.ownership, memberData.email,
                                                        memberData.country, memberData.zip, memberData.state,
                                                        memberData.city, memberData.address2, memberData.address1,
                                                        memberData.primary, memberData.inactive, memberData.frozen,
                                                        memberData.timezone, memberData.phone, memberData.middle, memberData.fax];

                                                        var query = "INSERT INTO members (`id`,`created_v`,`modified_v`," +
                                                            "`creator_v`,`modifier_v`,`merchant_v`,`title_v`,`first_v`,`last_v`," +
                                                            "`ssn_v`,`dob_v`,`dl_v`,`dlstate_v`,`ownership_v`,`email_v`,`country_v`," +
                                                            "`zip_v`,`state_v`,`city_v`,`address2_v`,`address1_v`,`primary_v`," +
                                                            "`inactive_v`,`frozen_v`,`timezone_v`,`phone_v`,`middle_v`,`fax_v`)" +
                                                            "VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

                                                        db.query(query, params, function (errorMemberCreation, resultsMemberCreation) {
                                                            if (!errorMemberCreation) {
                                                                if (resultsMemberCreation.affectedRows == 1) {
                                                                    logger.info("Member added successfully - " + req.body.userId);
                                                                    nextMember();
                                                                }
                                                                else {
                                                                    logger.info("Something went wrong - " + req.body.userId);
                                                                    res.send(responseGenerator.getResponse(1083, "Something went wrong", null));
                                                                }
                                                            }
                                                        });
                                                    }, function () {
                                                        res.send(responseGenerator.getResponse(200, "Merchant created successfully", merchantInfo));
                                                    });
                                            }
                                            else {
                                                logger.info("Something went wrong - " + req.body.userId);
                                                res.send(responseGenerator.getResponse(1083, "Something went wrong", null));
                                            }
                                        }
                                    });
                                }
                                else {
                                    logger.info("Something went wrong - " + req.body.userId);
                                    res.send(responseGenerator.getResponse(1083, "Something went wrong", null));
                                }
                            }
                        });
                    }
                )

            }
            else {
                logger.info("Something went wrong - " + req.body.userId);
                res.send(responseGenerator.getResponse(1083, "Something went wrong", null));
            }

        }
    });
}




exports.deleteMerchant = function (req, res) {
    Reqbody = {
        inactive: req.body.requestData.inactive,
        merchantId: req.body.requestData.merchantId
    }
    splash.deleteMerchant(Reqbody, function (error, results) {
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

                    var merchantData = {
                        "id": results.body.response.data[0].id,
                        "created": results.body.response.data[0].created ? results.body.response.data[0].created : null,
                        "modified": results.body.response.data[0].modified ? results.body.response.data[0].modified : null,
                        "creator": results.body.response.data[0].creator ? results.body.response.data[0].creator : null,
                        "modifier": results.body.response.data[0].modifier ? results.body.response.data[0].modifier : null,
                        "new": results.body.response.data[0].new ? results.body.response.data[0].new : null,
                        "established": results.body.response.data[0].established ? results.body.response.data[0].established : null,
                        "annualCCSales": results.body.response.data[0].annualCCSales ? results.body.response.data[0].annualCCSales : null,
                        "avgTicket": results.body.response.data[0].avgTicket ? results.body.response.data[0].avgTicket : null,
                        "mcc": results.body.response.data[0].mcc ? results.body.response.data[0].mcc : null,
                        "status": results.body.response.data[0].status ? results.body.response.data[0].status : null,
                        "tcVersion": results.body.response.data[0].tcVersion ? results.body.response.data[0].tcVersion : null,
                        "inactive": results.body.response.data[0].inactive,
                        "frozen": results.body.response.data[0].frozen,
                        "environment": results.body.response.data[0].environment ? results.body.response.data[0].environment : null,
                        "entityId": results.body.response.data[0].entity.id ? results.body.response.data[0].entity.id : null,
                        "dba": results.body.response.data[0].dba ? results.body.response.data[0].dba : null
                    };
                    var params = [merchantData.inactive, merchantData.id];
                    var query = "update merchants set inactive_v = ? where id = ?";
                    db.query(query, params, function (errorMerchantDelete, resultsMerchantDelete) {
                        if (!errorMerchantDelete) {
                            if (resultsMerchantDelete.affectedRows == 1) {
                                logger.info("Merchant deleted successfully");
                                if (req.body.requestData.inactive == "1")
                                    res.send(responseGenerator.getResponse(200, "Merchant deactivated successfully", null));
                                else
                                    res.send(responseGenerator.getResponse(200, "Merchant activated successfully", null));
                            }
                            else {
                                logger.info("Something went wrong - " + req.body.userId);
                                res.send(responseGenerator.getResponse(1083, "Something went wrong", null));
                            }
                        }
                    });

                }
                else {
                    logger.info("Invalid merchant id - " + req.body.userId);
                    res.send(responseGenerator.getResponse(1085, "Invalid merchant id", null));
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




exports.updateMerchant = function (req, res) {

    Reqbody = {};
    req.body.requestData.entity ? (Reqbody.entity = req.body.requestData.entity) : 0;
    req.body.requestData.dba || (req.body.requestData.dba == "") ? (req.body.requestData.dba == "" ? Reqbody.dba = null : Reqbody.dba = req.body.requestData.dba) : 0;
    req.body.requestData.new ? (Reqbody.new = req.body.requestData.new) : 0;
    req.body.requestData.established || (req.body.requestData.established == "") ? (req.body.requestData.established == "" ? Reqbody.established = null : Reqbody.established = req.body.requestData.established) : 0;
    req.body.requestData.annualCCSales ? (Reqbody.annualCCSales = req.body.requestData.annualCCSales) : 0;
    req.body.requestData.avgTicket ? (Reqbody.avgTicket = req.body.requestData.avgTicket) : 0;
    req.body.requestData.amex ? (Reqbody.amex = req.body.requestData.amex) : 0;
    req.body.requestData.discover ? (Reqbody.discover = req.body.requestData.discover) : 0;
    req.body.requestData.mcc ? (Reqbody.mcc = req.body.requestData.mcc) : 0;
    req.body.requestData.environment ? (Reqbody.environment = req.body.requestData.environment) : 0;
    req.body.requestData.merchantId ? (Reqbody.merchantId = req.body.requestData.merchantId) : 0;
    req.body.requestData.inactive ? (Reqbody.inactive = req.body.requestData.inactive) : 0;
    req.body.requestData.status ? (Reqbody.status = req.body.requestData.status) : 0;

    splash.updateMerchant(Reqbody, function (error, results) {
        if (error) {
            logger.info("Error while updating merchants - " + req.body.userId);
            res.send(responseGenerator.getResponse(1081, msg.splashError, error));
        }
        else if (results) {
            if (results.body) {

                if (results.body.response.errors.length > 0) {
                    logger.info("Error while updating merchant - " + req.body.userId);
                    res.send(responseGenerator.getResponse(1084, "Error while updating merchant", results.body.response.errors));
                }
                else if (results.body.response.data.length > 0) {

                    var merchantData = {
                        "id": results.body.response.data[0].id,
                        "created": results.body.response.data[0].created ? results.body.response.data[0].created : null,
                        "modified": results.body.response.data[0].modified ? results.body.response.data[0].modified : null,
                        "creator": results.body.response.data[0].creator ? results.body.response.data[0].creator : null,
                        "modifier": results.body.response.data[0].modifier ? results.body.response.data[0].modifier : null,
                        "new": results.body.response.data[0].new ? results.body.response.data[0].new : null,
                        "established": results.body.response.data[0].established ? results.body.response.data[0].established : null,
                        "annualCCSales": results.body.response.data[0].annualCCSales ? results.body.response.data[0].annualCCSales : null,
                        "avgTicket": results.body.response.data[0].avgTicket ? results.body.response.data[0].avgTicket : null,
                        "mcc": results.body.response.data[0].mcc ? results.body.response.data[0].mcc : null,
                        "status": results.body.response.data[0].status != null ? results.body.response.data[0].status : null,
                        "tcVersion": results.body.response.data[0].tcVersion ? results.body.response.data[0].tcVersion : null,
                        "inactive": results.body.response.data[0].inactive,
                        "frozen": results.body.response.data[0].frozen,
                        "environment": results.body.response.data[0].environment ? results.body.response.data[0].environment : null,
                        "entityId": results.body.response.data[0].entity ? results.body.response.data[0].entity : null,
                        "dba": results.body.response.data[0].dba ? results.body.response.data[0].dba : null
                    };
                    var params = [merchantData.created, merchantData.modified, merchantData.creator, merchantData.modifier, merchantData.new,
                    merchantData.established, merchantData.annualCCSales, merchantData.avgTicket, merchantData.mcc, merchantData.status,
                    merchantData.tcVersion, merchantData.inactive, merchantData.frozen, merchantData.environment, merchantData.entityId,
                    merchantData.dba, merchantData.id];
                    var query = "update merchants set created_v = ?, modified_v = ?, creator_v = ?, modifier_v = ?, new_v = ?," +
                        "established_v = ?, annualCCSales_v = ?, avgTicket_v = ?, mcc_v = ?, status_v = ?, tcVersion_v = ?, inactive_v = ?," +
                        "frozen_v = ?, environment_v = ?, entityId_v = ?, dba_v = ? where id = ?";
                    db.query(query, params, function (errorMerchantDelete, resultsMerchantDelete) {
                        if (!errorMerchantDelete) {
                            if (resultsMerchantDelete.affectedRows == 1) {
                                logger.info("Merchant updated successfully");
                                res.send(responseGenerator.getResponse(200, "Merchant updated successfully", merchantData));
                            }
                            else {
                                logger.info("Something went wrong - " + req.body.userId);
                                res.send(responseGenerator.getResponse(1083, "Something went wrong", null));
                            }
                        }
                        else {
                            logger.error("Error while processing your request", errorAccountCreation);
                            res.send(responseGenerator.getResponse(1005, msg.dbError, errorAccountCreation))
                        }
                    });

                }
                else {
                    logger.info("Invalid merchant id - " + req.body.userId);
                    res.send(responseGenerator.getResponse(1085, "Invalid merchant id", null));
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
