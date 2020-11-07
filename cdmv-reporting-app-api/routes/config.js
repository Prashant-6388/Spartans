var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json();

router.get('/', function(req, res, next) {
  res.send('Welcome to config wizard');
});

router.get('/selectAll', function(req, res, next) {
  oracledb.getConnection(
        {
            user: "root",
            password: "admin",
            connectString: "localhost:3306/testdb"
        },
        function (err, connection) {
            if (err) { console.error(err); return; }
            connection.execute(
                "select db.TYPE, db.HOST, db.PORT, db.SERVICE, db.USERNAME, db.SID, db.ID from db_config db",
                function (err, result) {
                    if (err) { console.error(err); return; }
                    if(result.rows.length > 0)
                        res.json({
							data : result
						});
                    else 
                        res.send('unable to retrive config details, please make sure config name is correct');
                });
        });
});


router.post('/select', jsonParser, function(req, res, next) {
    console.log("app  ="+req.body.applicationId);
    var applicationId = req.body.application_id;
    oracledb.getConnection(
        {
            user: "root",
            password: "admin",
            connectString: "localhost:3306/testdb"
        },
        function (err, connection) {
            if (err) { console.error(err); return; }
            connection.execute(
                "select * from db_config where application_id='"+applicationId+"'",
                function (err, result) {
                    if (err) {
						console.error(err); return;
					}
                    else if(result.rows.length > 0)
                        res.send(result);
                    else 
                        res.send('unable to retrive config details, please make sure config name is correct');
                });
        });
});


router.post('/insert', jsonParser, function(req, res, next) {
    var type = req.body.type;
    var host = req.body.host;
	var port = req.body.port;
	var sid = req.body.sid;
	var service = req.body.service;
	var username = req.body.username;
	var password = req.body.password;
	
    oracledb.getConnection(
        {
            user: "root",
            password: "admin",
            connectString: "localhost:3306/testdb"
        },
        function (err, connection) {
            if (err) { console.error(err); return; }
            var insertQuery = "insert into db_config(type, host, port, sid, service, username, password) "+
            "values(:0, :01, :2, :3, :4, :5, :6)";				
				
            connection.execute(insertQuery,
                [type, host, port, sid, service, username, password],
                {autoCommit : true},
                function (err, result) {
                    if (err) { 
						console.error(err); return; 
					}
                    else 
                        res.send('Record inserted into DB_CONFIG table');
                });
        });
});


router.post('/delete', jsonParser, function(req, res, next) {
    var configId = req.body.configId;

    oracledb.getConnection(
        {
            user: "root",
            password: "admin",
            connectString: "localhost:3306/testdb"
        },
        function (err, connection) {
            if (err) { console.error(err); return; }
            var deleteQuery = "delete from db_config where id = :1 ";
    		
            connection.execute(deleteQuery,
                [configId],
                {autoCommit : true},
                function (err, result) {
                    if (err) { 
						console.error(err); return; 
					}
                    else 
                        res.send('Record Deleted successfully');
                });
        });
});

router.post('/update', jsonParser, function (req, res, next) {
    var type = req.body.type;
    var host = req.body.host;
    var port = req.body.port;
    var sid = req.body.sid;
    var service = req.body.service;
    var username = req.body.username;
    var password = req.body.password;
    var id = req.body.id;

    oracledb.getConnection(
        {
            user: "root",
            password: "admin",
            connectString: "localhost:3306/testdb"
        },
        function (err, connection) {
            if (err) { console.error(err); return; }
            var insertQuery = "update db_config set type=:0, host=:01, port=:2, sid=:3, service=:4, username=:5, password=:6 where id=:7 ";

            connection.execute(insertQuery,
                [type, host, port, sid, service, username, password, id],
                { autoCommit: true },
                function (err, result) {
                    if (err) {
                        console.error(err); return;
                    }
                    else
                        res.send('Record inserted into DB_CONFIG table');
                });
        });
});

//TODO: Update
// need to see what we want to update...
/*router.post('/update', jsonParser, function(req, res, next) {
    var updateParams = req.body.updateParams;
    var conditionalParams = req.body.conditionalParams;
    
    console.log("updateParams = "+updateParams);
    console.log("conditionalParams = "+conditionalParams);
    
    var password = req.body.password;
    
    oracledb.getConnection(
        {
            user: "root",
            password: "admin",
            connectString: "localhost:3306/testdb"
        },
        function (err, connection) {
            if (err) { console.error(err); return; }

            if(typeof updateParams == 'undefined' || typeof conditionalParams=='undefined')
                res.send("insufficient data provided");
           
            var updateQuery = "update db_config SET";
            const seperator = ",";
            const conditionJoiner = " AND ";
            //adding update Params
            for( var i=0 ; i < updateParams.length ; i++) {
                var param = updateParams[i];
                updateQuery += " "+param.column +"=";
                updateQuery += "'"+param.value + "'";
                if( i != updateParams.length-1)
                    updateQuery += seperator;
            }
            //adding conditional Params
            updateQuery += " WHERE ";
            for( var i=0 ; i < conditionalParams.length ; i++) {
                var condition = conditionalParams[i];
                updateQuery += " "+condition.column +"=";
                updateQuery += "'"+condition.value + "'";
                if( i != conditionalParams.length-1)
                    updateQuery += conditionJoiner;
            }
            console.log("query = "+updateQuery);
            
            connection.execute(updateQuery,
                {},
                {autoCommit : true},
                function (err, result) {
                    if (err) { 
						console.error(err); return; 
					}
                    else 
                        res.send('Record updated successfully');
                });
        });
});*/

router.post('/update', jsonParser, function(req, res, next) {
	var application = req.body.application;
    var type = req.body.type;
    var host = req.body.host;
	var port = parseInt(req.body.port);
	var sid = req.body.sid;
	var service = req.body.service;
	var username = req.body.username;
	var password = req.body.password;
	console.log("Type="+type+", host="+host+", port="+port+", sid="+sid+", service="+service+", username="+username+", password="+password);
    
    //var updateQuery = "update db_config set type=:0, host=:1, port=:2, sid=:3, service=:4, username=:5, password=:6 where application_id=(select id from report_query where report_name=:7)";
    var updateQuery = "update db_config set type='"+type+"', host='"+host+"', port="+port+", sid='"+sid+"', service='"+service+"', username='"+username+"', password='"+password+"' where application_id=(select id from report_query where report_name='"+application+"')";
    console.log("update Query = "+updateQuery);
    oracledb.getConnection(
        {
            user: "root",
            password: "admin",
            connectString: "localhost:3306/testdb"
        },
        function (err, connection) {
            if (err) { console.error(err); return; }

            connection.execute(updateQuery,
                {},
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
