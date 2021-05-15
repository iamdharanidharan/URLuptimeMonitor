const http = require('http');
const https = require('https');
const querystring = require('querystring');
const StringDecoder = require('string_decoder').StringDecoder;
const fs = require('fs');
const path = require('path');
const handlers = require('./handlers');
const config = require('./config');
const helpers = require('./helpers');
const util = require('util');
const debug = util.debuglog('server');

let server = {};

server.httpsServerOptions = {
    'key' : fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
    'cert' : fs.readFileSync(path.join(__dirname, '/../https/cert.pem'))
};

server.httpsServer = https.createServer(server.httpsServerOptions,(req,res)=>{
    server.unifiedServer(req,res);
});

server.httpServer = http.createServer((req,res) => {
    server.unifiedServer(req,res);
});





server.unifiedServer = (req, res) =>{
    let parsedURL = new URL(req.url , config.templateGlobals.baseUrl);

    let path = parsedURL.pathname;
    let trimmedPath = path.replace(/^\/+|\/+$/g, '');

    let method = req.method.toLowerCase();
    
    let headers = req.headers;

    let queryStringObject = querystring.parse(parsedURL.search.substring(1));

    let decoder = new StringDecoder('utf-8');
    let buffer = '';

    req.on('data',(data) => {
        buffer += decoder.write(data);
    });

    req.on('end',() =>{
        buffer += decoder.end();

        let chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;
        
        chosenHandler = trimmedPath.indexOf('public/') >= 0 ? handlers.public : chosenHandler;

        let data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : helpers.parseJsonToObject(buffer)
        };

        chosenHandler(data,(statusCode, payload, contentType)=>{
            
            contentType = typeof(contentType) == 'string' ? contentType : 'json';

            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            let payloadString = JSON.stringify(payload);
            
            if(contentType == 'json'){
                res.setHeader('Content-Type', 'application/json');
                payload = typeof(payload) == 'object' ? payload : {};
                payloadString = JSON.stringify(payload);
            }
            if(contentType == 'html'){
                res.setHeader('Content-Type','text/html');
                payloadString = typeof(payload) == 'string' ? payload : '';
            }
            if(contentType == 'favicon'){
                res.setHeader('Content-Type','image/x-icon');
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
            }
            if(contentType == 'css'){
                res.setHeader('Content-Type','text/css');
                payloadString = typeof(payload) !== undefined ? payload : '';
            }
            if(contentType == 'png'){
                res.setHeader('Content-Type','image/png');
                payloadString = typeof(payload) !== undefined ? payload : '';
            }
            if(contentType == 'jpg'){
                res.setHeader('Content-Type','image/jpeg');
                payloadString = typeof(payload) !== undefined ? payload : '';
            }
            if(contentType == 'plain'){
                res.setHeader('Content-Type','text/plain');
                payloadString = typeof(payload) !== undefined ? payload : '';
            }
            res.writeHead(statusCode);
            res.end(payloadString);

            if(statusCode == 200){
                debug('\x1b[32m%s\x1b[0m',method.toUpperCase()+' /'+trimmedPath+' '+statusCode);
            } else{
                debug('\x1b[31m%s\x1b[0m',method.toUpperCase()+' /'+trimmedPath+' '+statusCode);
            }
        });

    });
}


server.router = {
    '' : handlers.index,
    'account/create' : handlers.accountCreate,
    'account/edit' : handlers.accountEdit,
    'account/deleted' : handlers.accountDeleted,
    'session/create' : handlers.sessionCreate,
    'session/deleted' : handlers.sessionDeleted,
    'checks/all' : handlers.checksList,
    'checks/create' : handlers.checksCreate,
    'checks/edit' : handlers.checksEdit,
    'ping' : handlers.ping,
    'api/users' : handlers.users,
    'api/tokens' : handlers.tokens,
    'api/checks' : handlers.checks,
    'favicon.ico' : handlers.favicon,
    'public' : handlers.public
}

server.init = ()=>{
    server.httpServer.listen(config.httpPort, ()=>{
        console.log('\x1b[36m%s\x1b[0m','HTTP server started at '+ config.httpPort + ' in ' + config.envName + ' mode');
    });
    server.httpsServer.listen(config.httpsPort, ()=>{
        console.log('\x1b[35m%s\x1b[0m','HTTPS server started at '+ config.httpsPort + ' in ' + config.envName + ' mode');
    });
};

module.exports = server;