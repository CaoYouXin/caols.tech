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
            window.top.require(['handlebars', 'toonly/javascripts/only-router'], function (Handlebars, router) {

                $.getJSON('articles.json', function (data) {

                    $.get('toonly/x-handlebars-templates/article_list.html', function (tpl) {
                        var tplFn = Handlebars.compile(tpl);
                        var html = tplFn(data);

                        var $articleList = $('#article_list');

                        $articleList.html(html);

                        $articleList.on('click', 'a', function (event) {
                            event.preventDefault();

                            var url = $(this).attr('data-rel');
                            router.go(url);
                        });
                    });
                });
            });
        });
    });
}
