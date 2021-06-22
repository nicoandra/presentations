const fs = require('fs');
const util = require('util');

module.exports.log = (...args) => {
    /* 
    
    Use a function like this one when debugging inside an AsyncHooks callback

    This is a recommendation from the official Node documentation, it happens that
    console.log is an asynchronous operation and as such it would trigger a
    context creation again, causing the system to enter in an infinite loop.

    There are multiple ways to avoid this problem, writing synchronously to StdOut is
    a simple solution that works for most cases.
    */
    fs.writeFileSync(1, `${util.format(...args)}\n`, { flag: 'a' });
    
  }