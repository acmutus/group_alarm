

var spark = require('sparknode');

var core = new spark.Core({
	accessToken: '1d4cceaa50b56cd19a8e8ee0424321139dfcd920',
	id: '53ff6b066667574847202567'
});

/*
 * GET home page.
 */

var index = function(req, res){
  res.render('index', { title: 'Home' });
};

var signup = function(req, res) {
	console.log(req.body.username);
	
	res.send(true);
}

var getsignup = function(req, res) {
	res.render('signup' , {title : 'Signup'});
}

var connect = function(req, res) {
	core.on('Acceleration' , function(data) {
		console.log("Data received");
		console.log(data);
	});
}

var routes = {
	index: index,
	signup: signup,
	getsignup: getsignup,
	connect: connect

}


module.exports = routes;