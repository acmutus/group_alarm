

//var spark = require('sparknode');
var crypto = require('crypto');

var users;
var groups;
var groupIds;
var userIds;

var groupId = 1;
var userId = 1;

exports.init = function(usrs, grps, grpIds, usrIds, callback) {
	users = usrs;
	groups = grps;
	groupIds = grpIds;
	userIds = usrIds;
	callback();
}

exports.index = function(req, res){
  res.render('index', { title: 'Home' });
};

exports.home = function(req, res) {
	if(req.session.username == null) {
		res.redirect("/");
	}
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
			userIds.scanKeys(function(err, data2) {
				if (data2.length != 0) {
					userId = Math.max.apply(null, data2);
					userId++;
				}
				var value = {
					'username' : username,
					'password' : shasum.digest('hex'),
					'email': email,
					'userId' : userId
				};
				users.addToSet(username, JSON.stringify(value), function(err, success) {
					if (success) {
						var value2 = {
							"username" : username	
						};
						userIds.addToSet(userId.toString().trim(), JSON.stringify(value2), function(err, success2) {
							res.send({
								'status' : true,
								'exists' : false 
							});
						});
					}	
				else {
					console.log("Erorr in add to set : " + err);
				}
			});
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

exports.getCreateGroup = function(req, res) {
	res.render('createGroup' , {title: "Group Creation"});
}

exports.createGroup = function(req, res) {
	var groupName = req.params.groupName.toLowerCase().trim();
	var groupAlarm = req.params.groupAlarm.toLowerCase().trim();
	var groupInterval = req.params.groupInterval.toLowerCase().trim();
	console.log(groupName);
	console.log(groupAlarm);

	groupIds.scanKeys(function(err, data) {
		if(data.length != 0) {
			groupId = Math.max.apply(null, data);
			groupId++;

		}
		console.log("group id:  " +  groupId);
		var value = {
			"group_name" : groupName,
			"owner" : req.session.username,
			"alarm_time" : groupAlarm,
			"alarm_interval" : groupInterval,
			"members" : ""
		}
		groups.addToSet(groupName, JSON.stringify(value), function(err, data2) {
			if (data2) {

				var value2 = {
					"group_name": groupName
				}
				groupIds.addToSet(groupId.toString().trim(), JSON.stringify(value2), function(err, data3) {
					if(data3) {
						req.session.current_groupId = groupId.toString().trim();
						res.send(true);
					}
				});
			}
		});
		
	});
}

exports.getSuggestions = function(req, res) {
	var term = req.params.term.toLowerCase().trim();
	users.scanKeys(function(err, userSet) {	
		if (userSet) {
			var count = 0;
			var i;
			var result = []
			for (i = 0; i < userSet.length; i++) {
				users.getSet(userSet[i].toString(), function(err, value) {
					if (value) {
						count++;
						var parsedValue = JSON.parse(value);
						var username = parsedValue.username.toString();
						if (username.toLowerCase().substring(0, term.length) ==  term) {
							console.log(username);
							result.push(username);
						}
					}
					if (count == userSet.length) {
						res.send({
							'suggestions': result
						});
					}
				});
			}
			
		}
		
	});
}

exports.getSearch = function(req, res) {
	var term = req.body.query.toString().toLowerCase();
	users.scanKeys(function(err, userSet) {	
		if (userSet) {
			var count = 0;
			var i;
			var result = [];
			for (i = 0; i < userSet.length; i++) {
				users.getSet(userSet[i].toString(), function(err, value) {
					if (value) {
						count++;
						var parsedValue = JSON.parse(value);
						var username = parsedValue.username;
						var userId = parsedValue.userId;
						if (username.toLowerCase().substring(0, term.length) == term) {
							var arrValue =  {
									"username" : username,
									"userId" : userId
							}
							result.push(arrValue);
						}
					}
					if (count == userSet.length) {
						console.log("Search result: " + result.toString());
						return res.send(result);						
					}
				});
			}
			
		}		
	});
}

exports.addToGroup = function(req, res) {
	var username = req.body.username;
	var groupId = req.session.current_groupId.toString().trim();

	groupIds.getSet(groupId, function(err, data) {
		if(data) {
			var parsedValue = JSON.parse(data);
			var group_name = parsedValue.group_name.toString().trim();
			groups.getSet(group_name, function(err, data2) {
				if(data2) {
					var oldValue = JSON.parse(data2);
					groups.delSet(group_name, function(err, data3) {
						if (data3) {
							if (oldValue.members.length == 0) {
								oldValue.members = [username];
							}
							else {
								oldValue.members.push(username);
							}
							groups.addToSet(group_name, JSON.stringify(oldValue), function(err, data4) {
								if(data4) {
									res.send(true);
								}
							});
						}
					});
				}
			});
		}
	});


}

/* Route to connect to the core*/
// exports.connect = function(req, res) {
// 	core.on('Acceleration' , function(data) {
// 		console.log("Data received");
// 		console.log(data);
// 	});
// }

exports.logout = function(req, res) {
	req.session.username = null;
	res.redirect('/');
}