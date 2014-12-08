var fs = require('fs'),
	  mmdbreader = require('maxmind-db-reader'),
		EventEmitter = require('events').EventEmitter,
		util = require('util')
		cities = mmdbreader.openSync(__dirname + '/GeoLite2-City.mmdb'),
		pixel = fs.readFileSync(__dirname + '/pixel.gif');


function PixelTracker(){
	EventEmitter.call(this);
	var self = this; // Keeping a reference to the tracker.


	this.requestHandler = function(req, res, next){
		var reqData = {},
				ts = new Date();
		if(req){
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

					self.emit('visit', reqData);
				}
				else{
					reqData = {
						'id': imgId,
						'time': ts.toUTCString(),
						'source-ip': ip,
						'referer': req.headers['referer'],
						'user-agent': req.headers['user-agent']
					};
					self.emit('visit', reqData);
				}
				});
			res.type('image/gif');
			res.end(pixel, 'binary');
		}

	}
}
util.inherits(PixelTracker, EventEmitter);

exports = module.exports = new PixelTracker();
