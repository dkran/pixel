var express = require('express');
var tracker = require('../lib/pixel-track')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'index' });
});

router.get(/^\/(([0-9a-zA-Z\._-])+.(gif|GIF))$/, tracker.requestHandler);

module.exports = router;
