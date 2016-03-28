/**
 * Created by caoyouxin on 3/25/16.
 */
define([], function () {

    var historyStack = [];
    var skip = null;

    window.onpopstate = function (event) {

        if (event.state.skip) {
            skip = event.state.skip;
        }

        if (skip > 0) {
            skip--;
            return false;
        }

        console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
        $('#data').html(location.href);
    };

    return {
        go: function (url) {

            if (url.indexOf(location.href.match(/.*?:\/\/(.*?)\//)[1]) === -1) {
                open(url);

                return;
            }

            var index = historyStack.indexOf(url);
            if (index !== -1) {
                var skip = historyStack.length - index;

                historyStack.splice(index + 1, skip - 1);

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
            history.pushState(null, '', url);
            history.pushState(null, '', location.href);
            history.back();
        }
    };
});
