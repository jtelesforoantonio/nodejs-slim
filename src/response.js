const http = require('http');
const pathToRegexp = require('path-to-regexp');
const route = require('./route');
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
    let fn = callback || function (err, chunk) {
        if (err) throw err;
        self.end(chunk, 'utf8');
    };
    if (typeof fn !== 'function') {
        throw new TypeError('callback function required');
    }

    view.render(name, data, fn);
};

/**
 * Redirect.
 *
 * @param url
 */
res.redirect = function (url) {
    this.writeHead(302, {Location: url});
    this.end();
};

/**
 * Redirect by route name.
 *
 * @param {string} name
 * @param {array} params
 */
res.route = function (name, params) {
    let position = -1;
    route.routes.some(function (element, index) {
        if (element.name === name) {
            position = index;
            return true;
        }

        return false;
    });

    if (position > -1) {
        let nextRoute = route.routes[position];
        let keys = nextRoute.keysRegexp;
        let compile = pathToRegexp.compile(nextRoute.uri);
        let values = {};
        for (let i = 0; i < keys.length; i++) {
            values[keys[i].name] = params[i];
        }
        let uri = compile(values);
        this.redirect(uri);
    } else {
        throw new Error(`the route ${name} not exists`);
    }
};

module.exports = res;
