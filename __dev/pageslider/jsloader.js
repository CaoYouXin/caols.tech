/**
 * Created by cls on 16/9/19.
 */
;(function (P) {

    var domain = 'caols.tech';
    var isProductEnv = domain === document.domain;
    var rootHref = isProductEnv ? '/' : '/' + domain + '/';

    var notSupported = document.querySelector('meta[name="not-supported"]');
    var did = false;
    if (notSupported) {

        function myAlert(text) {
            if (!did) {
                did = true;
            } else {
                return;
            }

            // defer
            var defer = (function () {
                var count = 0, limit = 2;

                function doSth() {
                    alert(text);
                }

                return {
                    resolve: function () {
                        if (++count >= limit) {
                            doSth();
                        }
                    }
                }
            })();

            // blur everything
            var _onLoad = window.onload || function () {

                };
            window.onload = function () {
                _onLoad();
                for (var it = document.body.firstElementChild; !!it; it = it.nextElementSibling) {
                    it.style.webkitFilter = 'blur(10px)';
                    it.style.filter = 'blur(10px)';
                }
                defer.resolve();
            };

            // add alert
            setTimeout(function () {
                defer.resolve();
            }, 1000);
        }

        var noSupportedDetails = notSupported.getAttribute('content');
        var array = noSupportedDetails.split(';');
        for (var i = 0, size = array.length; i < size; i++) {
            var kv = array[i].split('=');
            if ('max-width' === kv[0]) {
                if (((window.innerWidth > 0) ? window.innerWidth : screen.width) <= parseInt(kv[1])) {
                    myAlert('屏幕太窄，暂时无法提供支持');
                }
            } else if ('browser-type' === kv[0]) {
                var notSupportedBrowsers = kv[1].split(',');
                for (var j = 0, aSize = notSupportedBrowsers.length; j < aSize; j++) {
                    if (navigator.userAgent.toLowerCase().indexOf(notSupportedBrowsers[j]) > -1) {
                        myAlert('暂时无法提供对该浏览器支持');
                    }
                }
            }
        }
    }

    if (!did && window === window.top) {

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

    } else if (!did) {

        var fileName = location.href.toString().match(/build\/(.*)\.htm/)[1];
        var url = rootHref + 'build/js/' + fileName + '.js';

        P.all([
            new P(function (resolve) {
                var _onload = window.onload || function () {

                    };
                window.onload = function () {
                    _onload();
                    resolve();
                };
            }),
            P.script(document, rootHref + '3rdLib/polyfill/polyfill.js')
        ]).then(function () {
            P.script(document, url)
        });


    }

})((window.top.ES6Promise || {Promise: null}).Promise);
