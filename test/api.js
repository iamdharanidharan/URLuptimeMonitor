const app = require('./../index');
const assert = require('assert');
const http = require('http');
const config = require('./../lib/config');

let api = {};

let apiHelpers = {};

apiHelpers.makeGetRequest = (path, callback) => {
    let requestDetails = {
        'protocol' : 'http:',
        'hostname' : 'localhost',
        'port' : config.httpPort,
        'method' : 'GET',
        'path' : path,
        'headers' : {
            'Content-Type' : 'application/json'
        }
    };

    let req = http.request(requestDetails,(res)=>{
        callback(res);
    });
    req.end();
};

api['app.init should start without throwing'] = (done) => {
    assert.doesNotThrow(()=>{
        app.init((err)=>{
            done();
        });
    },TypeError);
}

api['/ping should respond to GET with 200'] = (done) => {
    apiHelpers.makeGetRequest('/ping',(res)=>{
        assert.strictEqual(res.statusCode,200);
        done();
    });
};

api['/api/users should respond to GET with 400'] = (done) => {
    apiHelpers.makeGetRequest('/api/users',(res)=>{
        assert.strictEqual(res.statusCode,400);
        done();
    });
};

api['Random paths should respond to GET with 404'] = (done) => {
    apiHelpers.makeGetRequest('/unknown/path',(res)=>{
        assert.strictEqual(res.statusCode,404);
        done();
    });
};

module.exports = api;