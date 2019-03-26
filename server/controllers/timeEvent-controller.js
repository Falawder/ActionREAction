var connectDb = require("./db-connect.js");
var CronJob = require('cron').CronJob;
var axios = require("axios");

exports.repetitivejob = function(res, reaction, results, arg) {
    var refDb = connectDb.getConnection();
    console.log('Before job instantiation');
    if (results[0] && results[0].repetitivejob_trigger) {
        res.send({
            "code": 200,
            "error": "AREA successfully deactivated"
        });
        refDb.query('UPDATE users SET repetitivejob_trigger = ? WHERE token = ?', [false,results[0].token], function(error, results, fields) {
            if (error) {
                console.log('\x1b[31m', "[MySQL] Error ocurred (SELECT):", error);
            } else {
                console.log('\x1b[32m', 'Updatedrepetitivejob trigger');
            }
        });
    } else {
        res.send({
            "code": 200,
            "error": "AREA successfully activated"
        });
        refDb.query('UPDATE users SET repetitivejob_trigger = ? WHERE token = ?', [true,results[0].token], function(error, results, fields) {
            if (error) {
                console.log('\x1b[31m', "[MySQL] Error ocurred (SELECT):", error);
            } else {
                console.log('\x1b[32m', 'Updated repetitivejob_trigger');
            }
        });
    }
    const job = new CronJob(arg ? arg.time  : "*/5 * * * *", function() {
        const d = new Date();
        console.log('Every Tenth Minute:', d);
        reaction(results, arg);
    });
    console.log('After job instantiation');
    job.start();
}

exports.oncejob = function(res, reaction, results, arg) {
    var refDb = connectDb.getConnection();
    console.log('Before job instantiation');
    if (results[0] && results[0].repetitivejob_trigger) {
        res.send({
            "code": 200,
            "error": "AREA successfully deactivated"
        });
        refDb.query('UPDATE users SET oncejob_trigger = ? WHERE token = ?', [false,results[0].token], function(error, results, fields) {
            if (error) {
                console.log('\x1b[31m', "[MySQL] Error ocurred (SELECT):", error);
            } else {
                console.log('\x1b[32m', 'Updated oncejob trigger');
            }
        });
    } else {
        res.send({
            "code": 200,
            "error": "AREA successfully activated"
        });
        refDb.query('UPDATE users SET oncejob_trigger = ? WHERE token = ?', [true,results[0].token], function(error, results, fields) {
            if (error) {
                console.log('\x1b[31m', "[MySQL] Error ocurred (SELECT):", error);
            } else {
                console.log('\x1b[32m', 'Updated oncejob_trigger');
            }
        });
    }
    const job = new CronJob(arg ? arg.time : "0 0 13 1 *", function() {
        const d = new Date();
        console.log('Every Tenth Minute:', d);
        reaction(results, arg);
    });
    console.log('After job instantiation');
    job.start();
    job.addCallback(function () {
        this.stop();
    });

}
