/**
 * Created by cls on 16/9/19.
 */
;(function (P) {

    var domain = 'caols.tech';
    var isProductEnv = domain === document.domain;
    var rootHref = isProductEnv ? '/' : '/' + domain + '/';

    if (window === window.top) {

        var loc = location.href.toString();
        var locPre4Reg = isProductEnv ? '\/' : '\/' + domain + '\/';
        var reg = new RegExp('http:\/\/.*?' + locPre4Reg + '(.*)');

        var script = document.createElement('script');
        script.src = rootHref + '3rdLib/store/SimpleStore.js';
        script.onload = function () {
            store('url-snapshot', loc.match(reg)[1]);

            location.href = rootHref;
        };
        document.head.appendChild(script);

    } else {

        var fileName = location.href.toString().match(/build\/(.*)\.htm/)[1];
        var url = rootHref + 'build/js/' + fileName + '.js';
        var _onload = window.onload || function () {

            };
        window.onload = function () {
            _onload();
            P.script(document, url);
        };
    }

})((window.top.ES6Promise || {Promise: null}).Promise);
