var fs = require('fs'),
	  mmdbreader = require('maxmind-db-reader'),
		EventEmitter = require('events').EventEmitter,
		util = require('util')
		cities = mmdbreader.openSync(__dirname + '/GeoLite2-City.mmdb'),
		pixel = fs.readFileSync(__dirname + '/pixel.gif');

// Singleton style, Suckas!

function PixelTracker(){
	EventEmitter.call(this);
	var self = this; // Keeping a reference to the tracker.

	this.requestHandler = function(req, res, next){
		var reqData = {},
				ts = new Date();
		if(req.params[0]){
			var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
			var imgId = req.params[0];
			imgId = imgId.substr(0,(imgId.length-4));
			cities.getGeoData(ip, function(err,geodata){
				
				reqData = {
						'id': imgId,
						'time': ts.toUTCString(),
						'source-ip': ip,
						'referer': req.headers['referer'],
						'user-agent': req.headers['user-agent']
					};
				
				if (geodata) {
					reqData.city = geodata.city.names.en || null;
					reqData.state = geodata.subdivisions[0].names.en || null;
					reqData.state_iso = geodata.subdivisions[0].iso_code || null;
					reqData.country = geodata.country.names.en || null;
					reqData.country_iso = geodata.country.iso_code || null;
				}
				res.type('image/gif');
				res.end(pixel, 'binary');
				self.emit('visit', reqData);
			});
		}else{
			console.log(">>>ERROR>>> Pixel Handler received no parameters.")
			next();
		}	
	}
}
util.inherits(PixelTracker, EventEmitter);

exports = module.exports = new PixelTracker();
