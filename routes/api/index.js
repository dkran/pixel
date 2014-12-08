var express = require('express');
var router = express.Router();
var tracker = require('../../lib/pixel-track');
//var BodyParser = require('body-parser');

router.get('/r/:img', tracker.requestHandler);

router.post('/new', function(req, res){
	//req.body.userid = the user id.  etc.

	res.json({
		'id': 123,
		'location': '/r/123.gif'
	});
});

tracker.on('visit',function(reqData){
	console.log(reqData);
});



module.exports = router;