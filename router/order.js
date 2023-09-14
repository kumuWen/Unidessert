var express = require('express');
var mysql= require('mysql');
var app  = express.Router();

var conn = mysql.createConnection({
    host:'localhost',
    port:'3306',
    user:'root',
    password:'',
    database:'unidessert'
});
conn.connect(function(err){
    if(err){
        console.log('資料庫無法啟動',err,err.errno,err.sqlMessage)
    }else{
        console.log("資料庫正常啟動");
    } 
});

var sql = "SELECT * FROM orderlist WHERE oid = ? and recipient = ? and order_total =? ";
app.get("/order", (req, res) => {
  DB.query(sql, [req.body.oid,req.body.recipient,req.body.order_total], (err, data) => {
    if (!err) {
        console.log(data)
        res.render('member.ejs', {
            orderlist:data
        })
        // res.send(JSON.stringify(data))
    } else {
        res.send('查不到訂單') 
    }  
  });
});

module.exports = app

