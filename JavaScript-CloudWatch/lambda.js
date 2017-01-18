'use strict';

const https = require('https');
const AWS = require('aws-sdk');
const zlib = require('zlib');
const querystring = require('querystring')

exports.handler = (event, context, callback) => {
    const payload = new Buffer(event.awslogs.data, 'base64');
    
    function parseEvent(logEvent, logGroupName, logStreamName) {
        return {
            message: logEvent.message,
            logGroupName,
            logStreamName,
            timestamp: new Date(logEvent.timestamp).toISOString(),
        };
    }
     
     zlib.gunzip(payload, (error, result) => {
        if (error) {
            callback(error);
        } else {

            const resultParsed = JSON.parse(result.toString('ascii'));
            const parsedEvents = resultParsed.logEvents.map((logEvent) =>
                    parseEvent(logEvent, resultParsed.logGroup, resultParsed.logStream));

            var severity = 'Information';
            var stacktrace = null;
            
            var errorMessage = parsedEvents[0].message.replace('Unhandled Exception: ', ''); // This line is just because an internal library is prepending "Unhandled Exception" to logs
            
            if (errorMessage.indexOf('Exception') !== -1) {
                severity = 'Error';
                stacktrace=errorMessage + ' ';
                for(var i = 1; i < parsedEvents.length; i++) {
                    stacktrace += parsedEvents[i].message + '\n';
                }
                
            }

            var message = {
                title: errorMessage,
                application: parsedEvents[0].logStreamName.substr(0, parsedEvents[0].logStreamName.indexOf('/')),
                severity: severity,
                detail: stacktrace
            };
             var body = JSON.stringify(message);
           

            var options = {
              hostname: 'elmah.io',
              port: 443,
              path: '/api/v2/messages?logid=XXX',
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "Content-Length": Buffer.byteLength(body)
              }
            };
            var req = https.request(options, (res) => {
              console.log('statusCode:', res.statusCode);
              console.log('headers:', res.headers);
            
              res.on('data', (d) => {
                process.stdout.write(d);
              });
            });
            
            req.on('error', (e) => {
              console.error(e);
            });

            console.log(body)
            req.write(body);
            req.end();
        }
    });

};