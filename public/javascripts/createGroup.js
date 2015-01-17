
$(function() {
	$("#searchButton").click(function(e) {
		e.preventDefault();
		var query = $("#searchInput").val();
		$.ajax({ 
    		url: '/search',
    		type: 'POST',
    		data: {
    			'query' : query
    		},
    		success: function(data){
    			var i;
    			for (i = 0; i < data.length; i++) {
    				$("#results").append("<p>" + data[i] +"</p>");
      				$("#results").append("<button class = 'addButton' id='" + data[i] + "'>Add</button>"); 				
    			}
    			$(".addButton").click(function(e) {
    				e.preventDefault();
    				var username = this.id;
    				$.ajax({ 
    		    		url: '/addToGroup',
    		    		type: 'POST',
    		    		data: {
    		    			'username' : username
    		    		},
    		    		success: function(data){
    		    			alert("Added");
    		    		},
    		    		error: function(xhr, textStatus, err) {
    		    			alert(err);
    		    		}	
    				});
    			});
    		}, 
    		error: function(xhr, textStatus, err) {
    			alert(err);
    		}
    	});
	});	
});


function updateSuggestions() {
	/*var term = document.getElementById("searchInput").value;
	$(".dropdown-menu").show();
	$.get("/suggest/"+escape(term), function(data) {
		var elements = data.suggestions;
		var i;
		var entry ="";
		for (i = 0; i < elements.length; i++) {
			entry += "<li role='presentation'>"+
			"<div class ='row'>"+
			elements[i]+ "</div></li>";
			
		}
		$(".dropdown-menu").html(entry);
	});*/
}


