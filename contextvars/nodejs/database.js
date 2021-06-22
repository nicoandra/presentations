const { getCurrentContext } = require('./context')

const pretendSqlQueryPromise = async (someParam) => {
    return new Promise((ok, ko) => {
        setTimeout(() => { return ok({result: someParam, context: getCurrentContext()})}, 300)
    })
}

const pretendSqlQueryCallback = async (someParam, callback) => {
    setTimeout(() => {
        callback(null, {result: someParam, context: getCurrentContext()})
    }, 300)
}

module.exports = {pretendSqlQueryCallback, pretendSqlQueryPromise}