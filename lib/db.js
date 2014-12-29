//Little sqlite3 database module.

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(__dirname + '/pixels.db');

function sqliorm(){
	this.createUser = function(user, fn){
		console.log(user)
		db.run("INSERT INTO users (username,password,firstname,lastname,email) values ($username,$password,$firstname,$lastname,$email)", {
          $username: user.username,
          $password: user.password,
          $firstname: user.firstname || null,
          $lastname: user.lastname || null,
          $email: user.email || null
      },function(err){
      	if(err){
      		fn(err)
      	}else{
      		db.get("select * from users where username = ?", user.username, function(err, row){
      			if(!err){
      				fn(null,row)
      			}else{
      				fn(err)
      			}
      		})
      	}
      });
	}
	this.getUsers = function(userid, fn){
		console.log(arguments)
		if(typeof fn == 'undefined'){
			fn = arguments[0]
			db.all("select * from users", function(err,row){
				if(!err){
					fn(null, row)
				}else{fn(err)}
			})
		}else if((arguments.length == 2) && (typeof arguments[1] == 'function')){
			db.get("select * from users where id = ?", userid, function(err, row){
				if(!err){
					if(row === undefined){
						fn(new Error(404))
					}else{
						fn(null, row)
					}
				}else{
					fn(err)
				}
			})
		}
	}
	this.logVisit = function(pixel, fn){
		console.log(pixel)
		db.run("INSERT INTO pixels (pixel_id,source_ip,referer,user_agent,city,state,state_iso,country,country_iso) values ($id,$ip,$referer,$useragent,$city,$state,$stateiso,$country,$countryiso)", {
				$id: pixel.id,
				$ip: pixel.source-ip,
				$referer: pixel.referer,
				$useragent: pixel.user-agent,
				$city: pixel.city || null,
				$state: pixel.state || null,
				$stateiso: pixel.state_iso || null,
				$country: pixel.country || null,
				$countryiso: pixel.country_iso || null
			}, function(err){
				if(err){
					fn(err)
				}else{
					db.get()
				}

			})
	}
}


exports = module.exports = new sqliorm();