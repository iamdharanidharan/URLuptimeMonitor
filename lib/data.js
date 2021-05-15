const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');

let lib = {};

lib.baseDir = path.join(__dirname, '/../.data/');

lib.create = (dir, file, data, callback) => {
    fs.open(lib.baseDir + dir + '/' + file + '.json', 'wx', (err, fileDescriptor) => {
        if(!err && fileDescriptor){
            let stringData = JSON.stringify(data);
            fs.writeFile(fileDescriptor, stringData, (err) => {
                if(!err){
                    fs.close(fileDescriptor, (err) => {
                        if(!err){
                            callback(false);
                        } else {
                            callback('Error closing the file');
                        }
                    });
                } else {
                    callback('Error writing file');
                }
            });
        } else {
            callback('Could not create new file');
        }
    });
};

lib.read = (dir, file, callback) => {
    fs.readFile(lib.baseDir+dir+'/'+file+'.json', 'utf-8', (err,data) => {
        if(!err && data){
            let parsedData = helpers.parseJsonToObject(data);
            callback(err,parsedData);
        } else {
            callback(err,data);
        }
    });
};

lib.update = (dir, file, data, callback) => {
    fs.open(lib.baseDir+dir+'/'+file+'.json', 'r+', (err,fileDescriptor) => {
        if(!err && fileDescriptor){
            let stringData = JSON.stringify(data);

            fs.ftruncate(fileDescriptor, 0, (err)=>{
                if(!err){
                    fs.writeFile(fileDescriptor, stringData, (err)=>{
                        if(!err){
                            fs.close(fileDescriptor,(err)=>{
                                if(!err){
                                    callback(false);
                                } else {
                                    callback('Error closing the file');
                                }
                            });
                        } else {
                            callback('Error writing to file');
                        }
                    });
                }else {
                    callback('Error Truncating file');
                }
            });
        } else {
            callback('File could not be opened for updating');
        }
    });
};

lib.delete = (dir, file, callback) => {
    fs.unlink(lib.baseDir+dir+'/'+file+'.json', (err)=>{
        if(!err) {
            callback(false);
        } else {
            callback('Could not delete file');
        }
    })
}

lib.list = (dir, callback) =>{
    fs.readdir(lib.baseDir+dir+'/',(err, data)=>{
        if(!err && data && data.length > 0){
            let trimmedFileNames = data.map(fileName => fileName.replace('.json',''));
            callback(false, trimmedFileNames);
        } else{
            callback(err,data);
        }
    });
};

module.exports =lib;