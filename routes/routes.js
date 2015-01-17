
/*
 * GET home page.
 */

var index = function(req, res){
  res.render('index', { title: 'Home' });
};

var signup = function(req, res) {
	res.send(true);
}

var getsignup = function(req, res) {
	res.render('signup' , {title : 'Signup'});
}

var routes = {
	index: index,
	signup: signup,
	getsignup: getsignup

}


module.exports = routes;