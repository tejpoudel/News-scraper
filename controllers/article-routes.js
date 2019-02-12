var express = require("express");
var request = require("request");
var cheerio = require("cheerio");
var Comment = require("../models/comment.js");
var Article = require("../models/article.js");
var router = express.Router();

// scrape NPR data to database
router.get("/scrape", function(req, res) {
  request("http://www.npr.org/sections/news/archive", function(error, response, html) {
    var $ = cheerio.load(html);
    $("div.archivelist > article").each(function(i, element) {

      var result = {};

      // saves title and description to result
      result.title = $(element).children("div.item-info").children("h2.title").html();
			result.description = $(element).children("div.item-info").children("p.teaser").children("a").text();
      
      // create new entry
      var entry = new Article(result);

      // save entry to database
      entry.save(function(err, doc) {
        if (err) {
          console.log(err);
        }
        else {
          console.log(doc);
        }
      });

    });
    // reloads page
    res.redirect("/");
  });  
});


// retrieves scraped articles from database
router.get("/articles", function(req, res) {
  Article.find({})
  .exec(function(err, doc) {
    if (err) {
      console.log(error);
    }
    else {
      res.json(doc);
    }
  });
});

// save article
router.post("/save/:id", function(req, res) {
  // update saved property to true
  Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true })
  .exec(function(err, doc) {
    if (err) {
      console.log(err);
    }
    else {
      console.log("doc: ", doc);
    }
  });
});


// grab article by id
router.get("/articles/:id", function(req, res) {
  // prepare query
  Article.findOne({ "_id": req.params.id })
  .populate("comments")
  .exec(function(error, doc) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(doc);
    }
  });
});

// new comment
router.post("/comment/:id", function(req, res) {
  var newComment = new Comment(req.body);
  // save to database
  newComment.save(function(error, newComment) {
    if (error) {
      console.log(error);
    }
    else {
      // update comments
      Article.findOneAndUpdate({ "_id": req.params.id }, { $push: { "comments": newComment._id }}, { new: true })
      .exec(function(err, doc) {
        if (err) {
          console.log(err);
        }
        else {
          console.log("doc: ", doc);
          res.send(doc);
        }
      });
    }
  });
});

// remove article
router.post("/unsave/:id", function(req, res) {
  // update saved property to false
  Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": false })
  .exec(function(err, doc) {
    if (err) {
      console.log(err);
    }
    else {
      console.log("Article Removed");
    }
  });
  res.redirect("/saved");
});


module.exports = router;