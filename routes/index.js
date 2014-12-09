var app = require('express')();
var tracker = require('../lib/pixel-track');

/* GET home page. */
app.get('/', function(req, res) {
  res.render('index', { title: 'Pixel' });
});


app.get(/^\/p\/([\w._-]+.gif)$/i, tracker.requestHandler);

module.exports = app;
