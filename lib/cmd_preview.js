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
            var post = parseSourceContent(content.toString());
            post.content = markdownToHTML(post.source);
            post.layout = post.layout || 'post';
            var html = renderFile(path.resolve(dir, '_layout', post.layout
            + '.html'), {post: post});
            // console.log(post);
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

function parseSourceContent (data) {
    var split = '---\n',
        i = data.indexOf(split),
        info = {};
    if (i !== -1) {
        var j = data.indexOf(split, i + split.length);
        if (j !== -1) {
            var str = data.slice(i + split.length, j).trim();
            data = data.slice(j + split.length);
            str.split('\n').forEach(function(line) {
                var i  = line.indexOf(':');
                if (i !== -1) {
                    var name = line.slice(0, i).trim(),
                        value = line.slice(i + 1).trim();
                    info[name] = value;
                }
            });
        }
    }
    info.source = data;
    return info;
}

var swig = require('swig');
swig.setDefaults({cache: false});

function renderFile(file, data) {
    return swig.render(fs.readFileSync(file).toString(), {
        filename: file,
        autoescape: false,
        locals: data
    });
}
