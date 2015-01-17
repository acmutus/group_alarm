$(function() {
	$("#group_creation").click(function(e) {
		e.preventDefault();
		$.ajax({ 
    		url: '/createGroup',
    		type: 'GET', 
    		success: function(data){	
    			window.location = '/createGroup'
    		}, 
    		error: function(xhr, textStatus, err) {
    			alert(err);
    		}
    	});
	});
});
