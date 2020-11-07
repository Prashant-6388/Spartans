var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json();

router.get('/', function(req, res, next) {
  res.send('Welcome to report preferences');
});

router.post('/select', jsonParser, function(req, res, next) {
    console.log("app  ="+req.body.report_name);
    var report_name = req.body.report_name;
	var user_name = req.body.user_name;
	oracledb.fetchAsString = [oracledb.CLOB];
    oracledb.getConnection(
        {
            user: "root",
            password: "admin",
            connectString: "localhost:3306/testdb"
        },
        function (err, connection) {
            if (err) { console.error(err); return; }
            connection.execute(
                "select * from report_preferences where report_id = (select id from report_query where report_name='" + report_name + "') and user_id=(select id from reporting_users where user_id='"+ user_name +"')",
                function (err, result) {
                    if (err) {
						console.error(err); return;
					}
                    else if(result.rows.length > 0) {
                        console.log(result.rows[0][2]);
						res.send(result);
					}
                    else 
                        res.send('unable to retrive config details, please make sure config name is correct');
                });
        });
});


router.post('/insert', jsonParser, function(req, res, next) {
    var report_name = req.body.report_name;
    var preferences = req.body.preferences;
	var user_name = req.body.user_name;
	console.log("reportName : "+report_name);
	console.log("preferences : "+preferences);
	
    oracledb.getConnection(
        {
            user: "root",
            password: "admin",
            connectString: "localhost:3306/testdb"
        },
        function (err, connection) {
            if (err) { console.error(err); return; }
			
            var insertQuery= "insert into report_preferences (report_id, report_preferences, user_id) values ((select id from report_query where report_name=:0), :1, (select id from reporting_users where user_id=:2))";
            connection.execute(insertQuery,
                [report_name, preferences, user_name],
                {autoCommit : true},
                function (err, result) {
                    if (err) { 
                        console.error(err);
                        res.send(err); 
                    }
                    else 
                        res.send('Record inserted into report_references table');
                });
        });
});


router.post('/delete', jsonParser, function(req, res, next) {
    var report_name = req.body.report_name;

    oracledb.getConnection(
        {
            user: "root",
            password: "admin",
            connectString: "localhost:3306/testdb"
        },
        function (err, connection) {
            if (err) { console.error(err); return; }
            var deleteQuery = "delete from report_preferences where report_id = (select id from report_query where report_name=:0) ";
            
    		
            connection.execute(deleteQuery,
                [report_name],
                {autoCommit : true},
                function (err, result) {
                    if (err) { 
                        console.error(err); 
                        res.send(result);
					}
                    else 
                        res.send('Record Deleted successfully');
                });
        });
});

//TODO: Update
// need to see what we want to update...
router.post('/update', jsonParser, function(req, res, next) {
    var report_name = req.body.report_name;
    var preferences = req.body.preferences;
    
    console.log("report_name = "+report_name);
    console.log("preferences = "+preferences);
    
    
    oracledb.getConnection(
        {
            user: "root",
            password: "admin",
            connectString: "localhost:3306/testdb"
        },
        function (err, connection) {
            if (err) { console.error(err); return; }

            var updateQuery= "update report_preferences SET report_preferences = :0 where report_id = (select id from report_query where report_name=:1)";
            
            connection.execute(updateQuery,
                [preferences,report_name],
                {autoCommit : true},
                function (err, result) {
                    if (err) { 
						console.error(err); return; 
					}
                    else 
                        res.send('Record updated successfully');
                });
        });
});



module.exports = router;
