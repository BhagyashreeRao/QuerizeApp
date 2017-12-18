var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var path=require('path');

var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

/*
var userDb=require('./app/models/User.js');
var queryDb=require('./app/models/Query.js');

var user=require('./app/controllers/user.js');
//var tag=require('.app/controllers/queries.js');
*/

//var jwtSecret = 'kjwdjs65$ikksop0982shj';

app.use(bodyParser.json({limit:'10mb',extended:true}));
app.use(bodyParser.urlencoded({limit:'10mb',extended:true}));
app.use(cookieParser());

app.use(express.static('public'));

var session = require('express-session');
var logger = require('morgan');
app.use(logger('dev'));

/*app.use(expressJwt({ secret: jwtSecret }).unless({ path: ['/','/signup','/login']}));*/

var dbPath  = "mongodb://localhost/querize_database";

// command to connect with database
db = mongoose.connect(dbPath);

mongoose.connection.once('open', function() {

	console.log("database connection open success");
});



var fs = require('fs');

// include all our model files
fs.readdirSync('./app/models').forEach(function(file){
	// check if the file is js or not
	if(file.indexOf('.js'))
		console.log("included models");
		// if it is js then include the file from that folder into our express app using require
		require('./app/models/'+file);

});// end for each

// include controllers
fs.readdirSync('./app/controllers').forEach(function(file){
	if(file.indexOf('.js')){
		// include a file as a route variable
		console.log("included controllers");
		var route = require('./app/controllers/'+file);
		console.log("included routes");
		//call controller function of each file and pass your app instance to it
		route.controllerFunction(app);
	}
});//end for each

/*
app.post('/user/signup',user.signup);
app.post('/user/login',user.login,function(req,res){
    var token = jwt.sign({username: req.body.username}, jwtSecret);
    res.status(200).send({token: token,username: req.body.username});
});
*/

app.get('/',function(req,res){
   res.sendFile('index.html',{ root: __dirname });
});

app.listen(3000, function () {
  console.log('Querize app listening on port 3000!');
});