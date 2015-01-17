$(function() {
	$("#signup").click(function(e) {
		e.preventDefault();
		//var username = $("#username").val();
		//var password = $("#password").val();
		//var email = $("#email").val();

		$.ajax({ 
    		url: '/signup',
    		type: 'GET', 
    		/*data: { 
    			"username": username,
    			"password": password,
    			"email": email
    		},*/ 
    		/*success: function(data){
    			$("#groups").append("<p>My groups</p>");
    		}, 
    		error: function(xhr, textStatus, err) {
    			alert(err);
    		}*/
    	});
	});
});