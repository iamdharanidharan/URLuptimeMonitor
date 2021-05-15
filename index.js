const server = require('./lib/server');
const workers = require('./lib/workers');
const cli = require('./lib/cli');

let app = {};

app.init = (callback)=>{
    server.init();
    workers.init();

    setTimeout(() => {
        cli.init();
        callback();
    }, 100);
};

if(require.main === module){
    app.init(()=>{});
}

module.exports = app;