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
        P.script(rootHref + '3rdLib/store/SimpleStore.js').then(function () {
            store('url-snapshot', loc.match(reg)[1]);

            location.href = rootHref;
        });

    } else {

        var fileName = location.href.toString().match(/\/.*\/(.*)\.htm/)[1];
        var url = rootHref + 'build/js/' + fileName + '.js';
        window.onload = function () {
            P.script(url);
        };
    }

})(window.ES6Promise.Promise);
