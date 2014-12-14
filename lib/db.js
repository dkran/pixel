//Little sqlite3 database module.

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(__dirname + '/pixels.db');

function sqliorm(){
	this.createUser = function(user){


	}
	this.listUsers = function(userid, cb){
		console.log(arguments)
		if(typeof cb == 'undefined'){
			cb = arguments[0];
			db.each("select * from users", function(err,row){
				if(!err){
					cb(row)
				}
			})
		}else if((arguments.length == 2) && (typeof arguments[1] == 'function')){
			db.each("select * from users where id = ?", userid, function(err, row){
				if(!err){
					cb(row);
				}
			})
		}

	}



}


exports = module.exports = new sqliorm();