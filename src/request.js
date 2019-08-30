const http = require('http');
const url = require('url');
const queryString = require('querystring');
const merge = require('merge-descriptors');

const req = Object.create(http.IncomingMessage.prototype);

/**
 * Format the body inputs
 */
req.formatBody = function () {
    let data = {};
    let query = url.parse(this.url, true).query;
    let body = queryString.parse(this.rawBody);
    data = merge(data, query);
    data = merge(data, body);
    this.body = data;
};

/**
 * Return current inputs.
 *
 * @return {Object}
 */
req.all = function () {
    return this.body || {};
};

/**
 * Return a single value from the current inputs.
 *
 * @param {string} key
 * @param {*} defaultValue
 * @return {*}
 */
req.input = function (key, defaultValue = null) {
    let value = defaultValue;

    if(this.body.hasOwnProperty(key)) value = this.body[key];

    return value;
};

module.exports = req;
