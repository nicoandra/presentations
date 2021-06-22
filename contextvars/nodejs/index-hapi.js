'use strict';
const Hapi = require('@hapi/hapi');
const {log} = require('./console')
const {createExecutionContext, getCurrentContext} = require('./context')

const init = async () => {
    const server = Hapi.server({
        port: 8081,
        host: '0.0.0.0'
    });

    server.ext('onRequest', function (request, h) {
        const userAgent = request.headers['user-agent'] || 'Unknown user agent';
        const username = request.query['username'] || 'Anonymous user';
        const contextId = createExecutionContext(userAgent, username);
        request.contextId = contextId
        return h.continue;
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return 'Hello World, our context is ' + JSON.stringify(getCurrentContext());
        }
    });

    await server.start();
    log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    log(err);
    process.exit(1);
});

init();