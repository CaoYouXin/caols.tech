/**
 * Created by cls on 2016/11/28.
 */
;(function (P, rootHref, R, PS) {

    P.all([
        P.script(document, rootHref + '3rdLib/prism/prism.min.js'),
        P.script(document, rootHref + 'build/js/post.js')
    ]).then(function (values) {
        for (var i = 0, codes = document.getElementsByTagName('code'); i < codes.length; i++) {
            codes[i].innerHTML = window.Prism.highlight(codes[i].innerHTML, window.Prism.languages.javascript);
        }
    });

})(window.top.ES6Promise.Promise, window.top.Router.rootHref, window.top.Router, window.top.PageSlider);
