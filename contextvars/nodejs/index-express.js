'use strict';
const express = require('express')
const app = express()
const {log} = require('./console')
const {runWithinContext, createExecutionContext, getCurrentContext} = require('./context')
const { pretendSqlQueryPromise, pretendSqlQueryCallback } = require('./database')

app.use((req, res, next)=>{
    const userAgent = req.headers['user-agent'] || 'Unknown user agent';
    const username = req.query['username'] || 'Anonymous user';
    const executionContext = createExecutionContext(userAgent, username);
    runWithinContext(executionContext, () => next())
})

app.get('/', function (req, res) {
    res.send('Hello World, the context is ' + JSON.stringify(getCurrentContext()))
})

app.get('/async/:someParam', async function (req, res) {
    const queryResult = await pretendSqlQueryPromise(req.someParam)
    const timeItTook = getCurrentContext().getExecutionTime()
    res.send({queryResult, timeItTook})
})

app.get('/callback/:someParam', async function (req, res) {
    pretendSqlQueryCallback(req.someParam, (err, queryResult) => {
        const timeItTook = getCurrentContext().getExecutionTime()

        res.send({queryResult, timeItTook})
    })
})

app.listen(8081)
