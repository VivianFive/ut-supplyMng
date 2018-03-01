'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    BASE_API: '"http://data.bestkeep.cn:8080/freight"',
    // BASE_API: '"http://192.168.50.47:8080/freight"'
})
