var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json();

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
                  "select rg.group_name, Listagg(rq.report_name, ',') reports "+
                  "from reporting_groups rg "+
                  "Left join reporting_groups_access rga on rg.id = rga.group_id "+
                  "Left join report_query rq on rq.id = rga.report_id "+
                  "group by rg.group_name order by rg.group_name",
                  function (err, result) {
                      if (err) { console.error(err); return; }
                      if(result.rows.length > 0)
                          res.json({
                              data : result
                          });
                      else 
                          res.send('unable to retrive user details, please make sure config name is correct');
                  });
          });
  });

router.get('/selectAllReports', function(req, res, next) {
    oracledb.getConnection(
          {
              user: "root",
              password: "admin",
              connectString: "localhost:3306/testdb"
          },
          function (err, connection) {
              if (err) { console.error(err); return; }
              connection.execute(
                  "select report_name from report_query",
                  function (err, result) {
                      if (err) { console.error(err); return; }
                      if(result.rows.length > 0)
                          res.json({
                              data : result
                          });
                      else 
                          res.send('unable to retrive user details, please make sure config name is correct');
                  });
          });
  });

router.post('/insertGroup', jsonParser, function (req, res, next) {
    var groupname = req.body.groupname;
    var roles = req.body.roles;
    oracledb.getConnection(
        {
            user: "root",
            password: "admin",
            connectString: "localhost:3306/testdb"
        }).then(con => con.execute(
            "insert into reporting_groups(group_name, group_desc) values (:groupname, ' ')",
            {
                groupname : groupname
            }, {autoCommit : true}).then(result => {
                console.log(result);
                updateGroupRoles(groupname, roles, res);
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


router.post('/updateGroupRoles', jsonParser, function (req, res, next) {
    var groupname = req.body.groupname;
    var roles = req.body.roles;
    updateGroupRoles(groupname, roles, res);
});

router.post('/deleteGroup', jsonParser, function (req, res, next) {
    var groupname = req.body.groupname;
    oracledb.getConnection(
        {
            user: "root",
            password: "admin",
            connectString: "localhost:3306/testdb"
        }).then(con => con.execute(
            "delete from reporting_groups_access where group_id=(select id from reporting_groups where group_name=:groupname)",
            {
                groupname : groupname,
            }, {autoCommit: true}).then(result => {
                    con.execute("delete from reporting_groups where group_name=:groupname",{groupname:groupname}, {autoCommit:true}).then(result =>{
                    res.json("group deleted.....");
                })
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

function updateGroupRoles(groupname, reports, res){
    if(reports.length > 0) {
        var str="";
        for(var i=0; i<reports.length; i++){
            console.log(reports[i]);
            if(i==0)
                str = str + '\'' + reports[i] + '\'';
            else
                str = str + ',\'' + reports[i] + '\'';
        }
        console.log("reports="+str);
        let connection = oracledb.getConnection({
                user: "root",
                password: "admin",
                connectString: "localhost:3306/testdb"
            }).then(con => {
                
                var groupQuery = "select id from report_query where report_name in ("+str+")"; 
                con.execute(groupQuery).then(result => {
                    var reportsRes = result.rows;
                    if(reportsRes.length > 1 ){
                        updateGroupForMultipleRoles(groupname, reportsRes, con, res);
                    } else{
                        updateGroupForSingleRole(groupname, reportsRes, con, res);
                    }
                });
        });
    }
    else{
        deleteUserGroups(groupname, res);
    }
}

function updateGroupForSingleRole(groupname, reportsRes, con, res) {
    var userQuery = "select id from reporting_groups where group_name = '"+groupname+"'";
    con.execute(userQuery).then(result => {
        var groupid = result.rows[0][0];
        //delete existing assignments
        var delQuery = "delete from reporting_groups_access where group_id=:groupid";
        con.execute(delQuery,{groupid:groupid},{autoCommit:true}).then(result => {
            
            var query = "insert into reporting_groups_access (group_id, report_id) values (:a, :b)";
            con.execute(query, { a: groupid, b: reportsRes[0][0] }, {autoCommit:true}).then(result => {
                res.json("user updated....");
            }).catch(ex => {
                con.release();
                console.log(ex.stacktrace);
                res.status(500).json({ message: ex.message });
            })
        });
    });

}

function updateGroupForMultipleRoles(groupname, reportsRes, con, res) {
    let binds = [];
    var userQuery = "select id from reporting_groups where group_name = '"+groupname+"'";
    con.execute(userQuery).then(result => {
        var groupId = result.rows[0][0];
        //delete existing assignments
        var delQuery = "delete from reporting_groups_access where group_id="+groupId;
        con.execute(delQuery).then(result => {
            reportsRes.forEach(element => {
                var params = {
                    a : groupId,
                    b : element[0]
                };
                binds.push(params);
            })

            const options = {
                autoCommit: true,
                bindDefs: {
                    a: { type: oracledb.NUMBER },
                    b: { type: oracledb.NUMBER }
                }
            }
            var query = "insert into reporting_groups_access (group_id, report_id) values (:a, :b)";
            con.executeMany(query, binds, options).then(result => {
                res.json("user updated....");
            }).catch(ex => {
                con.release();
                console.log(ex.stacktrace);
                res.status(500).json({ message: ex.message });
            });
        })
        
    }).catch(ex => {
        con.release();
        console.log(ex.stacktrace);
        res.status(500).json({ message: ex.message });
    });
}

function deleteUserGroups(groupname,res) {
    oracledb.getConnection(
        {
            user: "root",
            password: "admin",
            connectString: "localhost:3306/testdb"
        }).then(con => con.execute(
            "delete from reporting_groups_access where group_id = (select id from reporting_groups where group_name = :groupname)",
            {groupname : groupname},
            {autoCommit:true}).then(result => {
                console.log("all roles deleted from user "+groupname);
                res.json("Record updated succesfully....");
            }).catch(ex => {
                con.release();
                console.log(ex.stacktrace);
                res.status(500).json({ message: ex.message });
            })
        ).catch(ex => {
            console.log(ex.stacktrace);
            res.status(500).json({ message: ex.message });
        });
}

  module.exports = router;
