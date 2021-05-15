const _data = require('./data');
const helpers = require('./helpers');
const config = require('./config');
const dns = require('dns');
const util = require('util');
const debug = util.debuglog('handlersPerf');
const { performance, PerformanceObserver } = require("perf_hooks")

const perfObserver = new PerformanceObserver((items) => {
  items.getEntries().forEach((entry) => {
        debug('\x1b[33m%s\x1b[0m',entry.name+' '+entry.duration);
 //   console.log(entry);
  });
});

perfObserver.observe({ entryTypes: ["measure"], buffer: true });

let handlers = {};

/*
 * HTML handlers
 */

handlers.index = (data,callback) => {
    if(data.method == 'get'){

        let templateData = {
            'head.title' : 'Home',
            'head.desription' : 'An URL uptime monitor application with SMS notification',
            'body.class' : 'index'
        };

        helpers.getTemplate('index',templateData,(err,str)=>{
            if(!err && str){
                helpers.addUniversalTemplates(str,templateData,(err,str)=>{
                    if(!err && str){
                        callback(200,str,'html');
                    } else{
                    callback(500,undefined,'html');
                    }
                });
            } else{
                callback(500,undefined,'html');
            }
        });
    } else{
        callback(405,undefined,'html');
    }
};

handlers.accountCreate = (data,callback) => {
    if(data.method == 'get'){

        let templateData = {
            'head.title' : 'Signup',
            'head.desription' : 'Easy sign up',
            'body.class' : 'accountCreate'
        };

        helpers.getTemplate('accountCreate',templateData,(err,str)=>{
            if(!err && str){
                helpers.addUniversalTemplates(str,templateData,(err,str)=>{
                    if(!err && str){
                        callback(200,str,'html');
                    } else{
                    callback(500,undefined,'html');
                    }
                });
            } else{
                callback(500,undefined,'html');
            }
        });
    } else{
        callback(405,undefined,'html');
    }
};

handlers.sessionCreate = (data,callback) =>{
    if(data.method == 'get'){

        let templateData = {
            'head.title' : 'LogIn',
            'head.desription' : 'Log in to access the services',
            'body.class' : 'sessionCreate'
        };

        helpers.getTemplate('sessionCreate',templateData,(err,str)=>{
            if(!err && str){
                helpers.addUniversalTemplates(str,templateData,(err,str)=>{
                    if(!err && str){
                        callback(200,str,'html');
                    } else{
                    callback(500,undefined,'html');
                    }
                });
            } else{
                callback(500,undefined,'html');
            }
        });
    } else{
        callback(405,undefined,'html');
    }
};

handlers.sessionDeleted = (data,callback) =>{
    if(data.method == 'get'){

        let templateData = {
            'head.title' : 'Logged out',
            'head.desription' : 'You have been logged out',
            'body.class' : 'sessionDeleted'
        };

        helpers.getTemplate('sessionDeleted',templateData,(err,str)=>{
            if(!err && str){
                helpers.addUniversalTemplates(str,templateData,(err,str)=>{
                    if(!err && str){
                        callback(200,str,'html');
                    } else{
                    callback(500,undefined,'html');
                    }
                });
            } else{
                callback(500,undefined,'html');
            }
        });
    } else{
        callback(405,undefined,'html');
    }
};

handlers.accountEdit = (data,callback) =>{
    if(data.method == 'get'){

        let templateData = {
            'head.title' : 'Account Settings',
            'body.class' : 'accountEdit'
        };

        helpers.getTemplate('accountEdit',templateData,(err,str)=>{
            if(!err && str){
                helpers.addUniversalTemplates(str,templateData,(err,str)=>{
                    if(!err && str){
                        callback(200,str,'html');
                    } else{
                    callback(500,undefined,'html');
                    }
                });
            } else{
                callback(500,undefined,'html');
            }
        });
    } else{
        callback(405,undefined,'html');
    }
};

