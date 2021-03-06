
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes/routes.js');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: 'sick_secret_bruh'}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var aws = require("./keyvaluestore.js");

var users = new aws('GroupAlarm_users');
var groups = new aws('GroupAlarm_groups');
var groupIds = new aws('GroupAlarm_groupIds');
var userIds = new aws('GroupAlarm_userIds');

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

users.init(function () {
	groups.init(function() {
		groupIds.init(function() {
			userIds.init(function () {
				routes.init(users, groups, groupIds, userIds, function () {
					app.get('/', routes.index);
					app.post('/signup', routes.signup)
					app.get('/signup', routes.getsignup);
					app.get('/home' , routes.home);
					app.get('/logout', routes.logout);
					app.get('/createGroup/', routes.getCreateGroup);
					app.get('/createGroup/:groupName/:groupAlarm/:groupInterval', routes.createGroup);
					app.get('/suggest/:term', routes.getSuggestions);
					app.post('/search', routes.getSearch);
					app.post('/login', routes.login);
					app.post('/addToGroup', routes.addToGroup);
					
			
					http.createServer(app).listen(app.get('port'), function(){
					  console.log('Express server listening on port ' + app.get('port'));
						});
					});
				});	
			});
		});
	});
			