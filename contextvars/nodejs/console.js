const util = require('util');

module.exports.log = (...args) => {
    // Use a function like this one when debugging inside an AsyncHooks callback
    // process.stdout.writeSync(`${util.format(...args)}\n`);
}