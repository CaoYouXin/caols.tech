/**
 * Created by cls on 16/9/19.
 */
;(function (P, A) {

    P.getJSON = function (url) {
        return new P(function (resolve) {
            A.ajax({url: url}, function (code, responseText) {

                if (200 === code) {

                    resolve(JSON.parse(responseText));
                }
            });
        });
    };

    P.ajax = function (url) {
        return new P(function (resolve) {
            A.ajax({url: url}, function (code, responseText) {

                if (200 === code) {

                    resolve(responseText);
                }
            });
        });
    };

    P.script = function (url, id) {
        return new P(function (resolve) {
            var elem = document.getElementById(id);

            if (elem) {

                resolve();
            } else {

                var script = document.createElement('script');
                script.onload = function () {
                    resolve()
                };
                script.src = url;
                document.head.appendChild(script);
            }
        })
    }

})(window.ES6Promise.Promise, window.nanoajax);