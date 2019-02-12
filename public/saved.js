$(document).ready(function() {
	
    $(".navbar-burger").on("click", function() {
		$(".navbar-burger").toggleClass("is-active");
		$(".dropdown").toggle();
		$(".dropdown").toggleClass("is-open");
	});

	// display saved articles
	$.getJSON("/articles", function(data) {
	  for (var i = 0; i < data.length; i++) {
	  	if (data[i].saved === true) {
	   		$("#saved-results").append("<div class='saved-div'><p class='saved-text'>" + data[i].title + "<br>" + data[i].description +
  																	"</p><a class='unsave-button button is-danger is-medium' data-id='" +
																		data[i]._id + "'>Remove</a><a class='comments-button button is-info is-medium' data-id='" + data[i]._id +
																		"'><span class='icon'><i class='fa fa-comments'></i></span>Comments</a></div>");
	  	}
	  }
	});

	// comment button
	$(document).on("click", ".comments-button", function() {
		$(".modal").toggleClass("is-active");
		var articleID = $(this).attr("data-id");
	  $.ajax({
	    method: "GET",
	    url: "/articles/" + articleID
	  }).done(function(data) {
	  	$("#comments-header").html("Article Comments (ID: " + data._id + ")");
	  	// no comments
	  	if (data.comments.length !== 0) {
	  		// clear out comments
	  		$("#comments-list").empty();
	  		for (i = 0; i < data.comments.length; i++) {
					$("#comments-list").append("<div class='comment-div'><p class='comment'>" + data.comments[i].body + "</p></div>");
	  		}
	  	}
	  	// append save comment button
	  	$("footer.modal-card-foot").html("<button id='save-comment' class='button is-success' data-id='" + data._id + "'>Save Comment</button>")
	  });
	});

	// removes comments
	$(document).on("click", ".delete", function() {
		$(".modal").toggleClass("is-active");
		$("#comments-list").html("<p>Write the first comment for this article.</p>");
	});

	// saving comments
	$(document).on("click", "#save-comment", function() {
	  var articleID = $(this).attr("data-id");
	  $.ajax({
	    method: "POST",
	    url: "/comment/" + articleID,
	    data: {
	      body: $("#new-comment-field").val()
	    }
	  }).done(function(data) {
      console.log("data: ", data);
		});

	  // removes comment values
	  $("#new-comment-field").val("");
	  $(".modal").toggleClass("is-active");
	});

	// delete comments
	$(document).on("click", ".delete-comment", function() {
	});

	// remove saved articles
	$(document).on("click", ".unsave-button", function() {
		var articleID = $(this).attr("data-id");
		console.log(articleID);
	  $.ajax({
	    method: "POST",
	    url: "/unsave/" + articleID,
	    data: {
				saved: false
	    }
		});
		location.reload();
	});

});