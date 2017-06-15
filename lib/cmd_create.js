var path = require('path'),
    utils = require('./utils'),
    fse = require('fs-extra'),
    moment = require('moment');

module.exports = function (dir) {
    dir = dir || '.';
    
    fse.mkdirpSync(path.resolve(dir, '_layout'));
    fse.mkdirpSync(path.resolve(dir, '_posts'));
    fse.mkdirpSync(path.resolve(dir, 'assets'));
    fse.mkdirpSync(path.resolve(dir, 'posts'));

    var tplDir = path.resolve(__dirname, '../tpl');
    fse.copySync(tplDir, dir);

    newPost(dir, 'hello, world', '这是我的第一篇文章');

    console.log('OK');
};

function newPost(dir, title, content) {
    var data = [
        '---',
        'title: ' + title,
        'date: ' + moment().format('YYYY-MM-DD'),
        '---',
        '',
        content
    ].join('\n');
    var name = moment().format('YYYY-MM') + '/hello-world.md',
        file = path.resolve(dir, '_posts', name);
    fse.outputFileSync(file, data);
}
