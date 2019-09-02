/**
 * Slim NodeJS
 *
 * @author Jonathan Telesforo Antonio <jonjony777@gmail.com>
 * @copyright 2019 Jonathan Telesforo Antonio
 * @licence MIT
 */
const setPrototypeOf = require('setprototypeof');
const merge = require('merge-descriptors');
const request = require('./request');
const response = require('./response');
const route = require('./route');
const view = require('./view');

/**
 * Slim app.
 *
 * @type {object}
 */
const slim = {};

/**
 * Set views directory.
 *
 * @param {string} directory
 */
slim.setViewsDir = function (directory) {
    view.setViewsDir(directory);
};

/**
 * Set template engine.
 *
 * @param {string} engine
 */
slim.setEngine = function (engine) {
    view.setEngine(engine);
};

/**
 * Init application.
 *
 * @returns {app}
 */
function init() {
    const app = function (req, res) {
        req.app = app;
        res.app = app;
        setPrototypeOf(req, request);
        setPrototypeOf(res, response);
        route.dispatch(req, res);
    };
    merge(app, slim, false);

    return app;
}

exports = module.exports = init;
exports.route = route;
