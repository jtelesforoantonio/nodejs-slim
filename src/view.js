const fs = require('fs');
const path = require('path');

const view = {};

/**
 * Render a view.
 *
 * @param {string} path
 * @param {object} data
 * @param {function} callback
 */
view.render = function (path, data, callback) {
    let fileInfo = getFileInfo(path);
    if(fileInfo.isFile()) {
        switch (fileInfo.extname) {
            case '.twig':
                require('twig').renderFile(path, data, callback);
                break;
            default:
                throw new Error('engine not supported');
        }
    } else {
        throw new Error(`${path} is not a file`);
    }
};

/**
 * Get file stat.
 *
 * @param {string} file
 * @returns {Stats}
 */
function getFileInfo(file) {
    try {
        let fileInfo = fs.statSync(file);
        fileInfo.extname = path.extname(file);
        return fileInfo;
    } catch (e) {
        throw e;
    }
}

module.exports = view;
