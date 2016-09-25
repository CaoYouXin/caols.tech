/**
 * Created by cls on 16/9/14.
 */
;(function () {

    var domain = 'caols.tech';
    var isProductEnv = domain === document.domain;
    var rootHref = isProductEnv ? '/' : '/' + domain + '/';

    var handlers = {}, historyStack = [], skip = null;

    function ops(event) {

        historyStack = historyStack.reverse();
        historyStack.shift();
        historyStack = historyStack.reverse();

        if (event.state && event.state.skip) {
            skip = event.state.skip;
        }

        if (skip > 0) {
            skip--;
            history.back();
            return false;
        }

        var handlerMd5 = event.state.handler;
        if (handlerMd5 && handlers[handlerMd5]) {
            handlers[handlerMd5](event.state.url);
        }
    }

    window.onpopstate = ops;

    window.Router = {
        rootHref: rootHref,
        go: function (url, cb) {

            if (url.match(/.*?:\/\/(.*?)\/.*/)) {
                location.href = url;

                return;
            }

            if (!url.match(new RegExp('^\\' + rootHref))) {
                url = rootHref + url;
            }

            var index = historyStack.indexOf(url);
            if (index !== -1) {

                var skip = historyStack.length - index;

                historyStack.push(null);
                historyStack.push(null);

                history.pushState({
                    skip: skip
                }, '', url);
                history.pushState(null, '', location.href);

                setTimeout(function () {
                    history.back();
                }, 1);
                return;
            }

            historyStack.push(url);
            historyStack.push(null);

            var handlerMd5 = md5(cb.toString());
            handlers[handlerMd5] = cb;

            history.pushState({
                handler: handlerMd5,
                url: url
            }, '', url);
            history.pushState(null, '', location.href);
            setTimeout(function () {
                history.back();
            }, 1);
        },
        init: function (urls, cb) {

            var i, url;

            var handlerMd5 = md5(cb.toString());
            handlers[handlerMd5] = cb;

            for (i = 0; i < urls.length; i++) {
                url = urls[i];
                if (url.match(/.*?:\/\/(.*?)\/.*/)) {
                    alert('urls incorrect!');

                    return;
                }

                if (url.indexOf(rootHref) === -1) {
                    urls[i] = rootHref + url;
                }

                historyStack.push(url);

                history.pushState({
                    handler: handlerMd5,
                    url: url
                }, '', url);
            }

            historyStack.push(null);
            history.pushState(null, '', location.href);

            history.back();
        }
    };

})();