handlers.accountDeleted = (data,callback) =>{
    if(data.method == 'get'){

        let templateData = {
            'head.title' : 'Account Deleted',
            'head.description' : 'Your account has been deleted',
            'body.class' : 'accountDeleted'
        };

        helpers.getTemplate('accountDeleted',templateData,(err,str)=>{
            if(!err && str){
                helpers.addUniversalTemplates(str,templateData,(err,str)=>{
                    if(!err && str){
                        callback(200,str,'html');
                    } else{
                    callback(500,undefined,'html');
                    }
                });
            } else{
                callback(500,undefined,'html');
            }
        });
    } else{
        callback(405,undefined,'html');
    }
};

handlers.checksCreate = (data,callback) =>{
    if(data.method == 'get'){

        let templateData = {
            'head.title' : 'Create Check',
            'body.class' : 'checksCreate'
        };

        helpers.getTemplate('checksCreate',templateData,(err,str)=>{
            if(!err && str){
                helpers.addUniversalTemplates(str,templateData,(err,str)=>{
                    if(!err && str){
                        callback(200,str,'html');
                    } else{
                    callback(500,undefined,'html');
                    }
                });
            } else{
                callback(500,undefined,'html');
            }
        });
    } else{
        callback(405,undefined,'html');
    }
};

handlers.checksList = (data,callback) =>{
    if(data.method == 'get'){

        let templateData = {
            'head.title' : 'Dashnoard',
            'body.class' : 'checksList'
        };

        helpers.getTemplate('checksList',templateData,(err,str)=>{
            if(!err && str){
                helpers.addUniversalTemplates(str,templateData,(err,str)=>{
                    if(!err && str){
                        callback(200,str,'html');
                    } else{
                    callback(500,undefined,'html');
                    }
                });
            } else{
                callback(500,undefined,'html');
            }
        });
    } else{
        callback(405,undefined,'html');
    }
};

handlers.checksEdit = (data,callback) =>{
    if(data.method == 'get'){

        let templateData = {
            'head.title' : 'Edit Checks',
            'body.class' : 'checksEdit'
        };

        helpers.getTemplate('checksEdit',templateData,(err,str)=>{
            if(!err && str){
                helpers.addUniversalTemplates(str,templateData,(err,str)=>{
                    if(!err && str){
                        callback(200,str,'html');
                    } else{
                    callback(500,undefined,'html');
                    }
                });
            } else{
                callback(500,undefined,'html');
            }
        });
    } else{
        callback(405,undefined,'html');
    }
};

handlers.favicon = (data,callback) => {
    if(data.method == 'get'){

        helpers.getStaticAsset('favicon.ico',(err,data)=>{
            if(!err && data){
                callback(200,data,'favicon');
            } else{
                callback(500);
            }
        });

    } else{
        callback(405);
    }
};

handlers.public = (data,callback) => {
    if(data.method == 'get'){
        let trimmedAssetName = data.trimmedPath.replace('public/','').trim();
        if(trimmedAssetName.length > 0){
            helpers.getStaticAsset(trimmedAssetName,(err,data)=>{
                if(!err && data){
                    let contentType = 'plain';
                    if(trimmedAssetName.indexOf('.css') >= 0){
                        contentType = 'css';
                    }
                    if(trimmedAssetName.indexOf('.png') >= 0){
                        contentType = 'png';
                    }
                    if(trimmedAssetName.indexOf('.jpg') >= 0){
                        contentType = 'jpg';
                    }
                    if(trimmedAssetName.indexOf('.ico') >= 0){
                        contentType = 'favicon';
                    }
                    callback(200,data,contentType);
                } else{
                    callback(404);
                }
            });
        } else{
            callback(404);
        }
    } else{
        callback(405);
    }
};


/*
 * JSON API handlers
 */

handlers.users = (data, callback) => {
    let acceptableMethods = ['post', 'put', 'delete', 'get'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback);
    } else {
        callback(405);
    }
};

