'use strict';

module.exports = function merge(obj, mergeObj, optKey) {
    function isObject(obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    }

    function isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }

    for (var keys = Object.keys(mergeObj), k = 0;
         k < keys.length; k++) {
        var key = keys[k];
        var _o = obj[key];
        var _m = mergeObj[key];
        if (!!_o) {
            if (isArray(_o) && isArray(_m)) {
                _m.forEach(function(m) {
                    _o.push(m);
                });
            } else if (isObject(_o) && isArray(_m)) {
                _m.forEach(function(m) {
                    var _key = m[optKey];
                    delete m[optKey];
                    if (!!_o[_key]) {
                        merge(_o[_key], m, optKey);
                    } else {
                        _o[_key] = m;
                    }
                });
            } else if (isObject(_o) && isObject(_m)) {
                merge(_o, _m, optKey);
            } else if (isArray(_o) && isObject(_m)) {
                for (var _keys = Object.keys(_m), i = 0;
                     i < _keys.length; i++) {
                    var _key = _keys[i];
                    var m = _m[_key];
                    m[optKey] = _key;
                    _o.push(m);
                }
            }
        } else {
            obj[key] = _m;
        }
    }
};