'use strict';
const async_hooks = require('async_hooks');
const Hapi = require('@hapi/hapi');
const {log} = require('./console')

const asyncHook = async_hooks.createHook({
    init(asyncId, type, triggerAsyncId, resource) {
        log("Creating a new context", asyncId)
    },
    destroy(asyncId) {
        log("Destroying the context", asyncId)
    }
}).enable()

const init = async () => {
    const server = Hapi.server({
        port: 8081,
        host: '0.0.0.0'
    });


    server.ext('onRequest', function (request, h) {
        log("On Request called")
        return h.continue;
    });


    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            const asyncId = async_hooks.executionAsyncId()
            return 'Hello World, the asyncId is ' + asyncId.toString();
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