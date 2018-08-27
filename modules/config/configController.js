var path = require('path');
var db = require(path.resolve('.', 'modules/database/databaseConnector.js'));
var config = require(path.resolve('./', 'config'))
var logger = require(path.resolve('./logger'))
var cron = require('node-cron');

cron.schedule('0 0 * * * *', function () {
    db.query("select 1", function (error, results) {
        logger.info("configController - keep alive (mysql)- " + new Date(Date.now()));
    });
});
