/**
 * Created by caoyouxin on 4/1/16.
 */
if (window === window.top) {
    require(['toonly/javascripts/only-router'], function (router) {
        router.restore();
    });
} else {

    require(['jquery'], function ($) {
        $(function () {
            window.top.require(['toonly/javascripts/only-router'], function (router) {

                $('section.blog-header span').click(function (event) {
                    event.preventDefault();

                    router.go('index_.html');
                });
            });
        });
    });
}