handlers._users = {};

handlers._users.post = (data, callback) => {
    let firstName = typeof (data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    let lastName = typeof (data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    let phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    let password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    let tosAgreement = typeof (data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? data.payload.tosAgreement : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        _data.read('users', phone, (err, data) => {
            if (err) {
                let hashedPassword = helpers.hash(password);
                if (hashedPassword) {
                    let userObject = {
                        'firstName': firstName,
                        'lastName': lastName,
                        'hashedPassword': hashedPassword,
                        'phone': phone,
                        'tosAgreement': tosAgreement
                    };
                    _data.create('users', phone, userObject, (err) => {
                        if (!err) {
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500, { 'Error': 'Could not create new user' });
                        }
                    });
                } else {
                    callback(500, { 'Error': 'Could not hash the password' });
                }
            } else {
                callback(400, { 'Error': 'User already exists with same phone number' });
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required fields' });
    }
};

handlers._users.get = (data, callback) => {
    let phone = typeof(data.queryStringObject.phone) === 'string' && data.queryStringObject.phone.length == 10 ? data.queryStringObject.phone : false;
    if(phone){
        let token = typeof(data.headers.token) === 'string' ? data.headers.token : false;
        handlers._tokens.verifyToken(token, phone, (tokenIsValid)=>{
            if(tokenIsValid){
                _data.read('users', phone,(err, data) => {
                    if(!err && data){
                        delete data.hashedPassword;
                        callback(200, data);
                    } else {
                        callback(404);
                    }
                });
            } else {
                callback(403, {'Error':'Missing token or Invalid token'});
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required field' });
    }
};

handlers._users.put = (data, callback) => {
    let firstName = typeof (data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    let lastName = typeof (data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    let phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    let password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    if(phone ){
        if(firstName || lastName || password){
            let token = typeof(data.headers.token) === 'string' ? data.headers.token : false;
        handlers._tokens.verifyToken(token, phone, (tokenIsValid)=>{
            if(tokenIsValid){
                _data.read('users', phone, (err, userData)=>{
                    if(!err && userData){
                        if(firstName){
                            userData.firstName = firstName;
                        }
                        if(lastName){
                            userData.lastName = lastName;
                        }
                        if(password){
                            userData.hashedPassword = helpers.hash(password);
                        }
                        _data.update('users',phone, userData,(err)=>{
                            if(!err){
                                callback(200);
                            } else{
                                callback(500, { 'Error': 'Could not update'});
                            }
                        });
                    } else {
                        callback(400, {'Error':'User does not exist'});
                    }
                });
            } else {
                callback(403, {'Error':'Missing token or Invalid token'});
            }
        });
            
        } else {
            callback(400, { 'Error': 'Missing fields to update' });
        }
    } else {
        callback(400, { 'Error': 'Missing required field' });
    }

};

handlers._users.delete = (data, callback) => {
    let phone = typeof(data.queryStringObject.phone) === 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    if(phone){
        let token = typeof(data.headers.token) === 'string' ? data.headers.token : false;
        handlers._tokens.verifyToken(token, phone, (tokenIsValid)=>{
            if(tokenIsValid){
                _data.read('users', phone,(err, userData) => {
                    if(!err && userData){
                        _data.delete('users',phone,(err)=>{
                            if(!err){
                                let userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
                                let checksToDelete = userChecks.length;
                                if(checksToDelete > 0){
                                    let checksDeleted = 0;
                                    let deletionErrors = false;

                                    userChecks.forEach(checkId => {
                                        _data.delete('checks', checkId,(err)=>{
                                            if(err){
                                                deletionErrors = true;
                                            }
                                            checksDeleted++;
                                            if(checksDeleted == checksToDelete){
                                                if(!deletionErrors){
                                                    callback(200);
                                                } else{
                                                    callback(500, {'Error':'Could not delete all checks in users check list'});
                                                }
                                            }
                                        });                                        
                                    });
                                } else{
                                    callback(200);
                                }
                            } else {
                                callback(500, {'Error':'Could not delete user'});
                            }
                        });
                    } else {
                        callback(400, {'Error':'Could not find user'});
                    }
                });
            } else {
                callback(403, {'Error':'Missing token or Invalid token'});
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required field' });
    }
};

handlers.tokens = (data, callback) => {
    let acceptableMethods = ['post', 'put', 'delete', 'get'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._tokens[data.method](data, callback);
    } else {
        callback(405);
    }
};

handlers._tokens = {};

handlers._tokens.post = (data, callback) => {
performance.mark('method start');
    let phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    let password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
performance.mark('inputs validated');

    if(phone && password){
    performance.mark('get user start');
        _data.read('users', phone, (err,userData) => {
    performance.mark('get user end');

            if(!err && userData){
            performance.mark('password hash start');
                let hashedPassword = helpers.hash(password);
            performance.mark('password hash end');

                if(hashedPassword == userData.hashedPassword){
                performance.mark('create token data start');
                    let tokenId = helpers.createRandomString(20);
                performance.mark('create token data end');

                    let expires = Date.now() + 1000 * 60 * 60;
                    let tokenObject = {
                        'phone' : phone,
                        'id' : tokenId,
                        'expires' : expires
                    };

                performance.mark('save token start');
                    _data.create('tokens',tokenId, tokenObject, (err)=>{
                performance.mark('save token end');

                performance.measure('Complete method execution','method start','save token end');
                performance.measure('Input validation','method start','inputs validated');
                performance.measure('Getting user','get user start','get user end');
                performance.measure('Password hashing','password hash start','password hash end');
                performance.measure('Token data creation','create token data start','create token data end');
                performance.measure('Saving token','save token start','save token end');
// console.log('im here');
                // const perfObserver = new PerformanceObserver((items) => {
                //     items.getEntries().forEach((entry) => {
                //         console.log('\x1b[33m%s\x1b[0m',entry.name+' '+entry.duration);
                //     });
                //   });
                  
                // perfObserver.observe({ entryTypes: ["measure"], buffer: true });
                // let measurements = _performance.getEntries('measure');
                // measurements.forEach((measurement)=>{
                //     debug('\x1b[33m%s\x1b[0m',measurement.name+' '+measurement.duration);
                // });

                        if(!err){
                            callback(200,tokenObject);
                        } else {
                            callback(500, 'Could not create new token');
                        }
                    }); 
                } else {
                callback(400, {'Error':'Password does not match'})
                }
            } else {
                callback(400, {'Error':'Could not find user'})
            }
        })
   } else {
       callback(400, {'Error': 'Missing required fields'})
   }
}

handlers._tokens.get = (data, callback) => {
    let id = typeof(data.queryStringObject.id) === 'string' && data.queryStringObject.id.length == 20 ? data.queryStringObject.id : false;
    if(id){
        _data.read('tokens', id,(err, tokenData) => {
            if(!err && tokenData){
                callback(200, tokenData);
            } else {
                callback(404);
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required field' });
    }
}

handlers._tokens.put = (data, callback) => {
    let id = typeof (data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
    let extend = typeof (data.payload.extend) == 'boolean' && data.payload.extend == true ? true : false;
    if(id && extend){
        _data.read('tokens', id, (err, tokenData)=>{
            if(!err && tokenData){
                if(tokenData.expires > Date.now()){
                    tokenData.expires = Date.now() + 1000 * 60 * 60;
                    _data.update('tokens', id, tokenData, (err)=>{
                        if(!err){
                            callback(200);
                        } else {
                            callback(500, { 'Error': 'Could not update token'});
                        }
                    });
                } else {
                    callback(400, { 'Error': 'Token Expired'});
                }
            } else {
                callback(400, 'Token doesnot exist');
            }
        });
    } else {
        callback(400, {'Error' : 'Missing data or invalid data'});
    }
}

handlers._tokens.delete = (data, callback) => {
    let id = typeof(data.queryStringObject.id) === 'string' && data.queryStringObject.id.length == 20 ? data.queryStringObject.id : false;
    if(id){
        _data.read('tokens', id,(err, data) => {
            if(!err && data){
                _data.delete('tokens',id,(err)=>{
                    if(!err){
                        callback(200);
                    } else {
                        callback(500, {'Error':'Could not delete token'});
                    }
                });
            } else {
                callback(400, {'Error':'Could not find token'});
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required field' });
    }
};

handlers._tokens.verifyToken = (id, phone, callback) => {
    _data.read('tokens',id, (err, tokenData) => {
        if(!err && tokenData){
            if(tokenData.phone == phone && tokenData.expires > Date.now()){
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
};

handlers.checks = (data, callback) => {
    let acceptableMethods = ['post', 'put', 'delete', 'get'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._checks[data.method](data, callback);
    } else {
        callback(405);
    }
};

handlers._checks = {};

handlers._checks.post = (data, callback) => {
    let protocol = typeof (data.payload.protocol) == 'string' && ['https', 'http'].indexOf(data.payload.protocol) >= 0 ? data.payload.protocol : false;
    let url = typeof (data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
    let method = typeof (data.payload.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) >= 0 ? data.payload.method : false;
    let successCodes = typeof (data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
    let timeOutSeconds = typeof (data.payload.timeOutSeconds) == 'number' && data.payload.timeOutSeconds % 1 == 0 && data.payload.timeOutSeconds >=1 && data.payload.timeOutSeconds <= 5 ? data.payload.timeOutSeconds : false;

    if(protocol && url && method && successCodes && timeOutSeconds){
        let token = typeof(data.headers.token) === 'string' ? data.headers.token : false;

        _data.read('tokens', token, (err, tokenData) => {
            if(!err && tokenData){
                let userPhone = tokenData.phone;
                _data.read('users', userPhone, (err, userData) => {
                    if(!err && userData){
                        let userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
                        if(userChecks.length < config.maxChecks){
                            let parsedUrl = new URL(protocol+'://'+url);
                            let hostName = typeof(parsedUrl.hostname) == 'string' && parsedUrl.hostname.length > 0 ? parsedUrl.hostname : false;
                            console.log(hostName);
                            dns.resolve(hostName,(err,records)=>{
                                if(!err && records){
                                    let checkId = helpers.createRandomString(20);
                                    let checkObject = {
                                        'id': checkId,
                                        'userPhone' : userPhone,
                                        'protocol' : protocol,
                                        'url' : url,
                                        'method' : method,
                                        'successCodes' : successCodes,
                                        'timeOutSeconds' : timeOutSeconds                                
                                    };
        
                                    _data.create('checks', checkId, checkObject, (err)=>{
                                        if(!err){
                                            userData.checks = userChecks;
                                            userData.checks.push(checkId);
                                            _data.update('users', userPhone, userData, (err)=>{
                                                if(!err){
                                                    callback(200, checkObject);
                                                } else {
                                                    callback(500, {'Error':'Could not update the user with new check'});
                                                }
                                            });
                                        } else {
                                            callback(500, {'Error':'Could not create the new check'});
                                        }
                                    });
                                } else{
                                    callback(400,{'Error' : 'The URL could not be resolved to DNS entries'});
                                }
                            });
                        } else {
                            callback(400, {'Error':'User has already reached the max of ' + config.maxChecks +' checks'});
                        }
                    } else {
                        callback(403);
                    }
                });

            } else{
                callback(403);
            }
        });
    } else{
        callback(400,{'Error':'Missing required input'});
    }
};

handlers._checks.get = (data, callback) => {
    let id = typeof(data.queryStringObject.id) === 'string' && data.queryStringObject.id.length == 20 ? data.queryStringObject.id : false;
    if(id){
        _data.read('checks', id, (err, checkData) => {
            if(!err && checkData){
                let token = typeof(data.headers.token) === 'string' ? data.headers.token : false;
                handlers._tokens.verifyToken(token, checkData.userPhone, (tokenIsValid)=>{
            if(tokenIsValid){
                callback(200, checkData);
            } else {
                callback(403);
            }
        });
            }else{
                callback(404);
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required field' });
    }
};

handlers._checks.put = (data, callback) => {
    let id = typeof (data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
    let protocol = typeof (data.payload.protocol) == 'string' && ['https', 'http'].indexOf(data.payload.protocol) >= 0 ? data.payload.protocol : false;
    let url = typeof (data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
    let method = typeof (data.payload.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) >= 0 ? data.payload.method : false;
    let successCodes = typeof (data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
    let timeOutSeconds = typeof (data.payload.timeOutSeconds) == 'number' && data.payload.timeOutSeconds % 1 === 0 && data.payload.timeOutSeconds >=1 & data.payload.timeOutSeconds <=5 ? data.payload.timeOutSeconds : false;

    if(id){
        if(protocol || url || method || successCodes || timeOutSeconds){
            _data.read('checks', id, (err, checkData) => {
                if(!err && checkData){
                    let token = typeof(data.headers.token) === 'string' ? data.headers.token : false;
                     handlers._tokens.verifyToken(token, checkData.userPhone, (tokenIsValid)=>{
                      if(tokenIsValid){
                          if(protocol) checkData.protocol = protocol;
                          if(url) checkData.url = url;
                          if(method) checkData.method = method;
                          if(successCodes) checkData.successCodes = successCodes;
                          if(timeOutSeconds) checkData.timeOutSeconds = timeOutSeconds;
                          _data.update('checks', id, checkData, (err)=>{
                            if(!err){
                                callback(200);
                            } else {
                                callback(500, {'Error':'Could not update checks'});
                            }
                          });
                         } else {
                         callback(403);
                         }
                      });
                } else {
                    callback(400,{'Error':'Check ID does not exist'});
                }
            });
        } else {
        callback(400,{'Error':'Missing fields to update'});
        }
    } else {
        callback(400,{'Error':'Missing required fields'})
    }
};

handlers._checks.delete = (data, callback) => {
    let id = typeof(data.queryStringObject.id) === 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if(id){

        _data.read('checks', id, (err, checkData)=>{
            if(!err && checkData){
                let token = typeof(data.headers.token) === 'string' ? data.headers.token : false;
                  handlers._tokens.verifyToken(token, checkData.userPhone, (tokenIsValid)=>{
            if(tokenIsValid){
                _data.delete('checks',id,(err)=>{
                    if(!err){
                        _data.read('users', checkData.userPhone,(err, userData) => {
                            if(!err && userData){
                                let userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
                                let checkPosition = userChecks.indexOf(id);
                                if(checkPosition >= 0){
                                    userChecks.splice(checkPosition,1);
                                    _data.update('users',checkData.userPhone,userData,(err)=>{
                                        if(!err){
                                            callback(200);
                                        } else {
                                            callback(500, {'Error':'Could not update user check list'});
                                        }
                                    });
                                } else{
                                    callback(500,{'Error':'Could not find check in users list'});
                                }
                                
                            } else {
                                callback(500, {'Error':'Could not find user who created the check'});
                            }
                        });
                    }else{
                        callback(500,{'Error':'Could not delete the check data'});
                    }
                });
                
            } else {
                callback(403);
            }
        });
            }else{
                callback(400, {'Error':'CheckId does not exist'});
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required field' });
    }
};

handlers.ping = (data, callback) => {
    callback(200);
};

handlers.notFound = (data, callback) => {
    callback(404);
};

module.exports = handlers;