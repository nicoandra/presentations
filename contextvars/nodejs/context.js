const { AsyncLocalStorage } = require('async_hooks');
const asyncLocalStorage = new AsyncLocalStorage();
const { v4: uuidv4 } = require('uuid');

const {log} = require('./console')

const contexts = new Map()

const runWithinContext = (context, callback) => {
    asyncLocalStorage.run(context, () => {
        callback()
    })
}

const getCurrentContext = () => {
    return asyncLocalStorage.getStore();
}
const createExecutionContext = (userAgent, username) => {
    const startedAt = new Date()
    return {userAgent, username, reqId: uuidv4(), startedAt, getExecutionTime: () => {
        return (new Date()) - startedAt;
    }}
}

module.exports = {runWithinContext, createExecutionContext, getCurrentContext}

