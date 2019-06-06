var express = require('express');
var app = express();

var request = require("request");

var site = "https://api.elmah.io/v3/messages/LOG_ID"

// function parseCookies (request) {
// 	var list = [],
// 		rc = request.headers.cookie;

// 	rc && rc.split(';').forEach(function( cookie,index ) {
// 		var parts = cookie.split('=');
// 		list[index] = {key:parts.shift().trim(),value:decodeURI(parts.join('='))};
// 	});

// 	return list;
// }
// function parseData(data) {
// 	var list = [],
// 		i = 0;
// 	for(var key in data){
// 		list[i] = {key:key,value:data[key]}
// 		i++;
// 	}
// 	return list
// }
// function parse(data) {
// 	var list = [],
// 		i = 0;
// 	for(var key in data){
// 		list[i] = {key:key,value:data[key]}
// 		i++;
// 	}
// 	return list
// }

app.get('/', function (req, res) {
   throw new Error(`Can't connect to database`);
})

app.use((err, req, res, next) => {
	// var cookie = parseCookies(req);
	// var form = parseData(req.body);
	// var queryString = parseData(req.query);
	// var serverVariables = parseData({port:req.socket.address().port.toString()});
	var severity = "Error";
	var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
	var obj = {
		title: err.message || "Express Error",
		source: null,
		application: "My application",
		detail: ""+err.stack+"" || null,
		hostname: req.get('host') || null,
		cookies: cookie || null,
		data: null,
		form: form || null,
		queryString: queryString || null,
		serverVariables: serverVariables,
		statusCode: err.status || null,
		severity: severity || null,
		type: "Error",
		url: fullUrl || null,
		user: null,
		version: "1.0.0"
	};
	var conf = {
		url: site,
		qs: {api_key:"API_KEY"},
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		json: obj
	}
	request(conf, function (error, response, body) {
	});
	next();

})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})
