
/*
 * GET home page.
 */

var index = function(req, res){
  res.render('index', { title: 'Express' });
};

var signup = function(req, res) {
	res.send(true);
}

var routes = {
	index: index,
	signup: signup

}

module.exports = routes;