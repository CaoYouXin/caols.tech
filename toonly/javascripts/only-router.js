/**
 * Created by caoyouxin on 3/25/16.
 */
define([], function () {

    var historyStack = [];
    var skip = null;

    window.onpopstate = function (event) {

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
                }, '', url);
                history.pushState(null, '', location.href);

                for (var i = 0; i <= skip; i++) {
                    history.back();
                }

                return;
            }

            historyStack.push(url);
            historyStack.push(null);

            history.pushState(null, '', url);
            history.pushState(null, '', location.href);
            history.back();
        }
    };
});
