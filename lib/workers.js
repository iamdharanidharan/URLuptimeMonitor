const path = require('path');
const fs = require('fs');
const _data = require('./data');
const http = require('http');
const https = require('https');
const helpers = require('./helpers');
const _logs = require('./logs');
const util = require('util');
const debug = util.debuglog('workers');

let workers = {};

workers.gatherAllChecks = () =>{
    _data.list('checks',(err,checks) =>{
        if(!err && checks && checks.length > 0){
            checks.forEach((check)=>{
                _data.read('checks',check,(err,originalCheckData) =>{
                    if(!err && originalCheckData){
                        workers.validateCheckData(originalCheckData);
                    }else{
                        debug('Error reading a check data');
                    }
                });
            });
        } else{
            debug('Error: could not find checks to process');
        }
    });
};

workers.validateCheckData = (originalCheckData) =>{
    originalCheckData = typeof(originalCheckData) == 'object' && originalCheckData !== null ? originalCheckData : false;
    originalCheckData.id = typeof(originalCheckData.id) == 'string' && originalCheckData.id.trim().length == 20 ? originalCheckData.id : false;
    originalCheckData.userPhone = typeof(originalCheckData.userPhone) == 'string' && originalCheckData.userPhone.trim().length == 10 ? originalCheckData.userPhone : false;
    originalCheckData.protocol = typeof(originalCheckData.protocol) == 'string' && ['http', 'https'].indexOf(originalCheckData.protocol) >= 0 ? originalCheckData.protocol : false;
    originalCheckData.url = typeof(originalCheckData.url) == 'string' && originalCheckData.url.trim().length > 0 ? originalCheckData.url : false;
    originalCheckData.method = typeof(originalCheckData.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(originalCheckData.method) >= 0 ? originalCheckData.method : false;
    originalCheckData.successCodes = typeof(originalCheckData.successCodes) == 'object' && originalCheckData.successCodes instanceof Array && originalCheckData.successCodes.length > 0 ? originalCheckData.successCodes : false;
    originalCheckData.timeOutSeconds = typeof (originalCheckData.timeOutSeconds) == 'number' && originalCheckData.timeOutSeconds % 1 === 0 && originalCheckData.timeOutSeconds >=1 && originalCheckData.timeOutSeconds <=5 ? originalCheckData.timeOutSeconds : false;

    originalCheckData.state =  typeof(originalCheckData.state) == 'string' && ['up', 'down'].indexOf(originalCheckData.state) >= 0 ? originalCheckData.state : 'down';
    originalCheckData.lastChecked = typeof(originalCheckData.lastChecked) == 'number' && originalCheckData.lastChecked > 0 ? originalCheckData.lastChecked : false;

    if(originalCheckData.id && originalCheckData.userPhone && originalCheckData.protocol && originalCheckData.url && originalCheckData.method && originalCheckData.successCodes && originalCheckData.timeOutSeconds){
        workers.performCheck(originalCheckData);
    } else {
        debug("Error: one of the checks is not properly formatted, hence skipped");
    }
};

workers.performCheck = (originalCheckData) =>{
    let checkOutcome = {
        'error' : false,
        'responseCode' : false
    };

    let outcomeSent = false;

    let parsedURL = new URL(originalCheckData.protocol+'://'+originalCheckData.url);
    let hostName = parsedURL.hostname;
    let path = parsedURL.path;

    let requestDetails = {
        'protocol' : originalCheckData.protocol+':',
        'hostname' : hostName,
        'method' : originalCheckData.method.toUpperCase(),
        'path' : path,
        'timeout' : originalCheckData.timeOutSeconds * 1000
    };

    let _moduleToUse = originalCheckData.protocol == 'http' ? http : https;
    let req = _moduleToUse.request(requestDetails,(res)=>{
        let staus = res.statusCode;
        checkOutcome.responseCode = staus;
        if(!outcomeSent){
            workers.processCheckOutcome(originalCheckData,checkOutcome);
            outcomeSent = true;
        }
    });

    req.on('error',(e)=>{
        checkOutcome.err = {
            'error' : true,
            'value' : e
        };
        if(!outcomeSent){
            workers.processCheckOutcome(originalCheckData,checkOutcome);
            outcomeSent = true;
        }
    });

    req.on('timeout',(e)=>{
        checkOutcome.err = {
            'error' : true,
            'value' : 'timeout'
        };
        if(!outcomeSent){
            workers.processCheckOutcome(originalCheckData,checkOutcome);
            outcomeSent = true;
        }
    });
    req.end();
};

workers.processCheckOutcome = (originalCheckData,checkOutcome) => {
    let state = !checkOutcome.error && checkOutcome.responseCode && originalCheckData.successCodes.indexOf(checkOutcome.responseCode) >= 0 ? 'up' : 'down';
    let alertWarranted = originalCheckData.lastChecked && originalCheckData.state !== state ? true : false;
//debug(checkOutcome.responseCode);
    let timeOfCheck = Date.now();    
    let newCheckData = originalCheckData;
    newCheckData.state = state;
    newCheckData.lastChecked = timeOfCheck;

    workers.log(originalCheckData,checkOutcome,state,alertWarranted,timeOfCheck);

    _data.update('checks', newCheckData.id, newCheckData,(err)=>{
        if(!err){
            if(alertWarranted){
                workers.alertUserToStatusChange(newCheckData);
            } else{
                debug("Check outcome did not change, no alert needed");
            }
        } else{
            debug("Error trying to save updates to a check");
        }
    });
};

workers.alertUserToStatusChange = (newCheckData) => {
    let msg = `Alert: Your check for ${newCheckData.method.toUpperCase()} ${newCheckData.protocol}://${newCheckData.url} is currently ${newCheckData.state}`;
    helpers.sendTextMsg(newCheckData.userPhone, msg,(err)=>{
        if(!err){
            debug("Success: Text message sent: ",msg);
        } else{
            debug('Error: Could not send Text message');
        }
    });
};

workers.log = (originalCheckData,checkOutcome,state,alertWarranted,timeOfCheck) => {
    let logData = {
        'check' : originalCheckData,
        'outcome' : checkOutcome,
        'state' : state,
        'alert' : alertWarranted,
        'time' : timeOfCheck
    };

    let logStr = JSON.stringify(logData);

    let logFileName = originalCheckData.id;

    _logs.append(logFileName,logStr,(err)=>{
        if(!err){
            debug("Logged to file successfully");
        } else {
            debug("Error: Logging to file failed");
        }
    })
};

workers.loop = () => {
    setInterval(() => {
        workers.gatherAllChecks();
    }, 1000 * 20 );
};

workers.rotateLogs = () => {
    _logs.list(false, (err,logs)=>{
        if(!err && logs && logs.length > 0){
            logs.forEach((logName)=>{
                let logId = logName.replace('.log','');
                let newFileId = logId+'-'+Date.now();
                _logs.compress(logId,newFileId,(err)=>{
                    if(!err){
                        _logs.truncate(logId,(err)=>{
                            if(!err){
                                debug("Success truncating log file");
                            } else{
                                debug("Error truncating the log file");
                            }
                        });
                    } else{
                        debug("Error compressing one of the log files ",err);
                    }
                });
            });
        } else{
            debug("Error: No logs to rotate");
        }
    });
};

workers.logRotationLoop = () => {
    setInterval(() => {
        workers.rotateLogs();
    }, 1000 * 60 * 60 * 24);
}; 

workers.init = () => {
    console.log('\x1b[33m%s\x1b[0m','Background workers are running');
    workers.gatherAllChecks();
    workers.loop();
    workers.rotateLogs();
    workers.logRotationLoop();
};

module.exports = workers;