/**
 * Created by caoyouxin on 3/29/16.
 */
define(['jquery', 'handlebars'], function ($, handlebars) {

    var urlStack = [], curX = 0;
    var pageslideTplFn = handlebars.compile('{{#each this}}<li class="pageslide"><iframe src="{{this}}" frameborder="0"></iframe></li>{{/each}}');
    var controlsTplFn = handlebars.compile('<a href="#" id="left" style="position: fixed;z-index: 999999999;left: 0;bottom: 0;padding: 10px;border-radius: 10px;">左</a>' +
        '<a href="#" id="right" style="position: fixed;z-index: 999999999;right: 0;bottom: 0;padding: 10px;border-radius: 10px;">右</a>');

    $('body').append(controlsTplFn());
    $('ul.pageslides').css('transform', 'translateX(' + (curX += $(window).width()) + 'px)');

    function genEqualFn(url) {
        return function (item) {
            return url === item;
        }
    }

    return {
        init: function () {
            var $ul = $('ul.pageslides');

            $ul.html(pageslideTplFn(urlStack));

            var windowWidth = $(window).width();
            var $lis = $ul.children('li.pageslide');
            var ulWidth = windowWidth * $lis.length;
            $lis.width(windowWidth);
            $ul.width(ulWidth);

            $('#left').click(function () {
                if (curX <= (0 - ulWidth + windowWidth)) {
                    return false;
                }
                $ul.css('transform', 'translateX(' + (curX -= windowWidth) + 'px)');
            });

            $('#right').click(function () {
                if (curX >= 0) {
                    return false;
                }
                $ul.css('transform', 'translateX(' + (curX += windowWidth) + 'px)');
            });
        },
        go: function (url) {
            var hasUrl = urlStack.some(genEqualFn(url));
            if (hasUrl) {
                var indexOf = urlStack.indexOf(url);

                $('ul.pageslides').css('transform', 'translateX(' + (0 - (indexOf * $(window).width())) + 'px)');
            } else {
                urlStack.push(url);
                this.init();
                $('#left').click();
            }
        }
    };
});
