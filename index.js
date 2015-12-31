var express = require('express');
var pg = require('pg');
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
var app = express();

mongoose.connect('mongodb://heroku_t227smxg:ublho6uviema236j7b5p7sqmhs@ds035643.mongolab.com:35643/heroku_t227smxg');


app.use(bodyParser());

app.set('port', (process.env.PORT || 5000));

app.post('/login', function (request, response) {

  var usn = request.body['usn'];
  var pwd = request.body['pwd'];

  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query("SELECT pwd FROM student WHERE usn='"+usn+"'", function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { 
       		if(result.rows[0].pwd == pwd)
       			response.send("1");
       		else
       			response.send("0");
       		//response.send(JSON.stringify(result)); 
       		//var jsonObj = JSON.parse(result);
       		//console.log(jsonObj.key);
       }
    });
  });
});

app.post('/stu_data', function (request, response) {

  var usn = request.body['usn'];

  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query("SELECT name,branch,semester,section,clg FROM student WHERE usn='"+usn+"'", function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.send(JSON.stringify(result)); }
    });
  });
});

app.post('/stu_subj', function (request, response) {

  var sem = request.body['semester'];
  var branch = request.body['branch'];
  var cycle = request.body['cycle'];


  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query("SELECT s_name FROM subject WHERE s_sem='"+sem+"' AND s_branch='"+branch+"' AND s_cycle='"+cycle+"'", function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.send(JSON.stringify(result)); }
    });
  });
});

app.post('/stu_elec', function (request, response) {

  var usn = request.body['usn'];

  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query("SELECT ele_subj FROM elective WHERE usn='"+usn+"'", function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.send(JSON.stringify(result)); }
    });
  });
});

app.post('/stu_class', function (request, response) {

  var clg = request.body['clg'];
  var branch = request.body['branch'];
  var sem = request.body['sem'];
  var sec = request.body['sec'];


  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query("SELECT c_id FROM class WHERE c_clg='"+clg+"' AND c_branch='"+branch+"' AND c_sem='"+sem+"' AND c_sec='"+sec+"'", function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.send(JSON.stringify(result)); }
    });
  });
});

app.post('/stu_classfac', function (request, response) {

  var class_id = request.body['class_id'];

  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query("SELECT cf_sub,cf_fac FROM classfac WHERE c_id='"+class_id+"'", function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.send(JSON.stringify(result)); }
    });
  });
});

app.post('/fac_name', function (request, response) {

  var f_id = request.body['f_id'];

  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query("SELECT f_name FROM faculty WHERE f_id='"+f_id+"'", function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.send(JSON.stringify(result)); }
    });
  });
});

app.post('/check_status', function (request, response) {

  var usn = request.body['usn'];

  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query("SELECT status FROM student WHERE usn='"+usn+"'", function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.send(result.rows[0].status); }
    });
  });
});

app.get('/mongoose', function (request, response) {
	
	var schema = mongoose.Schema({
		name: String
	});

	var x = mongoose.model('names',schema);

	var person = new x();
	person.name = "Suraj";
	person.save(function(err){
		if(err)
			console.log('Error Error!!');
		else
			console.log('Data saved!!');

	});

	response.send("Data saved!!");

});

app.get('/read_mongoose',function (request, response){

	var schema = mongoose.Schema({
		name: String
	});

	var x = mongoose.model('x',schema);

	x.find(function (err, names){
		if(err) return console.error(err);
		response.send(names);
	});

});

app.get('/test_data', function (request, response) {

  var usn = '1BY12CS077';

  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query("SELECT name,branch,semester,section,clg FROM student WHERE usn='"+usn+"'", function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.send(JSON.stringify(result)); }
    });
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});