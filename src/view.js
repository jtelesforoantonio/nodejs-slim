const fs = require('fs');
const path = require('path');

/**
 * Engines available.
 *
 * @type {*[]}
 */
const templatesEngines = ['twig', 'hbs', 'pug'];

/**
 * View.
 *
 * @type {{}}
 */
const view = {};

/**
 * Set views directory.
 *
 * @param {string} directory
 */
view.setViewsDir = function (directory) {
    this.viewsDir = directory;
};

/**
 * Set template engine.
 *
 * @param {string} engine
 */
view.setEngine = function (engine) {
    if (templatesEngines.includes(engine)) {
        this.engine = engine;
    } else {
        throw new Error(`${engine} not supported yet`);
    }
};

/**
 * Return the full path of a view.
 *
 * @param {string} name
 * @return {string}
 */
view.generatePath = function (name) {
    if (name.includes('.')) {
        name = name.replace('.', '/');
    }

    return `${this.viewsDir}/${name}.${this.engine}`;
};

/**
 * Get file stat.
 *
 * @param {string} file
 * @returns {Stats}
 */
view.getFileInfo = function (file) {
    try {
        let fileInfo = fs.statSync(file);
        fileInfo.extname = path.extname(file);
        return fileInfo;
    } catch (e) {
        throw e;
    }
};

/**
 * Render Handlebar template.
 * @param path
 * @param data
 * @param callback
 */
view.renderHbsTemplate = function (path, data, callback) {
    let err = undefined;
    let html = undefined;
    try {
        const handlebars = require('handlebars');
        let viewSource = fs.readFileSync(path, {encoding: 'utf8'});
        let viewCompile = handlebars.compile(viewSource);
        html = viewCompile(data);
        let layoutPath = `${this.viewsDir}/template.${this.engine}`;
        if (fs.existsSync(layoutPath)) {
            let layoutSource = fs.readFileSync(layoutPath, {encoding: 'utf8'});
            let layoutCompile = handlebars.compile(layoutSource);
            let layoutData = {
                body: html,
                ...data
            };
            html = layoutCompile(layoutData);
        }
    } catch (e) {
        err = e.message;
    }
    callback.call(null, err, html);
};

/**
 * Render Pug template.
 *
 * @param path
 * @param data
 * @param callback
 */
view.renderPugTemplate = function (path, data, callback) {
    let err = undefined;
    let html = undefined;
    try {
        const pug = require('pug');
        let viewCompile = pug.compileFile(path);
        html = viewCompile(data);
    } catch (e) {
        err = e.message;
    }
    callback.call(null, err, html);
};

/**
 * Render a view.
 *
 * @param {string} name
 * @param {object} data
 * @param {function} callback
 */
view.render = function (name, data, callback) {
    let path = this.generatePath(name);
    let fileInfo = this.getFileInfo(path);
    if (fileInfo.isFile()) {
        switch (fileInfo.extname) {
            case '.twig':
                require('twig').renderFile(path, data, callback);
                break;
            case '.hbs':
                this.renderHbsTemplate(path, data, callback);
                break;
            case '.pug':
                this.renderPugTemplate(path, data, callback);
                break;
            default:
                throw new Error('engine not supported');
        }
    } else {
        throw new Error(`${path} is not a file`);
    }
};

module.exports = view;
