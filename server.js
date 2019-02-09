var express = require('express');
var app = express();

app.get("/", function(req, res) {
    res.send("Working Fine");
});

var PORT = process.env.port || 5050;

app.listen(PORT, function() {
    console.log("App is running on https://localhost:" + PORT);
})