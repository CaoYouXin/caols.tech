/**
 * Created by caoyouxin on 4/1/16.
 */
require(['jquery'], function ($) {
    $(function () {
        require(['toonly/javascripts/only-pageslide', 'toonly/javascripts/only-router'], function (pageSlide, router) {
            var urlSnapshot = pageSlide.init();
            router.go(urlSnapshot ? urlSnapshot : 'index_.html');
        });
    });
});
