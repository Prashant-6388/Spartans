var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
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
                "select ru.user_id, rug.group_name, Listagg(rug.page_access,',') as roles from reporting_users ru, reporting_users_group rug "+
				"where ru.group_id = rug.id group by ru.user_id, rug.group_name order by ru.user_id",
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

router.post('/getByUserAndGroup', jsonParser, function (req, res, next) {
    var username = req.body.username;
    var groupname = req.body.groupname;
    oracledb.getConnection(
        {
            user: "root",
            password: "admin",
            connectString: "localhost:3306/testdb"
        }).then(con => con.execute(
            "select rug.page_access as roles from reporting_users ru, reporting_users_group rug  "+
			"where ru.group_id = rug.id and ru.user_id=:username and rug.group_name=:groupname",
            {
                username : username,
                groupname : groupname
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


router.post('/deleteRoleForUser', jsonParser, function (req, res, next) {
    var username = req.body.username;
    var groupname = req.body.groupname;
    var role = req.body.role;
    oracledb.getConnection(
        {
            user: "root",
            password: "admin",
            connectString: "localhost:3306/testdb"
        }).then(con => con.execute(
            "delete from reporting_users ru, reporting_users_group rug  "+
			"where ru.user_id=:username and ru.group_id = rug.id and rug.group_name=:groupname and rug.page_access=:role",
            {
                username : username,
                groupname : groupname,
                role : role
            }).then(result => {
                res.json("role deleted....");
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

router.post('/insertRoleForUser', jsonParser, function (req, res, next) {
    var username = req.body.username;
    var groupname = req.body.groupname;
    var role = req.body.role;
    oracledb.getConnection(
        {
            user: "root",
            password: "admin",
            connectString: "localhost:3306/testdb"
        }).then(con => con.execute(
            "insert into reporting_users_group(id, group_name, page_access) "+
            "values((select group_id from reporting_users ru, reporting_users_group rug "+
            "where ru.user_id=:username and ru.group_id=rug.id and rug.group_name=:groupname and rownum=1), :groupname, :role)",
            {
                username : username,
                groupname : groupname,
                role : role
            }).then(result => {
                res.json("role deleted....");
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

router.post('/insertUser', jsonParser, function (req, res, next) {
    var username = req.body.username;
    var groupnames = req.body.groupname;
    var password = req.body.password;
    oracledb.getConnection(
        {
            user: "root",
            password: "admin",
            connectString: "localhost:3306/testdb"
        }).then(con => con.execute(
            "insert into reporting_users(id,user_id, password) values((select max(id)+1 from reporting_users), :username, :password)",
            {
                username : username,
                password : password
            }, {autoCommit : true}).then(result => {
                console.log(result);
                res.json("User inserted....");
                updateUserGroups(username, groupnames, res);
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

router.post('/deleteUser', jsonParser, function (req, res, next) {
    var username = req.body.username;
    oracledb.getConnection(
        {
            user: "root",
            password: "admin",
            connectString: "localhost:3306/testdb"
        }).then(con => con.execute(
            "delete from reporting_groups_users where user_id=(select id from reporting_users where user_id=:username)",
            {
                username : username,
            }, {autoCommit: true}).then(result => {
                con.execute("delete from reporting_users where user_id=:username",{username:username}, {autoCommit:true}).then(result =>{
                    res.json("user deleted.....");
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

router.get('/selectAllUsers', function(req, res, next) {
  oracledb.getConnection(
        {
            user: "root",
            password: "admin",
            connectString: "localhost:3306/testdb"
        },
        function (err, connection) {
            if (err) { console.error(err); return; }
            connection.execute(
                "select u.user_id, listagg(group_name,',') groups "+
				"from reporting_users u "+
				"LEFT JOIN reporting_groups_users ug on u.id = ug.user_id "+
				"LEFT JOIN reporting_groups g on ug.group_id=g.id "+
				"group by u.user_id order by user_id",
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


router.get('/selectAllGroups', function(req, res, next) {
    oracledb.getConnection(
          {
              user: "root",
              password: "admin",
              connectString: "localhost:3306/testdb"
          },
          function (err, connection) {
              if (err) { console.error(err); return; }
              connection.execute(
                  "select distinct group_name from reporting_groups",
                  function (err, result) {
                      if (err) { console.error(err); return; }
                      if(result.rows.length > 0)
                          res.json({
                              data : result
                          });
                      else 
                          res.send('unable to retrive groups');
                  });
          });
  });
  
router.post('/updateUserGroups', jsonParser, function (req, res, next) {
    var username = req.body.username;
    var groupnames = req.body.groupname;
    updateUserGroups(username, groupnames, res);
});


function updateUserGroups(username, groupnames, res){
    if(groupnames.length > 0) {
        var str="";
        for(var i=0; i<groupnames.length; i++){
            console.log(groupnames[i]);
            if(i==0)
                str = str + '\'' + groupnames[i] + '\'';
            else
                str = str + ',\'' + groupnames[i] + '\'';
        }
        console.log("groupnames="+str);
        let user_id;
        let group_ids;
        let connection = oracledb.getConnection({
                user: "root",
                password: "admin",
                connectString: "localhost:3306/testdb"
            }).then(con => {
                
                var groupQuery = "select id from reporting_groups where group_name in ("+str+")"; 
                con.execute(groupQuery).then(result => {
                    var groupRes = result.rows;
                    if(groupRes.length > 1 ){
                        updateUserForMultipleGroups(username, groupRes, con, res);
                    } else{
                        updateUserForSingleGroup(username, groupRes, con, res);
                    }
                });
        });
    }
    else{
        deleteUserGroups(username, res);
    }
}

function updateUserForSingleGroup(username, groupRes, con, res) {
    var userQuery = "select id from reporting_users where user_id = '"+username+"'";
    con.execute(userQuery).then(result => {
        var userId = result.rows[0][0];
        //delete existing assignments
        var delQuery = "delete from reporting_groups_users where user_id=:userId";
        con.execute(delQuery,{userId:userId},{autoCommit:true}).then(res => {
            
            var query = "insert into reporting_groups_users (user_id, group_id) values (:a, :b)";
            con.execute(query, { a: userId, b: groupRes[0][0] }, {autoCommit:true}).then(result => {
                res.json("user updated....");
            }).catch(ex => {
                con.release();
                console.log(ex.stacktrace);
                res.status(500).json({ message: ex.message });
            })
        });
    });

}

function updateUserForMultipleGroups(username, groupRes, con, res) {
    let binds = [];
    var userQuery = "select id from reporting_users where user_id = '"+username+"'";
    con.execute(userQuery).then(result => {
        var userId = result.rows[0][0];
        //delete existing assignments
        var delQuery = "delete from reporting_groups_users where user_id="+userId;
        con.execute(delQuery).then(res => {
            groupRes.forEach(element => {
                var params = {
                    a : userId,
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
            var query = "insert into reporting_groups_users (user_id, group_id) values (:a, :b)";
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

function deleteUserGroups(username,res) {
    oracledb.getConnection(
        {
            user: "root",
            password: "admin",
            connectString: "localhost:3306/testdb"
        }).then(con => con.execute(
            "delete from reporting_groups_users where user_id = (select id from reporting_users where user_id = :username)",
            {username : username},
            {autoCommit:true}).then(result => {
                console.log("all groups deleted from user "+username);
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
