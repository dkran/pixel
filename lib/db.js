//Little sqlite3 database module.

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(__dirname + '/pixels.db');

function sqliorm(){
	this.createUser = function(user){

	}
	this.listUsers = function(cb){
		db.each("select * from users", function(err,row){
			if(!err){
				cb(row)
			}
		})

	}



}


exports = module.exports = new sqliorm();