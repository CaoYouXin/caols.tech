/**
 * Created by caoyouxin on 3/29/16.
 */
define(['jquery', 'handlebars', 'toonly/javascripts/only-router', 'polyfill'], function ($, handlebars, router) {

    var urlStack = [], regular = /data-rel=".*?"/g;

    var pageslideTplFn = handlebars.compile('{{#each this}}<li class="pageslide" data-rel="{{this}}"><iframe ' +
        'src="{{this}}" frameborder="0"></iframe></li>{{/each}}');

    return {
        init: function () {
            var self = this;

            $('body').html('<ul class="pageslides animation"></ul><div id="left" class="pager" ' +
                'style="left: 0;"><svg><path style="fill:#ffff00;" d="M10 0 L70 50 L70 0"></path></svg></div><div id="right" class="pager" ' +
                'style="right: 0;"><svg><path style="fill:#ffff00;" d="M10 0 L10 50 L70 0"></path></svg></div>');

            $('#left').click(function (event) {
                event.preventDefault();

                self.left();
            });

            $('#right').click(function (event) {
                event.preventDefault();

                self.right();
            });

            var urlSnapshot = localStorage.getItem('urlSnapshot');
            if (urlSnapshot) {
                urlStack = JSON.parse(localStorage.getItem('urlStackSnapshot'));
                localStorage.removeItem('urlSnapshot');
            }

            self.refresh();

            return urlSnapshot;
        },
        refresh: function () {
            console.log('urlStack: ', urlStack);

            var windowWidth = $(window).width();
            var $ul = $('ul.pageslides');
            $ul.css('width', (windowWidth * urlStack.length) + 'px');

            var html = pageslideTplFn(urlStack);
            var lastTimeData = localStorage.getItem('lastTimeData') || '';
            localStorage.setItem('lastTimeData', html);

            var oldItems = lastTimeData.match(regular);
            var newItems = html.match(regular);

            console.log('oldItems: ', oldItems);
            console.log('newItems: ', newItems);

            if (oldItems !== null && newItems !== null) {
                if (oldItems.length < newItems.length) {
                    $ul.append(new RegExp('^(?:<li.*?</li>){' + oldItems.length + '}(.*?)$').exec(html)[1]);
                } else {

                    for (var i = 0, j = 0; i < oldItems.length && j < newItems.length;) {
                        if (oldItems[i] === newItems[j]) {
                            i++;
                            j++;
                            continue;
                        }

                        for (; i < oldItems.length; i++) {
                            $('li.pageslide[' + oldItems[i] + ']').remove();
                        }

                        $ul.append(new RegExp('^(?:<li.*?</li>){' + j + '}(.*?)$').exec(html)[1]);
                    }
                }
            } else {
                $ul.html(html);
            }

            var $pageslides = $('ul.pageslides > li.pageslide');
            $pageslides.css('width', windowWidth + 'px');

            localStorage.setItem('urlStackSnapshot', JSON.stringify(urlStack));
            return $pageslides;
        },
        go: function (url) {
            var $ul = $('ul.pageslides');
            var $pageslides = $('ul.pageslides > li.pageslide');

            var indexOf = urlStack.indexOf(url);
            if (indexOf === -1) {

                var indexOfPages = Array.from($pageslides).reduce(function (previousValue, currentValue, currentIndex, array) {
                    return previousValue + ($(currentValue).hasClass('active') ? (currentIndex + 1) : 0);
                }, -1);

                if (indexOfPages === -1) {
                    indexOf = 0;
                    urlStack.push(url);
                } else {
                    indexOf = indexOfPages + 1;
                    urlStack.splice(indexOf, urlStack.length - indexOf, url);
                }

                $pageslides = this.refresh();
            }
            
            $pageslides.removeClass('active');
            $pageslides.eq(indexOf).addClass('active');
            $ul.css('transform', 'translateX(' + (0 - (indexOf * $(window).width())) + 'px)');
        },
        left: function () {
            var $pageslides = $('ul.pageslides > li.pageslide');
            var indexOf = Array.from($pageslides).reduce(function (previousValue, currentValue, currentIndex, array) {
                return previousValue + ($(currentValue).hasClass('active') ? (currentIndex + 1) : 0);
            }, -1);

            if (indexOf <= 0) {
                return false;
            }

            router.go($pageslides.eq(indexOf - 1).find('iframe').attr('src'));
        },
        right: function () {
            var $pageslides = $('ul.pageslides > li.pageslide');
            var indexOf = Array.from($pageslides).reduce(function (previousValue, currentValue, currentIndex, array) {
                return previousValue + ($(currentValue).hasClass('active') ? (currentIndex + 1) : 0);
            }, -1);

            if (indexOf >= $pageslides.length - 1) {
                return false;
            }

            router.go($pageslides.eq(indexOf + 1).find('iframe').attr('src'));
        }
    };
});
