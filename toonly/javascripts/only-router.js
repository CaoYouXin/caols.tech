/**
 * Created by caoyouxin on 3/25/16.
 */
define(['require'], function (require) {

    var locationPrefix = '/myblog/';
    var historyStack = [];
    var skip = null;
    var _pageSlide = null;
    function pageSlide() {
        return _pageSlide = _pageSlide || require('toonly/javascripts/only-pageslide');
    }

    window.onpopstate = function (event) {

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
            return false;
        }

        console.log('after: ', historyStack);

        console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));

        pageSlide().go(event.state.url);
    };

    return {
        go: function (url) {

            console.log(url);
            console.log('before: ', historyStack);

            if (url.match(/.*?:\/\/(.*?)\/.*/)) {
                location.href = url;

                return;
            }

            var index = historyStack.indexOf(url);
            if (index !== -1) {

                var skip = historyStack.length - index;

                historyStack.push(null);
                historyStack.push(null);

                history.pushState({
                    skip: skip
                }, url, url);
                history.pushState(null, url, location.href);

                for (var i = 0; i <= skip; i++) {
                    history.back();
                }

                return;
            }

            historyStack.push(url);
            historyStack.push(null);

            history.pushState({
                url: url
            }, url, url);
            history.pushState(null, url, location.href);
            history.back();
        },
        restore: function () {
            var location = document.location.toString();
            localStorage.setItem('urlSnapshot', location.replace(new RegExp('^.*?' + locationPrefix + '(.*?)$'), '$1'));
            localStorage.removeItem('lastTimeData');
            history.replaceState({
                home: true
            }, '', 'index.html');
            history.pushState(null, '', '');
            history.back();
        }
    };
});
