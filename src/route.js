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
            name: this.routeName,
            uriRegexp: regexp,
            keysRegexp: keys,
            method: verb.toUpperCase(),
            action: handles[1]
        });

        return this;
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

/**
 * Set route name.
 *
 * @param name
 */
route.name = function (name) {
    routes[routes.length - 1]['name'] = name;
};

route.dispatch = function (req, res) {
    const data = [];
    const currentUrl = url.parse(req.url);
    let currentMethod = req.method;

    req.on('data', function (chunk) {
        data.push(chunk);
    });

    req.on('end', function () {
        req.rawBody = Buffer.concat(data).toString();
        req.formatBody();
        let otherMethod = req.input('_method');
        if (otherMethod != null) {
            currentMethod = otherMethod.toUpperCase();
        }
        routes.forEach(function (r) {
            let match = r.uriRegexp.exec(currentUrl.pathname);
            if (match && r.method === currentMethod) {
                req.uriParams = getUriParams(r.keysRegexp, match);
                r.action.apply(null, [req, res].concat(req.uriParams));
            }
        });
    });
};

exports = module.exports = route;
exports.routes = routes;
