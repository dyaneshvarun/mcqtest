var express = require('express');
var router = express.Router();
var fs= require('fs');
var path=require('path');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/register', function(req, res, next) {
	var mysql = require('mysql');
	var con = mysql.createConnection({
	  host: "localhost",
	  user: "phpmyadmin",
	  password: "some_pass",
	  database: "mcqtest"
	});

	con.connect(function(err) {
	  if (err) res.send("Error in Connection");
	  console.log("Connected!");
	  var sql = "INSERT INTO participant (name,regno,email,pwd) VALUES ?";
	 var values = [[req.body.name,req.body.regno,req.body.email,req.body.pwd]
  	];	 
	 con.query(sql,[values], function (err, result) {
	    if (err) return res.redirect('/');
	    console.log("1 record inserted");
	    return res.redirect('/participant');
	  });
	});
});
router.post('/adminregister', function(req, res, next) {
	var mysql = require('mysql');
	var con = mysql.createConnection({
	  host: "localhost",
	  user: "phpmyadmin",
	  password: "some_pass",
	  database: "mcqtest"
	});

	con.connect(function(err) {
	  if (err) res.send("Error in Connection");
	  console.log("Connected!");
	 if(req.body.email=='' || req.body.pwd=='')return res.redirect('/admin/wrong.html');
	  var sql = "INSERT INTO admin (adminname,adminmail,adminpwd) VALUES ?";
	 var values = [[req.body.name,req.body.email,req.body.pwd]
  	];	 
	 con.query(sql,[values], function (err, result) {
	    if (err) return res.redirect('/admin/');
	    console.log("1 record inserted");
	    return res.redirect('/admin/logged');
	  });
	});
});

//Login
router.post('/login', function(req, res, next) {
	var mysql = require('mysql');
	var con = mysql.createConnection({
	  host: "localhost",
	  user: "phpmyadmin",
	  password: "some_pass",
	  database: "mcqtest"
	});

	con.connect(function(err) {
	  if (err) res.send("Error in Connection");
	  console.log("Connected!");
	  if(req.body.email=='' || req.body.pwd=='')return res.redirect('wrong.html');
	  var sql = "SELECT pwd FROM participant WHERE email="+mysql.escape(req.body.email);
	  con.query(sql, function (err, result) {
	  if (err || result==null) res.render('index',{ title: 'Express' });
	  if(result[0].pwd==req.body.pwd) 
		return res.redirect('/participant');
	  else{
		console.log("Wrong Password Entry");
		return res.redirect('wrong.html');
	  }
	  });

	});
});
router.post('/adminlogin', function(req, res, next) {
	var mysql = require('mysql');
	var con = mysql.createConnection({
	  host: "localhost",
	  user: "phpmyadmin",
	  password: "some_pass",
	  database: "mcqtest"
	});

	con.connect(function(err) {
	  if (err) res.send("Error in Connection");
	  console.log("Connected!");
	  if(req.body.email=='' || req.body.pwd=='')return res.redirect('/admin/wrong.html');
	  var sql = "SELECT adminpwd FROM admin WHERE adminmail="+mysql.escape(req.body.email);
	  con.query(sql, function (err, result) {
	  if (err || result==null) res.render('index',{ title: 'Express' });
	  if(result[0].adminpwd==req.body.pwd) 
		return res.redirect('/admin/logged');
	  else{
		console.log("Wrong Password Entry");
		return res.redirect('/admin/wrong.html');
	  }
	  });

	});
});

router.post('/newexam', function(req, res, next) {	
	var mysql = require('mysql');
	var con = mysql.createConnection({
	  host: "localhost",
	  user: "phpmyadmin",
	  password: "some_pass",
	  database: "mcqtest"
	});

	con.connect(function(err) {
		if (err) res.send("Error in Connection");
		console.log("Connected!");
		var sql = "INSERT INTO exams (examname,examkey,createdby,status,questions) VALUES ?";
		var values = [[req.body.name,req.body.key,1,'NOT_STARTED',req.body.questions]];	 
		con.query(sql,[values], function (err, result) {
			console.log(__dirname);
			fs.writeFile(path.join(__dirname, '../public','exams/')+result.insertId+'EX.json',JSON.stringify(req.body.examObj),function(err){  
				if (err) throw err;
				console.log('Data written to file');
			});
			if (err) return res.redirect('/admin/');
			console.log("1 record inserted");
			return res.redirect('/admin/logged');
		});
		//res.send("Exam Received and written");
	});
});
router.post('/exam', function(req, res, next) {	
	var mysql = require('mysql');
	var con = mysql.createConnection({
		host: "localhost",
		user: "phpmyadmin",
		password: "some_pass",
		database: "mcqtest"
	});
	con.connect(function(err) {
		if (err) res.send("Error in Connection");
		console.log("Connected!");
		var sql = "SELECT examkey from exams where examid="+mysql.escape(req.body.examid);
		con.query(sql, function (err, result) {
			if (err || result==undefined) return res.render('index',{ title: err });
			if(result != undefined && result[0].examkey==req.body.key) 
				return res.redirect('/participant/examstart.html?exam='+req.body.examid);
			else{
				console.log("Wrong Key Entry");
				return res.redirect('/participant/wrongexamkey.html');
			}
		});		
	});
});
router.post('/sendmark', function(req, res, next) {	
	var mysql = require('mysql');
	var con = mysql.createConnection({
		host: "localhost",
		user: "phpmyadmin",
		password: "some_pass",
		database: "mcqtest"
	});
	con.connect(function(err) {
		if (err) res.send("Error in Connection");
		console.log("Connected!");
		var sql = "INSERT into eval (regno,examid,marks,examdate) VALUES ?";
		var values = [['2014115078',req.body.examid,req.body.marks,new Date()]];	
		console.log(values);	
		con.query(sql,[values], function (err, result) {
			if (err) return res.redirect('/wrongage');
		    	console.log("1 record inserted");
		    	res.send('Done');
		});		
	});
});
router.post('/getexams',function(req,res,next){
	console.log("HI");	
	var mysql = require('mysql');
	var con = mysql.createConnection({
		host: "localhost",
		user: "phpmyadmin",
		password: "some_pass",
		database: "mcqtest"
	});
	con.connect(function(err) {
		if (err) res.send("Error in Connection");
		console.log("Connected!");
		var sql = "SELECT * FROM eval WHERE regno='2014115078'";
		con.query(sql, function (err, result) {
		if (err || result==null) return res.render('index',{ title: 'Express' });
		else{
			console.log(result);
			res.setHeader('Content-Type', 'application/json');
			return res.send(result);
			}
		});
		
	});
	//return res.send('Hi');
});
module.exports = router;
