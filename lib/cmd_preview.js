var express = require('express'),
    path = require('path')
utils = require('./utils');

module.exports = function (dir) {
    dir = dir || '.';

    var app = express(),
        router = express.Router();
    app.use('/assets', express.static(path.resolve(dir, 'assets')));
    app.use(router);

    router.get('/posts/*', function (req, res, next) {
        var name = utils.stripExtname(req.params[0]),
            file = path.resolve(dir, '_posts', name + '.md'),
            html = utils.renderPost(dir, file);

        res.writeHead(200,
            { 'Content-Type': 'text/html;charset=utf-8' });
        res.end(html);
    });

    router.get('/', function (req, res, next) {
        var html = utils.renderIndex(dir);
        res.end(html);
    });

    app.listen(3000);
};
