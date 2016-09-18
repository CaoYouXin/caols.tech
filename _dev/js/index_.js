/**
 * Created by cls on 16/9/15.
 */
;(function () {

    if (window === window.top) {

        var cookieScript = document.createElement('script');
        cookieScript.onload = function () {
            var loc = location.href.toString();
            var isProductEnv = 'caols.tech' === document.domain;
            var locPre4Reg = isProductEnv ? '\/' : '\/myblog\/';
            var reg = new RegExp('http:\/\/.*?' + locPre4Reg + '(.*)');
            Cookies.set('url-snapshot', loc.match(reg)[1]);

            location.href = isProductEnv ? '/' : '/myblog/';
        };
        cookieScript.src = '../3rdLib/js.cookie/js.cookie.js';
        document.head.appendChild(cookieScript);

    } else {

        var locationPrefix = window.top.Router.LocationPrefix;

        var promises = [], articles = null, tplFn = null;

        promises.push(new ES6Promise.Promise(function (resolve) {
            nanoajax.ajax({url: locationPrefix + 'articles.json'}, function (code, responseText) {

                if (200 === code) {

                    articles = JSON.parse(responseText);

                    resolve();
                }
            });
        }));

        promises.push(new ES6Promise.Promise(function (resolve) {
            nanoajax.ajax({url: locationPrefix + '_dev/x-handlebars-templates/article_list.html'}, function (code, responseText) {

                if (200 === code) {

                    tplFn = window.top.Handlebars.compile(responseText);

                    resolve();
                }
            });
        }));

        ES6Promise.Promise.all(promises).then(function () {
            var html = tplFn(articles);

            var articleListElem = document.getElementById('article_list');

            articleListElem.innerHTML = html;

            articleListElem.addEventListener('click', function (e) {
                if (e.target.tagName === 'A') {
                    e.preventDefault();

                    var url = e.target.getAttribute('data-rel');

                    window.top.Router.go(url, window.top.PageSlider.go);
                }
            })
        });
    }

})();
