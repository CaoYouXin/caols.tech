/**
 * Created by cls on 16/9/19.
 */
;(function (global, P, A) {

    global.P = P;

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

    P.script = function (doc, url, id) {
        return new P(function (resolve) {
            var elem = doc.getElementById(id);

            if (elem) {

                resolve();
            } else {

                var script = doc.createElement('script');
                script.onload = function () {
                    resolve();
                };
                script.src = url;
                doc.head.appendChild(script);
            }
        });
    };

    P.append = function append(element, htmldata) {
        var e = document.createElement('div');
        e.innerHTML = htmldata;

        while(e.firstChild) {
            element.appendChild(e.firstChild);
        }
    };

    P.misc = function(str) {
        return str;
    }

})(window, window.ES6Promise.Promise, window.nanoajax);
