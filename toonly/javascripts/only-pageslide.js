/**
 * Created by caoyouxin on 3/29/16.
 */
define(['jquery', 'handlebars', 'polyfill'], function ($, handlebars) {

    var urlStack = [];
    
    var pageslideTplFn = handlebars.compile('{{#each this}}<li class="pageslide"><iframe ' +
        'src="{{this}}" frameborder="0"></iframe></li>{{/each}}');

    $('body').html('<ul class="pageslides animation"></ul><div id="left" class="pager" ' +
        'style="left: 0;"><svg><path style="fill:#ffff00;" d="M10 0 L70 50 L70 0"></path></svg></div><div id="right" class="pager" ' +
        'style="right: 0;"><svg><path style="fill:#ffff00;" d="M10 0 L10 50 L70 0"></path></svg></div>');
    
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
                this.init();
            }

            var $ul = $('ul.pageslides');
            var $pageslides = $ul.children('li.pageslide');
            $pageslides.removeClass('active');
            $pageslides.eq(indexOf).addClass('active');
            $ul.css('transform', 'translateX(' + (0 - (indexOf * $(window).width())) + 'px)');
        },
        left: function () {
            var $pageslides = $('ul.pageslides > li.pageslide');
            var indexOf = Array.from($pageslides).reduce(function (previousValue, currentValue, currentIndex, array) {
                return previousValue + ($(currentValue).hasClass('active') ? currentIndex : 0);
            }, 0);

            if (indexOf <= 0) {
                return false;
            }

            this.go($pageslides.eq(indexOf - 1).find('iframe').attr('src'));
        },
        right: function () {
            var $pageslides = $('ul.pageslides > li.pageslide');
            var indexOf = Array.from($pageslides).reduce(function (previousValue, currentValue, currentIndex, array) {
                return previousValue + ($(currentValue).hasClass('active') ? currentIndex : 0);
            }, 0);

            if (indexOf >= $pageslides.length - 1) {
                return false;
            }

            this.go($pageslides.eq(indexOf + 1).find('iframe').attr('src'));
        }
    };
});
