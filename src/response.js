const http = require('http');

/**
 * Request.
 *
 * @type {http.ServerResponse}
 */
const res = Object.create(http.ServerResponse.prototype);

/**
 * Render a view.
 *
 * @param {string} view
 * @param {object} data
 * @param {function} callback
 */
res.view = function (view, data, callback) {
    const self = this;
    let fn = callback || function(err, chunk) {
        if (err) throw err;
        self.end(chunk, 'utf8');
    };
    if (typeof fn !== 'function') {
        throw new TypeError('callback function required');
    }
    this.app.view(view, data, fn);
};

module.exports = res;
