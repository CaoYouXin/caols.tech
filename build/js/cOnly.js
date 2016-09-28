/**
 * Created by cls on 16/9/27.
 */
;(function (P, rootHref, R, PS) {

    function showAlert(cb) {
        document.querySelector('.alert').style.visibility = 'visible';

        document.querySelector('.alert button').onclick = cb;
    }

    if (document.querySelector('meta[name="post-name"]').getAttribute('cOnly')
        && navigator.userAgent.toLowerCase().match(/ipad|iphone|andriod/)) {
        showAlert(function () {
            document.body.style.filter = 'blur(0)';
            R.go('build/index_.html', PS.go);
        });
    }

})(window.top.ES6Promise.Promise, window.top.Router.rootHref, window.top.Router, window.top.PageSlider);
