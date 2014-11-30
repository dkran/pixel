var express = require('express');
var router = express.Router();
var fs = require('fs');
var pixel = fs.readFileSync(__dirname + '/../pixel.gif');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/r/:img', function(req, res) {
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	var imgId = req.param('img');
	imgId = imgId.substr(0,(imgId.length-4));
	console.log(req.headers);
	console.log(req.connection);
	console.log(ip);
	res.type('image/gif');
	res.end(pixel, 'binary');
});



module.exports = router;
