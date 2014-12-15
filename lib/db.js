//Little sqlite3 database module.

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(__dirname + '/pixels.db');

function sqliorm(){
	this.createUser = function(user, fn){
		console.log(user)

	}
	this.getUsers = function(userid, fn){
		console.log(arguments)
		if(typeof fn == 'undefined'){
			fn = arguments[0]
			db.get("select * from users", function(err,row){
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



}


exports = module.exports = new sqliorm();