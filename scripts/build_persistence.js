const gutil = require('gulp-util');
const through = require('through-gulp');
const mysql = require('mysql');

module.exports = function (options) {

    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'root',
        database : 'infinitely_serve',
        supportBigNumbers: true,
        bigNumberStrings : true
    });

    connection.connect(function(err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }

        console.log('connected as id ' + connection.threadId);
    });

    connection.query('SELECT 100 + 100 AS status', function (error, results, fields) {
        if (error) throw error;
        console.log('connection status : ' + results[0].status);
    });

    connection.query('SELECT * FROM `user`', function (error, results, fields) {
        if (error) throw error;
        // console.log(fields);
        console.log(results);
    });

    var process = {
        "post.json": function (data) {

            console.log('post.json 共 ' + Object.keys(data).length + ' 项.');


        },
        "category.json": function (data) {

            console.log('category.json 共 ' + Object.keys(data).length + ' 项.');
        }
    };

    return through(function (file, encoding, callback) {

        if (file.isStream()) {
            callback(new gutil.PluginError('build_persistence.js', 'Streaming not supported'));
            return;
        }

        var indexOfSlash;
        var filePath = file.path.toString();
        for (var i = filePath.length - 1; i >= 0; i--) {
            if (filePath.charAt(i) === '\/') {
                indexOfSlash = i;
                break;
            }
        }

        var fileName = filePath.substr(indexOfSlash + 1);
        process[fileName](JSON.parse(file.contents.toString()));

        // 给下一个流
        this.push(file);
        callback();

    }, function (callback) {

        connection.end(function(err) {
            // The connection is terminated now
            if (err) {
                console.log('error connecting: ' + err.stack);
            }

            console.log('connection is closed');
        });

        console.log('well done build_persistence.js');
        callback();

    }, null);
};