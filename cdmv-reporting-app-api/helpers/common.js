var atob = require('atob');
var oracledb = require('oracledb');
var mysql = require('mysql');
const { query } = require('express');
class Common{
   static getData(dbconfig,queryParams,res) {
       var reportQuery = dbconfig.rows[0][0];
       var dbType = dbconfig.rows[0][1];
        console.log("inside get cnnrction for dbType " + dbType);
       var hostName = dbconfig.rows[0][2];
       var service = dbconfig.rows[0][4];
       var userName = dbconfig.rows[0][5];
       var password = dbconfig.rows[0][6];
       var preferences = dbconfig.rows[0][7];
       if(preferences != null)
        preferences = JSON.parse(preferences);
       var inputString = {};
       if(queryParams){
           for (let i = 0; i < queryParams.length; i++) {
               inputString[i] = queryParams[i];
           }
       }       
       console.log('inputString: '+inputString);
       if (dbType =='Oracle'){   
           //oracledb.extendedMetaData = true;        
           oracledb.getConnection(
               {
                   user: userName,
                   password: password,
                   connectString: hostName+"/"+service
               }).then(con => con.execute(
                   reportQuery, inputString).then(result => {
                       res.json({ columns: result.metaData, data: result.rows, columnPreference: preferences });
                   }).catch(ex => {
                       con.release();
                       console.log(ex.stacktrace);
                       res.status(500).json({ message: ex.message });
                   })
               ).catch(ex => {
                   console.log(ex.stacktrace);
                   res.status(500).json({ message: ex.message });
               });
       } else if(dbType=='MySql'){
           var connection = mysql.createConnection({
               host: hostName,
               user: userName,
               password: password,
               database: service
           });

           connection.connect();
           connection.query(reportQuery, function (err, rows, fields) {
               if (err)
                   res.status(500).json({ message: err });
               //res.json({data: rows });
               res.json({ columns: fields, data: rows, columnPreference: preferences });
           });
           connection.end();

       }
            
    }
}

module.exports = Common;