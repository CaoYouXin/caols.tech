/**
 * Created by cls on 16/9/14.
 */
;(function (P, rootHref, R, PS) {

    P.script(document, rootHref + 'build/js/duoshuo.js');
    P.script(document, rootHref + 'build/js/title.js');

    function route(elem, e) {
        if (elem.tagName === 'SECTION' && elem.classList.contains('post-header')) {
            e.preventDefault();

            R.go('build/index_.html', PS.go);
        }
    }

    var _timestamp = 0;
    function eventHandler(e) {
        var timestamp = new Date().getTime();
        if (Math.abs(_timestamp - timestamp) < 400) {
            return true;
        }
        _timestamp = timestamp;

        if (e.target.tagName === 'A') {
            if (e.target.getAttribute('target') === '_self') {
                e.preventDefault();

                R.go(e.target.href.toString().match(/(build\/.*\.html)/)[1], PS.go);
            }
        }

        var parentElement = e.target.parentElement;
        if (parentElement.tagName === 'UL' && parentElement.classList.contains('post-drawer-l')) {
            e.preventDefault();

            e.target.classList.toggle('active');
        }

        var it = e.target;
        do {
            route(it, e);
        } while (it = it.parentElement);
    }

    document.addEventListener('touchend', eventHandler);
    document.addEventListener('click', eventHandler);

    (Array.from(document.querySelectorAll('p.q')) || []).forEach(function (p) {
        p.style.height = p.offsetHeight + 'px';
        p.style.paddingLeft = '0';
    });

    var elem = document.getElementsByClassName('post-content');
    if (elem.length) {
        var before = document.createElement('div');
        before.classList.add('content');
        before.style.backgroundImage = 'url("../../images/content-bg/paper-up-1.png")';
        before.style.height = '151px';
        document.body.insertBefore(before, elem[0]);

        var after = document.createElement('div');
        after.classList.add('content');
        after.style.backgroundImage = 'url("../../images/content-bg/paper-down-1.png")';
        after.style.height = '115px';
        document.body.insertBefore(after, elem[0].nextElementSibling);
    }

})(window.top.ES6Promise.Promise, window.top.Router.rootHref, window.top.Router, window.top.PageSlider);
