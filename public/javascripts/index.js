$(function() {
	$("#signup").click(function(e) {
		e.preventDefault();
		var username = $("#username").val();
		var password = $("#password").val();

		$.ajax({ 
    		url: '/signup',
    		type: 'POST', 
    		data: { 
    			"username": username,
    			"password": password
    		}, 
    		success: function(data){
    			$("#groups").append("<p>My groups</p>");
    		}, 
    		error: function(xhr, textStatus, err) {
    			alert(err);
    		}
    	});
	});
});