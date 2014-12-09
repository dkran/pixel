var app = require('express')();
var tracker = require('../../lib/pixel-track');
//var BodyParser = require('body-parser');

app.get(/^\/r\/([\w._-]+.gif)$/i, tracker.requestHandler);

app.post('/new', function(req, res){
	//req.body.userid = the user id.  etc.

	res.status(201).json({
		'id': 123,
		'location': '/r/123.gif'
	}).end;
});

tracker.on('visit',function(reqData){
	console.log(reqData);
});



module.exports = app;