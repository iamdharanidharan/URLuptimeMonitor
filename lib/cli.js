const util = require('util');
const debug = util.debuglog('cli');
const readline = require('readline');
const events = require('events');
class _events extends events{};
const e = new _events();
const os = require('os');
const v8 = require('v8');
const _data = require('./data');
const _logs = require('./logs');
const helpers = require('./helpers');
let childProcess = require('child_process');

let cli = {};

e.on('man', (str)=>{
    cli.responders.help();
});

e.on('help', (str)=>{
    cli.responders.help();
});

e.on('exit', (str)=>{
    cli.responders.exit();
});

e.on('stats', (str)=>{
    cli.responders.stats();
});

e.on('list users', (str)=>{
    cli.responders.listUsers();
});

e.on('more user info', (str)=>{
    cli.responders.moreUserInfo(str);
});

e.on('list checks', (str)=>{
    cli.responders.listChecks(str);
});

e.on('more check info', (str)=>{
    cli.responders.moreCheckInfo(str);
});

e.on('list logs', (str)=>{
    cli.responders.listLogs();
});

e.on('more log info', (str)=>{
    cli.responders.moreLogInfo(str);
});



cli.responders = {};

cli.responders.help = () => {
    let commands = {
        'exit' : 'Kill the CLI and the server',
        'man' : 'Show the avalilable commands',
        'help' : 'Alias of \'man\' command',
        'stats' : 'Get stats of the Operating system and resources utilization',
        'list users' : 'Lists all of the registered users',
        'more user info --{userId}' : 'Get the details of a particular user',
        'list checks --up --down' : 'Lists all the active checks. \'--up\' and \'--down\' flags are optional',
        'more check info --{checkId}' : 'Get the details of a particular check',
        'list logs' : 'Lists all the zipped logs',
        'more log info --{fileName}' : 'Get the details of a particular log file'
    };

    cli.verticalSpace(1);
    cli.horizontalLine();
    cli.centered('CLI MANUAL');
    cli.horizontalLine();
    cli.verticalSpace(1);

    for(let key in commands) {
        if(commands.hasOwnProperty(key)){
            let value = commands[key];
            let line = '\x1b[33m'+ '    ' + key + '\x1b[0m';
            let padding = 44 - line.length;
            for(let i=0; i<padding; i++){
                line += ' ';
            }
            line += value;
            console.log(line);
            cli.verticalSpace();
        }
    }
    cli.horizontalLine();
    cli.verticalSpace(1);
    _interface.prompt();
};

cli.verticalSpace = (lines) => {
    lines = typeof(lines) == 'number' && lines > 0 ? lines : 1;
    for(i=0; i<lines; i++){
        console.log('');
    }
};

cli.horizontalLine = () => {
    let width = process.stdout.columns;
    let line = '';

    for(i=0; i<width; i++){
       line += '-';
    }
    console.log(line);
};

cli.centered = (str) => {
    str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : '';
    let width = process.stdout.columns;
    let leftPadding = Math.floor((width - str.length) / 2);
    let line = '';

    for(i=0; i<leftPadding ; i++){
        line += ' ';
    }
    line += str;
    console.log(line);
};


cli.responders.exit = () => {
    _interface.question('Confirm: Kill Server? (Y/N) ',(str)=>{
        str = typeof(str) == 'string' && str.trim().length > 0 ? str.toUpperCase() : false;
        if(str && (str == 'Y' || str == 'YES')){
            process.exit(0);
        } else{
            _interface.prompt();
        }
    });
};

cli.responders.stats = () => {
    let stats = {
        'Load Average' : os.loadavg().join(' '),
        'CPU Count' : os.cpus().length,
        'Free Memory' : os.freemem(),
        'Current Malloced Memory' : v8.getHeapStatistics().malloced_memory,
        'Peek Malloced Memory' : v8.getHeapStatistics().peak_malloced_memory,
        'Allocated Heap Used (%)' : Math.round((v8.getHeapStatistics().used_heap_size / v8.getHeapStatistics().total_heap_size) * 100),
        'Available Heap Allocation (%)' : Math.round((v8.getHeapStatistics().total_heap_size / v8.getHeapStatistics().heap_size_limit) * 100),
        'UpTime' : os.uptime() + 'Seconds'
    };

    cli.verticalSpace(1);
    cli.horizontalLine();
    cli.centered('SYSTEM STATS');
    cli.horizontalLine();
    cli.verticalSpace(1);

    for(let key in stats) {
        if(stats.hasOwnProperty(key)){
            let value = stats[key];
            let line = '\x1b[33m'+ '    ' + key + '\x1b[0m';
            let padding = 44 - line.length;
            for(let i=0; i<padding; i++){
                line += ' ';
            }
            line += value;
            console.log(line);
            cli.verticalSpace();
        }
    }
    cli.horizontalLine();
    cli.verticalSpace(1);
    _interface.prompt();
};

cli.responders.listUsers = async () => {
   _data.list('users', (err, userIds) => {
        if (!err && userIds.length > 0) {
            cli.verticalSpace();
            userIds.forEach((userId) => {
              _data.read('users', userId, (err, userData) => {
                    if (!err && userData) {
                        let line = 'Name: ' + userData.firstName + ' ' + userData.lastName + ' Phone: ' + userData.phone + ' Checks: ';
                        let numberOfChecks = typeof (userData.checks) == 'object' && userData.checks instanceof Array && userData.checks.length > 0 ? userData.checks.length : 0;
                        line += numberOfChecks;
                        console.log(line);
                        cli.verticalSpace(1);
                        _interface.prompt();
                    } else{
                        console.log('Could not read users');
                        _interface.prompt();
                    }
                });
            });
        } else{
            console.log('Could not list users');
            _interface.prompt();
        }
    });
};

