const assert = require('assert');
const helpers = require('./../lib/helpers');
const logs = require('./../lib/logs');
const testDebugLib = require('./../lib/testDebugLib');

let unit = {};

unit['helpers.getANumber should return a number'] = (done) => {
    let val = helpers.getANumber();
    assert.strictEqual(typeof(val),'number');
    done();
};

unit['helpers.getANumber should return 1'] = (done) => {
    let val = helpers.getANumber();
    assert.strictEqual(val,1);
    done();
};

unit['helpers.getANumber should return 2'] = (done) => {
    let val = helpers.getANumber();
    assert.strictEqual(val,2);
    done();
};

unit['logs.list should callback a false error and an array of log names'] = (done) => {
    logs.list(true,(err,logFileNames)=>{
        assert.strictEqual(err,false);
        assert.ok(logFileNames instanceof Array);
        assert.ok(logFileNames.length > 1);
        done();
    });
};

unit['logs.truncate should not throw even if the log id does not exits. It should callback and error'] = (done) => {
    assert.doesNotThrow(()=>{
        logs.truncate('Non existant log ID',(err)=>{
            assert.ok(err); 
            done();
        });
    },TypeError);
};

unit['testDebugLib.init should not throw when called'] = (done) => {
    assert.doesNotThrow(()=>{
        testDebugLib.init() 
            done();
    },TypeError);
};

module.exports = unit;