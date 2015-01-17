$(function() {
	$("#group_creation").click(function(e) {
		e.preventDefault();
        var groupName = $("#group_name").val();
        var groupAlarm = $("#group_alarm").val();
        var groupInterval = $("#group_interval").val();
		$.ajax({ 
    		url: '/createGroup/'+groupName+'/'+groupAlarm+'/'+groupInterval,
    		type: 'GET', 
    		success: function(data){	
    			window.location = '/createGroup/';
    		}, 
    		error: function(xhr, textStatus, err) {
    			alert(err);
    		}
    	});
	});
});
