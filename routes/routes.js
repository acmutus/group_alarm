

var spark = require('sparknode');
var crypto = require('crypto');

var users;
var groups;

exports.init = function(usrs, grps, callback) {
	users = usrs;
	groups = grps;
	callback();
}
/* Initialize the Spark Core with the access token and core id*/
var core = new spark.Core({
	accessToken: '1d4cceaa50b56cd19a8e8ee0424321139dfcd920',
	id: '53ff6b066667574847202567'
});

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Home' });
};

exports.home = function(req, res) {
	res.render('home' , {title: 'Home'});
}

/* Route for login handling*/
exports.login = function(req, res) {
	var username = req.body.username.toString().trim();
	var password = req.body.password.toString().trim();
	var shasum = crypto.createHash('sha1');
	shasum.update(password);
	
	users.exists(username, function(err, data) {
		if (!data) {
			res.send({
				"status" : false,
				"exists" : false
			});
		}
		else {
			users.getSet(username, function(err, value) {
				var check_password = JSON.parse(value).password;
				// Check if the given password matches the one in the database
				if (check_password == shasum.digest('hex')) {
					req.session.username = username;
					res.send({
						"status" : true,
						"exists" : true
					});	
				}
				// Password did not match. Send back appropriate flags
				else {
					res.send({
						"status" : false,
						"exists" : true
					});
				}
			});
		}
	});
}

/* Route for sign ups*/
exports.signup = function(req, res) {
	console.log(req.body.username);
	var username = req.body.username.toString().trim();
	var password = req.body.password.toString().trim();
	var email = req.body.email.toString().trim();
	
	var shasum = crypto.createHash('sha1');
	shasum.update(password);
	
	if (username.length == 0 || password.length == 0 || email.length == 0) {
		res.send({
			'status' : false,
			'exists' : false
		});
	}
	
	users.exists(username, function(err, data) {
		if(!data) {
			var value = {
				'username' : username,
				'password' : shasum.digest('hex'),
				'email': email	
			};
			users.addToSet(username, JSON.stringify(value), function(err, success) {
				if (success) {
					console.log("Got here");
					res.send({
						'status' : true,
						'exists' : false 
					});
				}
				else {
					console.log("Erorr in add to set : " + err);
				}
			});
		}
		else {
			res.send({
				'status' : true,
				'exists' : true
			});
		}
	});
}

/* Route for getting the sign up page*/
exports.getsignup = function(req, res) {
	res.render('signup' , {title : 'Signup'});
}

/* Route to connect to the core*/
exports.connect = function(req, res) {
	core.on('Acceleration' , function(data) {
		console.log("Data received");
		console.log(data);
	});
}