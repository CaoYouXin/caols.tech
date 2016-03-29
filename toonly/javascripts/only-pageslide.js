/**
 * Created by caoyouxin on 3/29/16.
 */
define(['jquery', 'handlebars'], function ($, handlebars) {

    var urlStack = [];
    var pageslideTplFn = handlebars.compile('{{#each this}}<li class="pageslide"><iframe src="{{this}}" frameborder="0"></iframe></li>{{/each}}');

    return {
        init: function () {
            var $ul = $('ul.pageslides');

            $ul.html(pageslideTplFn(urlStack));

            var windowWidth = $(window).width();
            var $lis = $ul.children('li.pageslide');
            var ulWidth = windowWidth * $lis.length;
            $lis.css('width', windowWidth + 'px');
            $ul.css('width', ulWidth + 'px');
        },
        go: function (url) {
            var indexOf = urlStack.indexOf(url);
            if (indexOf === -1) {
                indexOf = urlStack.length;
                urlStack.push(url);
            }

            this.init();
            var $ul = $('ul.pageslides');
            var children = $ul.children('li.pageslide');
            children.removeClass('active');
            children.eq(indexOf).addClass('active');
            $ul.css('transform', 'translateX(' + (0 - (indexOf * $(window).width())) + 'px)');
        }
    };
});
