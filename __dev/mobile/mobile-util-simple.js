/**
 * Created by cls on 16/9/25.
 */
;(function () {

    document.body.style.zoom = window.innerWidth / document.body.offsetWidth;

    var _onload = window.onload || function () {
            
        };
    window.onload = function () {
        _onload();
        document.body.style.filter = 'blur(0)';
    }

})();