cli.responders.moreUserInfo = (str) => {
    let arr = str.split('--');
    let userId = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
    if(userId){
        _data.read('users',userId,(err,userData)=>{
            if(!err && userData){
                delete userData.hashedPassword;
                cli.verticalSpace();
                console.dir(userData, {'colors' : true});
                cli.verticalSpace(1);
                _interface.prompt();
            } else{
                console.log('User Does not exist');
                _interface.prompt();
            }
        });
    } else{
        console.log('Invalid input with command');
        _interface.prompt();
    }
};

cli.responders.listChecks = (str) => {
    _data.list('checks',(err,checkIds)=>{
        if(!err && checkIds && checkIds.length > 0){
            cli.verticalSpace();
            checkIds.forEach((checkId)=>{
                _data.read('checks',checkId,(err,checkData)=>{
                    if(!err){
                        let lowerString = str.toLowerCase();
                        let state = typeof(checkData.state) == 'string' ? checkData.state : 'down';
                        let stateOrUnknown = typeof(checkData.state) == 'string' ? checkData.state : 'unknown';
                        if(lowerString.indexOf('--'+state) >=0 || (lowerString.indexOf('--up') == -1 && lowerString.indexOf('--down') == -1)){
                            let line = `ID: ${checkData.id} ${checkData.method.toUpperCase()} ${checkData.protocol}://${checkData.url} State: ${stateOrUnknown}`;
                            console.log(line);
                            cli.verticalSpace();
                        }
                        _interface.prompt();
                    } else{
                        console.log('Could not read checks');
                        _interface.prompt();
                    }
                });
            });
        } else{
            console.log('Could not list checks');
            _interface.prompt();
        }
    });
};

cli.responders.moreCheckInfo = (str) => {
    let arr = str.split('--');
    let checkId = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
    if(checkId){
        _data.read('checks',checkId,(err,checkData)=>{
            if(!err && checkData){
                cli.verticalSpace();
                console.dir(checkData, {'colors' : true});
                cli.verticalSpace(1);
                _interface.prompt();
            } else{
                console.log('Check Does not exist');
                _interface.prompt();
            }
        });
    } else{
        console.log('Invalid input with command');
        _interface.prompt();
    }
};

cli.responders.listLogs = () => {
//using child process
    // let ls = childProcess.spawn('ls', ['./.logs/']);
    // ls.stdout.on('data',(dataObject)=>{
    //     let dataStr = dataObject.toString();
    //     let logFileNames = dataStr.split('\n');
    //     cli.verticalSpace();
    //     if(!(logFileNames instanceof Array) || logFileNames.length <= 0){
    //         console.log('No logs to list');
    //         _interface.prompt();
    //     }
    //     logFileNames.forEach((logFileName)=>{
    //         if(typeof(logFileName) == 'string' && logFileName.length > 0 && logFileName.indexOf('-') >= 0){
    //             console.log(logFileName.trim().split('.')[0]);
    //             cli.verticalSpace();
    //         }
    //     });
    //     _interface.prompt();
    // });

// using logs library
    _logs.list(true,(err, logFileNames)=>{
        if(!err && logFileNames && logFileNames.length > 0){
            cli.verticalSpace();
            logFileNames.forEach((logFileName)=>{
                if(logFileName.indexOf('-') >= 0){
                    console.log(logFileName);
                }
            });
            _interface.prompt();
        } else{
            console.log('Could not retrive logs');
            _interface.prompt();
        }
    });
};

cli.responders.moreLogInfo = (str) => {
    let arr = str.split('--');
    let logFileName = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
    if(logFileName){
        cli.verticalSpace();
        _logs.decompress(logFileName,(err,strData)=>{
            if(!err && strData){
                let arr = strData.split('\n');
                arr.forEach((jsonString)=>{
                    let logObject = helpers.parseJsonToObject(jsonString);
                    if(logObject && JSON.stringify(logObject) !== '{}'){
                        console.dir(logObject,{'colors' : true});
                        cli.verticalSpace();
                    }
                });
                _interface.prompt();
            } else{
                console.log('Log not found');
                _interface.prompt();
            }
        });
    } else{
        console.log('Invalid input with command');
        _interface.prompt();
    }
};

cli.processInput = (str) => {
    str = typeof(str) == 'string' && str.trim().length > 0 ? str : false;
    if(str){
        let uniqueInputs = [
            'man',
            'help',
            'exit',
            'stats',
            'list users',
            'more user info',
            'list checks',
            'more check info',
            'list logs',
            'more log info'
        ];

        let matchFound = false;
        uniqueInputs.some((input)=>{
            if(str.toLowerCase().indexOf(input) >= 0){
                matchFound = true;
                e.emit(input,str);
                return true;
            }
        });
        if(!matchFound){
            console.log('Command does not exist');
            _interface.prompt();
        }
    }
};

let _interface = readline.createInterface({
    input : process.stdin,
    output : process.stdout,
    prompt : 'UPTimeMonitor>'
});

cli.init = () => {
    debug('\x1b[34m%s\x1b[0m',"CLI is up and running");

    _interface.prompt();

    _interface.on('line', (str)=>{
        cli.processInput(str);
    });

    _interface.on('close',()=>{
        process.exit(0);
    });
}



module.exports =  cli;