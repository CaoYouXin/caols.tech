/**
 * Created by cls on 16/10/7.
 */
var dsv = require('d3-dsv');
var gutil = require('gulp-util');
var through = require('through-gulp');

module.exports = function (dstDir) {

    var lawAbilityReg = /(?:判断力$)|(?:自我保护能力$)/;
    var abilityReg = /力$/;
    var spiReg = /(?:^非)|(?:^颅)|(?:^预知)|(?:^后瞻)/;

    return through(function (file, encoding, callback) {

        if (file.isStream()) {
            callback(new gutil.PluginError('gulp-survey-compute.js', 'Streaming not supported'));
            return;
        }

        if (file.isBuffer()) {

            var filename = file.path.toString().match(/.*\/(.*?\.csv)/)[1];

            var result = {spi: {}, lawAbility: {}, ability: {}};
            var cached = {};
            function getAvg(key, strValue) {
                var value = parseInt(strValue);
                // if ('想象力' === key) {
                //     console.log(typeof value, value);
                // }
                if (!cached[key]) {
                    cached[key] = {
                        max: value,
                        min: value,
                        total: 0,
                        size: 0
                    };
                } else {
                    var cachedData = cached[key];
                    if (cachedData.max < value) {
                        if (cachedData.max !== cachedData.min) {
                            cachedData.total += cachedData.max;
                            cachedData.size += 1;
                        }
                        cachedData.max = value;
                    } else if (cachedData.min > value) {
                        if (cachedData.max !== cachedData.min) {
                            cachedData.total += cachedData.min;
                            cachedData.size += 1;
                        }
                        cachedData.min = value;
                    } else {
                        cachedData.total += value;
                        cachedData.size += 1;
                    }
                    cached[key] = cachedData;
                }
                // if ('想象力' === key) {
                //     console.log(cached[key]);
                // }
                return cached[key].size === 0 ? 0 : cached[key].total / cached[key].size;
            }

            dsv.csvParse(file.contents.toString(), function (d) {
                for (var keys = Object.keys(d), size = keys.length, i = 0; i < size; i++) {
                    var key = keys[i];
                    if (abilityReg.test(key)) {
                        var resultKey = lawAbilityReg.test(key) ? 'lawAbility' : 'ability';

                        if ('' !== d[key]) {
                            var avg = getAvg(key, d[key]);
                            // if ('想象力' === key) {
                            //     console.log(avg);
                            // }
                            result[resultKey][key] = avg;
                        }
                    } else if (spiReg.test(d[key])) {
                        if (!result.spi[d[key]]) {
                            result.spi[d[key]] = 1;
                        } else {
                            result.spi[d[key]] += 1;
                        }
                    }
                }
            });

            this.push(new gutil.File({
                cwd: '',
                base: '',
                path: dstDir + filename + '.json',
                contents: new Buffer(JSON.stringify(result))
            }));

            //给下一个流
            callback();
        }


        console.log('file not supported @ gulp-survey-compute.js');

    }, function (callback) {

        console.log('well done @ gulp-survey-compute.js');

        callback();
    }, null);
};
