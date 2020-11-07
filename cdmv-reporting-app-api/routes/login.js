var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json();
router.post('/', jsonParser, function(req, res, next) {
    console.log(req.body.userName);
    var userName = req.body.userName;
    var password = req.body.password;
    oracledb.getConnection(
        {
            user: "root",
            password: "admin",
            connectString: "localhost:3306/testdb"
        }).then(con => {
            
            con.execute("SELECT LISTAGG(group_name, ',')      AS groups, " +
                "LISTAGG(report_name, ',')     AS reports " +
                "FROM ( SELECT rg.group_name, " +
                "CASE " +
                "WHEN rg.group_name = 'ADMIN' THEN 'ALL' " +
                "ELSE rq.report_name " +
                "END    AS report_name " +
            "FROM reporting_groups_users  rgu " +
               "LEFT JOIN reporting_users ru ON ru.id = rgu.user_id " +
               "LEFT JOIN reporting_groups rg ON rgu.GROUP_ID = rg.id " +
               "LEFT OUTER JOIN reporting_groups_access rga ON rg.id = rga.GROUP_ID "+
               "LEFT JOIN report_query rq ON rq.id = rga.report_id "+
                "WHERE ru.user_id = '" + userName + "' AND ru.password = '" + password +"')").then(
            result => {                
                    if (result.rows.length > 0)
                        res.json(result.rows[0]);
                    else
                        res.send('Login failed');
            }).catch(ex => {
                console.log('Inside connection catch block');
                con.release();
                console.log(ex.stacktrace);
                res.status(500).json({ message: ex.message });
            })
        }).catch(ex => {
            console.log('Inside generic catch block');
            console.log(ex.message);
            res.status(500).json({ message: ex.message });
        });        
});

module.exports = router;
