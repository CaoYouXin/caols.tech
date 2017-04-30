/**
 * Created by cls on 2017/4/30.
 */
;(function (g) {

    g.handlers = g.handlers || {};

    g.handlers.drawClicked = function (e) {
        e.target.classList.toggle('active');
    };

})(window);
