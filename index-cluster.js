const server = require('./lib/server');
const workers = require('./lib/workers');
const cli = require('./lib/cli');
const os = require('os');
const cluster = require('cluster');

let app = {};

app.init = (callback)=>{
    
    if(cluster.isMaster){
        workers.init();
        setTimeout(() => {
            cli.init();
            callback();
        }, 100);
        for(let i=0; i<os.cpus().length;i++){
            cluster.fork();
        }
    } 
    else{
        server.init();        
    }    
};

if(require.main === module){
    app.init(()=>{});
}

module.exports = app;