"use strict";
exports.__esModule = true;
var express = require("express");
var path = require("path");
var port = process.env.PORT || 8080;
var app = express();
app.use(express.static(__dirname));
app.get('*', function (req, res, next) {
    res.sendFile(path.join(__dirname, "index.html"));
});
app.listen(port, function (err) {
    if (err) {
        return console.log(err);
    }
    return console.log("Server is running on port: " + port);
});
