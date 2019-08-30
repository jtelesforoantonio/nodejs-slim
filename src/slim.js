/**
 * Slim NodeJS
 *
 * @author Jonathan Telesforo Antonio <jonjony777@gmail.com>
 * @copyright 2019 Jonathan Telesforo Antonio
 * @licence MIT
 */
const setPrototypeOf = require('setprototypeof');
const merge = require('merge-descriptors');
const view = require('./view');
const request = require('./request');
const response = require('./response');
const route = require('./route');

const templatesEngines = ['twig'];

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
    this.viewsDir = directory;
};

/**
 * Set template engine.
 *
 * @param {string} engine
 */
slim.setEngine = function (engine) {
    if (templatesEngines.includes(engine)) {
        this.engine = engine;
    } else {
        throw new Error(`${engine} not supported yet`);
    }
};

/**
 * Render a view.
 *
 * @param {string} name
 * @param {object} data
 * @param {function} callback
 */
slim.view = function (name, data, callback) {
    if (name.includes('.')) {
        name = name.replace('.', '/');
    }
    let path = `${this.viewsDir}/${name}.${this.engine}`;
    view.render(path, data, callback);
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
exports.request = request;
exports.response = response;
