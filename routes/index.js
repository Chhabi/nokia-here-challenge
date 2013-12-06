
/*
 * GET home page.
 */

var Bitly = require('bitly');
var hat = require('hat');

var bitly = new Bitly('49bacf4f7e9480f886bbf17e66290ebfc879231b', '19f762a4aa6b0c97ac5360ff61b1f9f1f1c575d1');


var sharingStorage = {};

exports.index = function(req, res){
  res.render('index', {
  	title: 'Nokia Here Challenge'
  });
};

exports.uuid = function(req, res) {
	var id = hat();
	res.send(200, {
		uuid: id
	});
};

exports.route = function(req, res) {
	var route = sharingStorage[req.query.id];
	if (route) {
		res.send(200, route);
	} else {
		res.send(404, {});
	}
};

exports.share = function(req, res) {
	sharingStorage[req.body.id] = req.body.items;
	res.send(200, {});
};
