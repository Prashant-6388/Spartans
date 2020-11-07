var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var moment = require('moment');

router.post('/save', jsonParser, function (req, res, next) {
    var reportId = req.body.reportId;
    var appId = req.body.appId;
    var userId = req.body.userId;
    oracledb.getConnection(
        {
            user: "root",
            password: "admin",
            connectString: "localhost:3306/testdb"
        }).then(con => con.execute(
            "INSERT INTO reporting_statistics (ID,USER_Id, REPORT_ID,APPLICATION_ID,ACCESS_TIME) VALUES (REPORTING_STATISTICS_SEQ.NEXTVAL,:userId, :reportId, :appId, sysdate)",
            {
                userId: userId,
                reportId: reportId,
                appId: appId
            }).then(result => {
                if (result.rowsAffected > 0) {
                    con.commit();
                    res.json({ result: 'Successfully Updated statistics' });
                } else{
                            res.json({ result: 'Unable to update the statistics count' });
                }   
            }).catch(ex => {
                con.release();
                console.log(ex.stacktrace);
                res.status(500).json({ message: ex.message });
            })
        ).catch(ex => {
            console.log(ex.stacktrace);
            res.status(500).json({ message: ex.message });
        });
});

router.get('/fetchAll', jsonParser, function (req, res, next) {
    oracledb.getConnection(
        {
            user: "root",
            password: "admin",
            connectString: "localhost:3306/testdb"
        }).then(con => con.execute("SELECT application_id,report_id,user_id, access_time  FROM REPORTING_STATISTICS").then(
            result => {
                res.json({ data: result.rows });
            }).catch(ex => {
                con.release();
                console.log(ex.stacktrace);
                res.status(500).json({ message: ex.message });
            })
        ).catch(ex => {
            console.log(ex.stacktrace);
            res.status(500).json({ message: ex.message });
        });
});

router.post('/fetchByTimeRange', jsonParser, function (req, res, next) {
    var fetchType = req.body.fetchType;
    var query = "SELECT application_id,report_id,user_id, access_time  FROM REPORTING_STATISTICS";
    const date = new Date();
    const year = date.getFullYear();
    if(fetchType == 'thisMonth'){
        query = query + " where trunc(access_time) BETWEEN trunc (sysdate, 'mm')  AND SYSDATE"; 
    } else if (fetchType == 'lastThreeMonths'){
        query = query + " where trunc(access_time) BETWEEN trunc (sysdate-90) AND SYSDATE";
    } else if (fetchType == 'lastSixMonths') {
        query = query + " where trunc(access_time) BETWEEN trunc (sysdate-180) AND SYSDATE";
    } else if(fetchType == 'oneYear'){
        query = query + " where trunc(access_time) BETWEEN trunc (sysdate-365) AND SYSDATE";
    } else if(fetchType == 'customRange'){
        var fromDate = req.body.from;
        var toDate = req.body.to;
        query = query + " where trunc(access_time) BETWEEN trunc("+fromDate+") AND trunc("+toDate+")";
    }
    oracledb.getConnection(
        {
            user: "root",
            password: "admin",
            connectString: "localhost:3306/testdb"
        }).then(con => con.execute(query).then(
            result => {
                res.json({ data: result.rows });
            }).catch(ex => {
                con.release();
                console.log(ex.stacktrace);
                res.status(500).json({ message: ex.message });
            })
        ).catch(ex => {
            console.log(ex.stacktrace);
            res.status(500).json({ message: ex.message });
        });
});
module.exports = router;
