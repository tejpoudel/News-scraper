$(document).ready(function() {
	
	$(".navbar-burger").on("click", function() {
		$(".navbar-burger").toggleClass("is-active");
		$(".dropdown").toggle();
		$(".dropdown").toggleClass("is-open");
	});

	// append json to page
	$.getJSON("/articles", function(data) {
	  for (var i = 0; i < data.length; i++) {
	    $("#scrape-results").prepend("<div class='result-div'><p class='result-text'>" +data[i].title + "<br>" + data[i].description +
	    	"</p><button class='save-article button is-info is-medium' data-id='" + data[i]._id + "'><span class='icon'><i class='fa fa-bookmark'></i></span>Save Article</button></div>");
	  }
	});

	// save
	$(document).on("click", ".save-article", function() {
        // icon
		$(this).children("span.icon").children("i.fa-bookmark").removeClass("fa-bookmark").addClass("fa-check-circle");
		var articleID = $(this).attr("data-id");
		console.log(articleID);
	  $.ajax({
	    method: "POST",
	    url: "/save/" + articleID,
	    data: {
	      saved: true
	    }
	  }).done(function(data) {
      console.log("data: ", data);
		});
	});


});