var app = require('express')();
var tracker = require('../../lib/pixel-track');
var BodyParser = require('body-parser');
var jsonParse = BodyParser.json();

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