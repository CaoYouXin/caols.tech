/**
 * Created by cls on 16/9/25.
 */
;(function () {

    document.body.style.zoom = window.screen.availWidth /document.body.offsetWidth;

    var _onload = window.onload;
    window.onload = function () {
        _onload();
        document.body.style.filter = 'blur(0)';
    }

})();
