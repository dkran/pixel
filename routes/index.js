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
	var reqData = {};
	var ts = new Date();
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	var imgId = req.param('img');
	imgId = imgId.substr(0,(imgId.length-4));
	cities.getGeoData(ip, function(err,geodata){
		if(geodata){
			reqData = {
				'id': imgId,
				'time': ts.toUTCString(),
				'source-ip': ip,
				'referer': req.headers['referer'],
				'user-agent': req.headers['user-agent'],
				'city': (geodata.city.names.en || null),
				'state': (geodata.subdivisions[0].names.en || null),
				'state_iso': (geodata.subdivisions[0].iso_code || null),
				'country': (geodata.country.names.en || null),
				'country_iso': (geodata.country.iso_code || null)
			};
			console.log(reqData);
		}
		else{
			reqData = {
				'id': imgId,
				'time': ts.toUTCString(),
				'source-ip': ip,
				'referer': req.headers['referer'],
				'user-agent': req.headers['user-agent']
			};
			console.log(reqData);
		}
		});

	res.type('image/gif');
	res.end(pixel, 'binary');
});



module.exports = router;
