let environments = {};

environments.dev = {
    'httpPort' : 3000,
    'httpsPort' : 3001,
    'envName' : 'dev',
    'hashingSecret' : '', //your hash key here
    'maxChecks' : 5,
    'Twilio' : {
        'accountSid' : '', // Twilio development account Sid
        'authToken' : '',  // Twilio development auth token
        'fromPhone' : ''   // Twilio development phone number
    },
    'templateGlobals' : {
        'appName' : 'Uptime Monitor',
        'companyName' : 'Dharanidharan.Me',
        'yearCreated' : '2021',
        'baseUrl' : 'http://localhost:3000/'
    }
};

environments.testing = {
    'httpPort' : 4000,
    'httpsPort' : 4001,
    'envName' : 'testing',
    'hashingSecret' : '', //your hash key here
    'maxChecks' : 5,
    'Twilio' : {
        'accountSid' : '', // Twilio account Sid
        'authToken' : '',  // Twilio auth token
        'fromPhone' : ''   // Twilio phone number
    },
    'templateGlobals' : {
        'appName' : 'Uptime Monitor',
        'companyName' : 'Dharanidharan.Me',
        'yearCreated' : '2021',
        'baseUrl' : 'http://localhost:3000/'
    }
};

environments.production = {
    'httpPort' : 5000,
    'httpsPort' : 5001,
    'envName' : 'production',
    'hashingSecret' : '', //your hash key here
    'maxChecks' : 5,
    'Twilio' : {
        'accountSid' : '', // Twilio production account Sid
        'authToken' : '',  // Twilio production auth token
        'fromPhone' : ''   // Twilio production phone number
    },
    'templateGlobals' : {
        'appName' : 'Uptime Monitor',
        'companyName' : 'Dharanidharan.Me',
        'yearCreated' : '2021',
        'baseUrl' : 'http://localhost:5000/'
    }
};

let currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

let environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.dev;

module.exports = environmentToExport;