# Slim Node.js

Slim is a example of a micro framework for node.js 

## Installation
```shell
npm i @jtelesforoantonio/nodejs-slim --save
```

## Usage

Create new app.
```javascript
const http = require('http');
const slim = require('@jtelesforoantonio/nodejs-slim');

const app = slim();
const route = slim.route;
```

## Routes

Use the http verbs GET, POST, PUT, DELETE to create routes.
```javascript
route.get('/', function(req, res) {
    res.end();
});

route.post('/', function(req, res) {
    res.end();
});

route.put('/', function(req, res) {
    res.end();
});

route.delete('/', function(req, res) {
    res.end();
});
```

For uri params you can use (:param) and in the callback get it, if the param is optional use (:param?).
```javascript
route.get('/users/:id', function(req, res, id) {
    res.write(`The user id is ${id}`);
    res.end();
});

route.get('/users/:userId/posts/:postId', function(req, res, userId, postId) {
    res.write(`The user id is ${userId} and the post id is ${postId}`);
    res.end();  
});

//optional param, if it not exists the value will be null
route.get('users/:id?', function(req, res, id) {
    if(id != null) {
        res.write(`The user id is ${id}`);
    } else {
        res.write('The user not exists');
    }
    res.end();
});
```

## Views

You can use Twig or Handlebars for templates
```shell
npm install twig --save
npm install handlebars --save
```

Set the config for use twig.
```javascript
//to use Twig engine
app.setEngine('twig');

//to use handlebars
app.setEngine('hbs');

app.setViewsDir('./path_to_views_directory');
```

Render a view, the first param is the view name and the second is the data,
you can use dot notation for nested views
```javascript
route.get('/user/:name', function(req, res, name) {
    let data = { name: name };
    res.view('view', data);
});

route.get('/user/:name', function(req, res, name) {
    let data = { name: name };
    res.view('users.detail', data);
});
```

## Request

The request param has two functions req.all() and req.input() to get the data
```javascript
route.post('/users', function(req, res) {
    // get all data
    let allData = req.all();
    // get a specific value, the first parameter is the key name and the second(optional) is the default value,
    // the default value will be return if the key not exists otherwise null
    let value = req.input('key', 'default_value');  
});
```

## Run App

Finally create a server.
```javascript
const server = http.createServer(app);
server.listen(3000);
```
