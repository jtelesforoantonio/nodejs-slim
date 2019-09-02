const http = require('http');
const view = require('./view');

/**
 * Request.
 *
 * @type {http.ServerResponse}
 */
const res = Object.create(http.ServerResponse.prototype);

/**
 * Render a view.
 *
 * @param {string} name
 * @param {object} data
 * @param {function} callback
 */
res.view = function (name, data, callback) {
    const self = this;
    let fn = callback || function(err, chunk) {
        if (err) throw err;
        self.end(chunk, 'utf8');
    };
    if (typeof fn !== 'function') {
        throw new TypeError('callback function required');
    }

    view.render(name, data, fn);
};

module.exports = res;
