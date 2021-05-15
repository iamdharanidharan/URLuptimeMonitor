process.env.NODE_ENV = 'testing';

_app = {};

_app.tests = {};

_app.tests.unit = require('./unit');
_app.tests.api = require('./api');

_app.countTests = () => {
    let counter = 0;
    for(let key in _app.tests){
        if(_app.tests.hasOwnProperty(key)){
            let subTests = _app.tests[key];
            for(let testName in subTests){
                if(subTests.hasOwnProperty(testName)){
                    counter++;
                }
            }
        }
    }
    return counter;
};

_app.produceTestReport = (limit,successes,errors) => {
    console.log('\n------------BEGIN TEST REPORT------------\n');
    console.log(`Total Tests: ${limit}\nPass: ${successes}\nFail: ${errors.length}`);
    if(errors.length > 0){
        console.log('\n------------BEGIN ERROR DETAILS------------\n');
        errors.forEach((testError)=>{
            console.log('\x1b[31m%s\x1b[0m',testError.name);
            console.log(testError.error);
            console.log("");
        });
        console.log('\n------------END ERROR DETAILS------------\n');
    }
    console.log('\n------------END TEST REPORT------------\n');
    process.exit(0);
};

_app.runTests = () => {
    let errors = [];
    let successes = 0;
    let limit = _app.countTests();
    let counter = 0;
    for(let key in _app.tests){
        if(_app.tests.hasOwnProperty(key)){
            let subTests = _app.tests[key];
            for(let testName in subTests){
                if(subTests.hasOwnProperty(testName)){
                    (()=>{
                        let tempTestName = testName;
                        let testValue = subTests[testName];
                        try {
                            testValue(()=>{
                                console.log('\x1b[32m%s\x1b[0m',tempTestName);
                                successes++;
                                counter++;
                                if(counter == limit){
                                    _app.produceTestReport(limit,successes,errors);
                                }
                            });
                        } catch (e) {
                            errors.push({
                                'name' : testName,
                                'error' : e 
                            });
                            console.log('\x1b[31m%s\x1b[0m',tempTestName);
                            counter++;
                            if(counter == limit){
                                _app.produceTestReport(limit,successes,errors);
                            }    
                        }
                    })();
                }
            }
        }
    }
};

_app.runTests();