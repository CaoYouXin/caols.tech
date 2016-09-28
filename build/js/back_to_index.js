/**
 * Created by cls on 16/9/28.
 */
;(function (P, rootHref, R, PS) {

    document.querySelector('div.back-to-index').onclick = function () {
        R.go('build/index_.html', PS.go);
    }

})(window.top.ES6Promise.Promise, window.top.Router.rootHref, window.top.Router, window.top.PageSlider);
