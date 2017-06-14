var express = require('express'),
    MarkdownIt = require('markdown-it'),
    md = new MarkdownIt({
        html: true,
        langPrefix: 'code-'
    }),
    path = require('path'),
    fs = require('fs');

module.exports = function (dir) {
    dir = dir || '.';

    var app = express(),
        router = express.Router();
    app.use('/assets', express.static(path.resolve(dir, 'assets')));
    app.use(router);

    router.get('/posts/*', function (req, res, next) {
        var name = stripExtname(req.params[0]),
            file = path.resolve(dir, '_posts', name + '.md');
        fs.readFile(file, function (err, content) {
            if (err) return next(err);
            var html = markdownToHTML(content.toString());
            res.writeHead(200, 
                {'Content-Type':'text/html;charset=utf-8'});
            res.end(html);
        });
    });

    router.get('/', function (req, res, next) {
        res.end('articles list');
    });

    app.listen(3000);
};

function stripExtname (name) {
    var i = 0 - path.extname(name).length;
    if (i === 0) i = name.length;
    return name.slice(0, i);
}

function markdownToHTML (content) {
    return md.render(content || '');
}
