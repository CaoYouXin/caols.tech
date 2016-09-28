/**
 * Created by cls on 16/9/27.
 */
;(function (P, rootHref, R, PS) {

    if (document.querySelector('meta[name="post-name"]').getAttribute('cOnly')
        && navigator.userAgent.toLowerCase().match(/ipad|iphone|andriod/)) {
        alert('此页面仅适合在电脑上观看');
        R.go('build/index_.html', PS.go);
    }

})(window.top.ES6Promise.Promise, window.top.Router.rootHref, window.top.Router, window.top.PageSlider);
