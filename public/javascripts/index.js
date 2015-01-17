$(function() {
	$("#login").click(function(e) {
		e.preventDefault();
		var username = $("#username").val();
		var password = $("#password").val();

		$.ajax({ 
    		url: '/login',
    		type: 'POST', 
    		data: { 
    			"username": username,
    			"password": password,
    		},
    		success: function(data){
    			if (!data.status) {
    				if (data.exists) {
    					$("#groups").append("<p>Password is invalid</p>");
    				}
    				else {
    					$("#groups").append("<p>Username is not valid</p>");
    				}
    			}
    			else {
    				window.location = '/home';
    			}
    		}, 
    		error: function(xhr, textStatus, err) {
    			alert(err);
    		}
    	});
	});
});