/**
 * Created by cls on 16/9/14.
 */
;(function (P, rootHref, R, PS) {

    P.script(document, rootHref + 'build/js/duoshuo.js');
    P.script(document, rootHref + 'build/js/title.js');

    document.querySelectorAll('p.q').forEach(function (p) {
        p.style.height = (p.offsetHeight / 24).toFixed(0) + 'em';
    });

    document.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') {
            if (e.target.getAttribute('target') === '_self') {
                e.preventDefault();

                R.go(e.target.href.toString().match(/(build\/.*\.html)/)[1], PS.go);
            }
        }
    });

})(window.top.ES6Promise.Promise, window.top.Router.rootHref, window.top.Router, window.top.PageSlider);
