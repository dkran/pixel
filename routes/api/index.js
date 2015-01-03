var app = require('express')();
var tracker = require('../../lib/pixel-track');
var BodyParser = require('body-parser');
var jsonParse = BodyParser.json();

app.use(function(req,res,next){
	// This middleware attempts to find the real request ip and log it at req.real_ip.  Does a pretty good job?

	req.real_ip = req.headers["x-forwarded-for"];
	  if(req.real_ip){
	    var list = req.real_ip.split(",");
	    console.log("list: " + list)
	    req.real_ip = list[list.length-1];
	    console.log("req.real_ip: " + req.real_ip)
	  } else {
	    req.real_ip = req.connection.remoteAddress;
	  }
	next();
})


app.get(/^\/r\/([\w._-]+.gif)$/i, tracker.requestHandler);
app.get('/users', tracker.getUsers)
app.get('/users/:id', tracker.getUsers)
app.get('/clear/:id', tracker.clearVisits)
app.get('/v/:id', tracker.listVisits)
app.get('/v/',tracker.listVisits)
app.post('/users/new', jsonParse, tracker.newUser)


tracker.on('visit',function(reqData){
	console.log(reqData);
});



module.exports = app;