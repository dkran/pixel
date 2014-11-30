var express = require('express');
var router = express.Router();
var fs = require('fs');
var pixel = fs.readFileSync(__dirname + '/../data/pixel.gif');
var mmdbreader = require('maxmind-db-reader');
var cities = mmdbreader.openSync(__dirname + '/../data/GeoLite2-City.mmdb');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/r/:img', function(req, res) {
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	var imgId = req.param('img');
	imgId = imgId.substr(0,(imgId.length-4));
	console.log(req.headers);
	console.log(cities.getGeoDataSync(ip));
	res.type('image/gif');
	res.end(pixel, 'binary');
});



module.exports = router;
