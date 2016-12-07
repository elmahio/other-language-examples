var elmah = require("elmah.io");
var express = require("express");

var app = express();
app.use(elmah.auto({logId:"LOG_ID", application:"My App Name", version: "42.0.0"}));