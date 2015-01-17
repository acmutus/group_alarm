/**
 * New node file
 */
function updateSuggestions() {
	var term = document.getElementById("searchInput").value;
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
	});
}
