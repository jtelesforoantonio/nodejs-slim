const url = require('url');
const pathToRegexp = require('path-to-regexp');

const route = {};
const routes = [];
const httpVerbs = [
    'get',
    'post',
    'put',
    'delete'
];

httpVerbs.forEach(function (verb) {
    route[verb] = function () {
        let handles = [].slice.call(arguments);
        let keys = [];
        let regexp = pathToRegexp(handles[0], keys);
        routes.push({
            uri: handles[0],
            uriRegexp: regexp,
            keysRegexp: keys,
            method: verb.toUpperCase(),
            action: handles[1]
        });
    };
});

/**
 * Get the uri params.
 *
 * @param {array} keys
 * @param {array} data
 */
function getUriParams(keys, data) {
    let params = [];
    for (let i = 1; i < data.length; i++) {
        let val = data[i];
        if (val !== undefined) {
            params.push(val);
        } else {
            params.push(null);
        }
    }

    return params;
}

route.dispatch = function (req, res) {
    routes.forEach(function (r) {
        let currentUrl = url.parse(req.url);
        let match = r.uriRegexp.exec(currentUrl.pathname);
        if (match && r.method === req.method) {
            let uriParams = getUriParams(r.keysRegexp, match);
            const data = [];
            req.on('data', function (chunk) {
                data.push(chunk);
            });
            req.on('end', function () {
                req.uriParams = uriParams;
                req.rawBody = Buffer.concat(data).toString();
                req.formatBody();
                r.action.apply(null, [req, res].concat(uriParams));
            });
        }
    });
};

exports = module.exports = route;
exports.routes = routes;
