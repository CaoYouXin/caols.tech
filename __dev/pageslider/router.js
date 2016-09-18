/**
 * Created by cls on 16/9/14.
 */
;(function () {

    var locationPrefix = 'caols.tech' === document.domain ? '/' : '/myblog/';

    var handlers = {}, historyStack = [], skip = null;

    function ops(event) {
        if (event.state && event.state.home) {
            location.reload();
            return false;
        }

        historyStack.reverse();
        historyStack.shift();
        historyStack.reverse();

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
        LocationPrefix: locationPrefix,
        go: function (url, cb) {

            if (url.match(/.*?:\/\/(.*?)\/.*/)) {
                location.href = url;

                return;
            }

            if (!url.match(new RegExp('^\\' + locationPrefix))) {
                url = locationPrefix + url;
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

                history.back();
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
            history.back();
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

                if (url.indexOf(locationPrefix) === -1) {
                    urls[i] = locationPrefix + url;
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
