const crypto = require('crypto');
const config = require('./config');
const queryString = require('querystring');
const https = require('https');
const path = require('path');
const fs = require('fs');


let helpers = {};

helpers.getANumber = () => {
    return 1;
};

helpers.hash = (str) => {
    if(typeof(str) === 'string' && str.length > 0) {
        let hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
        return hash;
    } else {
        return false;
    }
};

helpers.parseJsonToObject = (str) => {
    try {
        let obj = JSON.parse(str);
        return obj;
    } catch (error) {
        return {};
    }
};

helpers.createRandomString = (strLength) => {
    strLength = typeof(strLength) === 'number' && strLength > 0 ? strLength : false;
    if(strLength) {
        let possibleCharacters = 'qwertyuiopasdfghjklzxcvbnm1234567890';
        let str = '';
        for(i=0; i< strLength; i++) {
            let randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            str+=randomCharacter;
        }
        return str;
    }
};

helpers.sendTextMsg = (phone, msg, callback) => {
    phone = typeof(phone) === 'string' && phone.trim().length == 10 ? phone.trim() : false;
    msg = typeof(msg) === 'string' && msg.trim().length > 0 && msg.trim().length <= 160 ? msg.trim() : false;
    if(phone && msg){
        let payload = {
            'From' : config.Twilio.fromPhone,
            'To' : '+91'+phone,
            'Body' : msg
        };
        let stringPayload = queryString.stringify(payload);
        let requestDetails = {
            'protocol' : 'https:',
            'hostname' : 'api.twilio.com',
            'method' : 'POST',
            'path' : '/2010-04-01/Accounts/'+config.Twilio.accountSid+'/Messages.json',
            'auth' : config.Twilio.accountSid+':'+config.Twilio.authToken,
            'headers' : {
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Content-Length' : Buffer.byteLength(stringPayload)
            }
        };

        let req = https.request(requestDetails,(res)=>{
            let status = res.statusCode;
            if(status == 200 || status == 201){
                callback(false);
            } else {
                callback('Status code of Error : '+status);
            }
        });

        req.on('error', (e)=>{
            callback(e);
        });

        req.write(stringPayload);
        req.end();

    } else{
        callback('Parameters are invalid');
    }
};

helpers.getTemplate = (templateName, data, callback) => {
    templateName = typeof(templateName) == 'string' && templateName.length > 0 ? templateName : false;
    data = typeof(data) == 'object' && data !== null ? data : {};
    
    if(templateName){
        let templatesDir = path.join(__dirname,'/../templates/');
        fs.readFile(templatesDir+templateName+'.html', 'utf8', (err, str)=>{
            if(!err && str && str.length > 0){
                let finalStr = helpers.interpolate(str,data);
                callback(false,finalStr);
            } else{
                callback('Template could not be found');
            }
        });
    } else{
        callback('Invalid template name');
    }
};

helpers.addUniversalTemplates = (str,data,callback) => {
    str = typeof(str) == 'string' && str.trim().length > 0 ? str : '';
    data = typeof(data) == 'object' && data !== null ? data : {};

    helpers.getTemplate('_header',data,(err,headerString)=>{
        if(!err && headerString){
            helpers.getTemplate('_footer',data,(err,footerString)=>{
                if(!err && footerString){
                    let fullString = headerString + str + footerString;
                    callback(false, fullString);
                } else{
                    callback('Could not find footer template');
                }
            });
        } else{
            callback('Could not find the header template');
        }
    });
};

helpers.interpolate = (str, data) => {
    str = typeof(str) == 'string' && str.trim().length > 0 ? str : '';
    data = typeof(data) == 'object' && data !== null ? data : {};

    for(let keyName in config.templateGlobals) {
        if(config.templateGlobals.hasOwnProperty(keyName)){
            data['global.'+keyName] = config.templateGlobals[keyName];
        }
    }

    for(let key in data){
        if(data.hasOwnProperty(key)  && typeof(data[key]) == 'string'){
            let replace = data[key];
            let find = '{'+key+'}';
            str = str.replace(find, replace);
        }
    }
    return str;
};

helpers.getStaticAsset = (fileName,callback) => {
    fileName = typeof(fileName) == 'string' && fileName.trim().length > 0 ? fileName : false;
    if(fileName){
        let publicDir = path.join(__dirname,'/../public/');
        fs.readFile(publicDir+fileName, (err,data) => {
            if(!err && data){
                callback(false,data);
            } else{
                callback('File not found');
            }
        });
    } else{
        callback('Invalid filename');
    }
};

module.exports = helpers;