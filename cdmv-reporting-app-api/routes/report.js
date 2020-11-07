var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const common = require('../helpers/common');
router.post('/save', jsonParser, function (req, res, next) {
    var reportName = req.body.reportName;
    var dbConfigId = req.body.dbConfigId;
    var reportQuery = req.body.reportQuery;    
    oracledb.getConnection(
        {
            user: "root",
            password: "admin",
            connectString: "localhost:3306/testdb"
        }).then(con => con.execute(
            "insert into report_query (report_name,db_config_id,query) values(:reportname ,:dbconfigid,:query) ",
            {
                reportname: reportName,
                dbconfigid: dbConfigId,
                query: reportQuery
            }).then(result => {
                con.commit();
                if (result.rowsAffected > 0)
                    res.json({ result: 'Successfully Inserted' });
                else 
                    res.json({result: 'No rows inserted'});
            }).catch(ex => {
                con.release();
                console.log(ex.stacktrace );
                res.status(500).json({ message: ex.message});
            })
        ).catch(ex => {
            console.log(ex.stacktrace);
            res.status(500).json({ message: ex.message });
        });
       
});

router.get('/allReportDetails', function (req, res, next) {
    oracledb.getConnection(
        {
            user: "root",
            password: "admin",
            connectString: "localhost:3306/testdb"
        },
        function (err, connection) {
            if (err) { console.error(err); return; }
            connection.execute(
                "select rq.report_name, nvl(dc.service,dc.sid) || ':' || dc.username as datasource from report_query rq left join db_config dc on (rq.db_config_id=dc.id)",
                function (err, result) {
                    if (err) { console.error(err); return; }
                    if (result.rows.length > 0)
                        res.json({
                            data: result
                        });
                    else
                        res.send('There are no report details available. Please add a report');
                });
        });
});

router.post('/fetchReport', jsonParser, function (req, res, next) {
    var reportName = req.body.reportName;
    var queryParams = req.body.queryParams;
    var userName = req.body.userName;
    oracledb.fetchAsString = [oracledb.CLOB];
    oracledb.getConnection(
        {
            user: "root",
            password: "admin",
            connectString: "localhost:3306/testdb"
        }).then(con => con.execute(
            "SELECT rq.query, "+
       "dbc.TYPE, "+
            "dbc.HOST, "+
            "dbc.port, "+
            "CASE WHEN dbc.service IS NULL THEN dbc.sid ELSE dbc.service END "+
           "AS serviceOrId, "+
            "dbc.username, "+
            "dbc.password, "+
            "rp.report_preferences "+
  "FROM report_query  rq "+
       "LEFT JOIN db_config dbc ON rq.db_config_id = dbc.id "+
       "LEFT OUTER JOIN report_preferences rp "+
           "ON(rq.id = rp.report_id "+
               "AND rp.user_id = (SELECT id "+
                                   "FROM reporting_users "+
                                  "WHERE user_id = : user_name)) "+
   "WHERE rq.report_name = : reportName",
            {
                reportname: reportName,
                user_name: userName
            }).then(result => {  
                common.getData(result,queryParams,res);
                //res.json({ data: result.rows });
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

router.post('/fetchReportQuery', jsonParser, function (req, res, next) {
    var reportName = req.body.reportName;
    oracledb.fetchAsString = [oracledb.CLOB];
    oracledb.getConnection(
        {
            user: "root",
            password: "admin",
            connectString: "localhost:3306/testdb"
        }).then(con => con.execute(
            "SELECT query " +
            "FROM report_query "  +
            "WHERE report_name = : reportName",
            {
                reportname: reportName
            }).then(result => {
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

router.post('/update', jsonParser, function (req, res, next) {
    var reportName = req.body.reportName;
    var dbConfigId = req.body.dbConfigId;
    var reportQuery = req.body.reportQuery;
    var modifiedReportName = req.body.modifiedReportName;
    oracledb.getConnection(
        {
            user: "root",
            password: "admin",
            connectString: "localhost:3306/testdb"
        }).then(con => con.execute(
            "update report_query set report_name = :modifiedReportName, query = :query,db_config_Id = :dbId where report_name = :reportname ",
            {
                reportname: reportName,
                modifiedReportName: modifiedReportName,
                query: reportQuery,
                dbId: dbConfigId
            }).then(result => {
                con.commit();
                if (result.rowsAffected > 0)
                    res.json({ result: 'Successfully updated' });
                else
                    res.json({ result: 'No rows updated' });
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

router.post('/delete', jsonParser, function (req, res, next) {
    var reportName = req.body.reportName;
    oracledb.getConnection(
        {
            user: "root",
            password: "admin",
            connectString: "localhost:3306/testdb"
        }).then(con => con.execute(
            "delete from report_query where report_name = :reportname ",
            {
                reportname: reportName
            }).then(result => {
                con.commit();
                if (result.rowsAffected > 0)
                    res.json({ result: 'Successfully deleted' });
                else
                    res.json({ result: 'No rows deleted' });
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
