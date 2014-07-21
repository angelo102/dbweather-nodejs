
/**
 * Module dependencies.
 */

 var express = require('express')
 , routes = require('./routes')
  //, user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , mysql = require('mysql');

  var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

//Mysql coding
// Send parameters to MySQL Server
var dbconnection = mysql.createConnection({
 host:"127.0.0.1",
 user: "root",
 password: "root",
 database: "weatherforecast",
 insecureAuth:true
});

// Check for an errors at the time of sending parameters
dbconnection.on( "error", function(error){
 console.log( "ERROR: " + error );
});

//Establish connection with MySQL
dbconnection.connect(function(error){
 if (error){
   console.log( "Error on connect: " + error);
 }
});

// Send query to MySQL DB on request
app.get('/u',function(req, res){
 var query="SELECT field1, field2 FROM table1;";
 dbconnection.query( query, function(err, rows, fields){

  console.log('Connection result error '+err);
  console.log('no of records is '+rows.length);
  res.header('Access-Control-Allow-Origin', '*');
  //res.header('Access-Control-Allow-Headers','Content-Type,X-Requested-With');
  res.writeHead(200, { 'Content-Type': 'application/json'});
  res.end(JSON.stringify(rows));


 // There was an error or not?
 /*if(err != null)
 {
   res.end("Query error:" + err);
 }
 else
 {
  res.end("Field1: "+rows[0].field1+"\nField2: "+rows[0].field2);
  //res.end();
 }*/
 
  });
});

//Get cities list
app.get('/cities',function(req, res){
 var query="SELECT CITY_NAME FROM city;";
 dbconnection.query( query, function(err, rows, fields){

  console.log('Connection result error '+err);
  console.log('no of records is '+rows.length);
  res.header('Access-Control-Allow-Origin', '*');
  //res.header('Access-Control-Allow-Headers','Content-Type,X-Requested-With');
  res.writeHead(200, { 'Content-Type': 'application/json'});
  res.end(JSON.stringify(rows));

  });
});

app.get('/stations',function(req, res){
 var query="SELECT CITY_NAME, STATION_NAME FROM station s, city c WHERE s.CITY_ID = c.CITY_ID;";
 dbconnection.query( query, function(err, rows, fields){

  console.log('Connection result error '+err);
  console.log('no of records is '+rows.length);
  res.header('Access-Control-Allow-Origin', '*');
  //res.header('Access-Control-Allow-Headers','Content-Type,X-Requested-With');
  res.writeHead(200, { 'Content-Type': 'application/json'});
  res.end(JSON.stringify(rows));

  });
});

app.get('/temps',function(req, res){
 var query="SELECT DATE_FORMAT(t.date,'%m-%d-%Y') as DATE,t.MIN_TEMP, t.MAX_TEMP, s.STATION_NAME, c.CITY_NAME, t.STATION_ID, s.CITY_ID FROM temperature t, station s, city c WHERE t.STATION_ID = s.STATION_ID AND s.CITY_ID= c.CITY_ID;";
 dbconnection.query( query, function(err, rows, fields){

  console.log('Connection result error '+err);
  console.log('no of records is '+rows.length);
  res.header('Access-Control-Allow-Origin', '*');
  //res.header('Access-Control-Allow-Headers','Content-Type,X-Requested-With');
  res.writeHead(200, { 'Content-Type': 'application/json'});
  res.end(JSON.stringify(rows));

  });
});

app.get('/tempsQ',function(req, res){
 var query="SELECT DATE_FORMAT(t.date,'%m-%d-%Y') as DATE,t.MIN_TEMP, t.MAX_TEMP, s.STATION_NAME, c.CITY_NAME FROM temperature t, station s, city c WHERE t.STATION_ID = s.STATION_ID AND s.CITY_ID = c.CITY_ID AND t.DATE=?;";
 query = mysql.format(query,[req.query.date]);
 console.log(query);

 dbconnection.query( query, function(err, rows, fields){

  console.log('Connection result error '+err);
  console.log('no of records is '+rows.length);
  console.log(req.params.date);
  console.log(req.query.date);
  console.log(req.param('date'));
  res.header('Access-Control-Allow-Origin', '*');
  //res.header('Access-Control-Allow-Headers','Content-Type,X-Requested-With');
  res.writeHead(200, { 'Content-Type': 'application/json'});
  res.end(JSON.stringify(rows));

  });
});

app.get('/tempD',function(req, res){ 
 var query="SELECT t.MIN_TEMP, t.MAX_TEMP FROM temperature t WHERE t.STATION_ID="+req.query.station+" AND t.DATE = ?;";
 //query = mysql.format(query,[req.query.city]);
 query = mysql.format(query,[req.query.date]);

 console.log(query);

 dbconnection.query( query, function(err, rows, fields){

  console.log('Connection result error '+err);
  console.log('no of records is '+rows.length);
  

  res.header('Access-Control-Allow-Origin', '*');
  //res.header('Access-Control-Allow-Headers','Content-Type,X-Requested-With');
  res.writeHead(200, { 'Content-Type': 'application/json'});
  res.end(JSON.stringify(rows));

  });
});

app.get('/precipitation',function(req, res){
 var query="SELECT p.*, t.PREC_NAME FROM precipitation p, precipitation_type t WHERE p.PREC_ID = t.PREC_ID AND p.STATION_ID = "+req.query.station+" AND DATE = ?;";
 //query = mysql.format(query,[req.query.station]);
 query = mysql.format(query,[req.query.date]);

 console.log(query);

 dbconnection.query( query, function(err, rows, fields){

  console.log('Connection result error '+err);
  console.log('no of records is '+rows.length);
  console.log(req.params.date);
  console.log(req.query.date);
  console.log(req.param('date'));
  res.header('Access-Control-Allow-Origin', '*');
  //res.header('Access-Control-Allow-Headers','Content-Type,X-Requested-With');
  res.writeHead(200, { 'Content-Type': 'application/json'});
  res.end(JSON.stringify(rows));

  });
});

app.get('/tempAverage',function(req, res){
 var query="SELECT * FROM city_average ca WHERE ca.city_id = "+req.query.city+" and ca.month = month(?);";
 //query = mysql.format(query,[req.query.city]);
 query = mysql.format(query,[req.query.date]);

 console.log(query);

 dbconnection.query( query, function(err, rows, fields){

  console.log('Connection result error '+err);
  console.log('no of records is '+rows.length);
  

  res.header('Access-Control-Allow-Origin', '*');
  //res.header('Access-Control-Allow-Headers','Content-Type,X-Requested-With');
  res.writeHead(200, { 'Content-Type': 'application/json'});
  res.end(JSON.stringify(rows));

  });
});




//app.get('/users', user.list);

//app.listen(3000);
//console.log('Express server listening on port ' + app.get('port'));

