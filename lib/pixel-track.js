var fs = require('fs'),
	  mmdbreader = require('maxmind-db-reader'),
		EventEmitter = require('events').EventEmitter,
		util = require('util'),
		db = require('./db'),
		cities = mmdbreader.openSync(__dirname + '/GeoLite2-City.mmdb'),
		pixel = fs.readFileSync(__dirname + '/pixel.gif');

// Singleton style, Suckas!

function PixelTracker(){
	EventEmitter.call(this);
	var self = this; // Keeping a reference to the tracker.

	this.newUser = function(req, res, next){
		var username = req.body.username;
		console.log(req.body)
		db.createUser(req.body, function(err, user){
			if(!err)
				res.status(201).json(user)
			else
				res.status(400).json(err)
		})
		
	}

	this.getUsers = function(req,res,next){
		if(req.params.id){
			db.getUsers(req.params.id, function(err, data){
				if(!err){
					res.status(200).json(data)
				}else{
					res.status(404).json("User not found")
				}
			})
		}else{
			db.getUsers(function(err, data){
				if(!err){
					res.status(200).json(data)
				}else{
					res.status(404).json("User not found")
				}
			})
		}
	}

	this.requestHandler = function(req, res, next){
		var reqData = {},
				ts = new Date();
		if(req.params[0]){
			var imgId = req.params[0];
			imgId = imgId.substr(0,(imgId.length-4));
			cities.getGeoData(req.real_ip, function(err,geodata){
				reqData = {
					'id': imgId,
					'time': ts.toUTCString(),
					'source_ip': req.real_ip,
					'referer': req.headers['referer'],
					'user_agent': req.headers['user-agent']
				};
				
				if (geodata) {
					reqData.city = geodata.city.names.en || null;
					if(geodata.subdivisions){
						reqData.state = geodata.subdivisions[0].names.en || null;
						reqData.state_iso = geodata.subdivisions[0].iso_code || null;
					}
					reqData.country = geodata.country.names.en || null;
					reqData.country_iso = geodata.country.iso_code || null;
				}
				res.type('image/gif');
				res.end(pixel, 'binary');
				self.emit('visit', reqData);
				db.logVisit(reqData, function(err){
					if(err){
						console.log("Database request logging error: " + err)
					}
				})

			});
		}else{
			console.log(">>>ERROR>>> Pixel Handler received no parameters.")
			next();
		}	
	}

	this.clearVisits = function(req, res, next){
		if(req.params.id){
			db.clearVisits(req.params.id,function(err){
				if(!err){
					res.status(200).json("id "+ req.params.id + " cleared")
				}
			})
		}
	}
	this.listVisits = function(req, res, next){
	if(req.params.id){
		db.listVisits(req.params.id, function(err, rows){
			if(!err){
				res.status(200).json(rows)
			}else{
				res.status(404).json(err)
			}
		})
	}else{
		db.listAllVisits(function(err, rows){
			if(!err){
				res.status(200).json(rows)
			}else{
				res.status(404).json(err)
			}
		})
	}
}
}


util.inherits(PixelTracker, EventEmitter);

exports = module.exports = new PixelTracker();
