/**
 * Created by cls on 16/9/14.
 */
;(function (P, rootHref, R, PS) {

    P.script(document, rootHref + 'build/js/duoshuo.js');
    P.script(document, rootHref + 'build/js/title.js');

    document.querySelectorAll('p.q').forEach(function (p) {
        p.style.height = p.offsetHeight + 'px';
        p.style.paddingLeft = '0';
    });

    function route(elem, e) {
        if (elem.tagName === 'SECTION' && elem.classList.contains('post-header')) {
            e.preventDefault();

            R.go('build/index_.html', PS.go);
        }
    }

    document.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') {
            if (e.target.getAttribute('target') === '_self') {
                e.preventDefault();

                R.go(e.target.href.toString().match(/(build\/.*\.html)/)[1], PS.go);
            }
        }

        var parentElement = e.target.parentElement;
        if (parentElement.tagName === 'UL' && parentElement.classList.contains('post-drawer-l')) {
            e.target.classList.toggle('active');
        }

        var it = e.target;
        do {
            route(it, e);
        } while (it = it.parentElement);
    });

})(window.top.ES6Promise.Promise, window.top.Router.rootHref, window.top.Router, window.top.PageSlider);
