/**
 * Created by cls on 16/9/15.
 */
;(function (handlebars, router) {

    var urlStack = null, regular = /data-rel=".*?"/g;
    var iOSFix = navigator.userAgent.match(/iPad|iPhone/i) ? 'style="-webkit-overflow-scrolling: touch;overflow-y: auto;" ' : '';

    var pageslideTplFn = handlebars.compile('{{#each this}}' +
        '<li class="pageslide" ' + iOSFix + 'data-rel="{{url}}">' +
        '<iframe src="{{url}}" frameborder="0" width="{{width}}px" style="overflow-x: hidden;"></iframe>' +
        '</li>{{/each}}');

    function findActive(slidesElems) {
        return Array.from(slidesElems).reduce(function (previousValue, currentValue, currentIndex, array) {
            return previousValue + (currentValue.classList.contains('active') ? (currentIndex + 1) : 0);
        }, -1);
    }

    function append(element, htmldata) {
        var e = document.createElement('div');
        e.innerHTML = htmldata;

        while(e.firstChild) {
            element.appendChild(e.firstChild);
        }
    }

    window.PageSlider = {
        init: function (urls) {
            var self = this;

            document.body.innerHTML = '<ul class="pageslides animation"></ul>' +
                '<div id="left" class="pager" style="left: 0;">' +
                '<svg>' +
                '<path style="fill:#ffff00;" d="M10 50 L70 0 L70 100"></path>' +
                '</svg>' +
                '</div>' +
                '<div id="right" class="pager" style="right: 0;">' +
                '<svg>' +
                '<path style="fill:#ffff00;" d="M10 0 L70 50 L10 100"></path>' +
                '</svg>' +
                '</div>';

            document.getElementById('left').addEventListener('click', self.left, true);
            document.getElementById('left').addEventListener('touchend', self.left, true);
            document.getElementById('right').addEventListener('click', self.right, true);
            document.getElementById('right').addEventListener('touchend', self.right, true);

            urlStack = urls || [];

            self.refresh();
        },
        refresh: function () {

            var windowWidth = document.body.offsetWidth;
            var ulElem = document.querySelector('ul.pageslides');
            ulElem.style.width = (windowWidth * urlStack.length) + 'px';

            var data = urlStack.map(function (url) {
                return {url: url, width: windowWidth - 160};
            });
            var html = pageslideTplFn(data);

            var oldItems = [];
            for (var it = ulElem.firstElementChild; it != null; it = it.nextElementSibling) {
                oldItems.push(it.getAttribute('data-rel'));
            }

            var newItems = html.match(regular);

            if (oldItems !== null && newItems !== null) {
                if (oldItems.length < newItems.length) {
                    append(ulElem, new RegExp('^(?:<li.*?</li>){' + oldItems.length + '}(.*?)$').exec(html)[1]);
                } else {

                    for (var i = 0, j = 0; i < oldItems.length && j < newItems.length;) {
                        if (oldItems[i] === newItems[j]) {
                            i++;
                            j++;
                            continue;
                        }

                        for (; i < oldItems.length; i++) {
                            document.querySelector('li.pageslide[data-rel="' + oldItems[i] + '"]').remove();
                        }

                        append(ulElem, new RegExp('^(?:<li.*?</li>){' + j + '}(.*?)$').exec(html)[1]);
                    }
                }
            } else {
                ulElem.innerHTML = html;
            }

            var slidesElems = document.querySelectorAll('ul.pageslides > li.pageslide');
            for (var ii = 0; ii < slidesElems.length; ii++) {
                slidesElems[ii].style.width = windowWidth + 'px';
            }

            return slidesElems;
        },
        go: function (url) {

            var windowWidth = document.body.offsetWidth;
            var ulElem = document.querySelector('ul.pageslides');
            var slidesElems = document.querySelectorAll('ul.pageslides > li.pageslide');

            var indexOf = urlStack.indexOf(url);
            if (indexOf === -1) {

                var indexOfPages = findActive(slidesElems);

                if (indexOfPages === -1) {
                    indexOf = 0;
                    urlStack.push(url);
                } else {
                    indexOf = indexOfPages + 1;
                    urlStack.splice(indexOf, urlStack.length - indexOf, url);
                }

                slidesElems = PageSlider.refresh();

                store('ps-pages', urlStack);
            }

            for (var i = 0; i < slidesElems.length; i++) {
                if (i === indexOf) {
                    slidesElems[i].classList.add('active');
                } else {
                    slidesElems[i].classList.remove('active');
                }
            }

            ulElem.style.transform = 'translateX(' + (0 - (indexOf * windowWidth)) + 'px)';
        },
        left: function () {
            var slidesElems = document.querySelectorAll('ul.pageslides > li.pageslide');
            var indexOf = findActive(slidesElems);

            if (indexOf <= 0) {
                return false;
            }

            var url = slidesElems[indexOf - 1].getAttribute('data-rel');
            router.go(url, PageSlider.go);
        },
        right: function () {
            var slidesElems = document.querySelectorAll('ul.pageslides > li.pageslide');
            var indexOf = findActive(slidesElems);

            if (indexOf >= slidesElems.length - 1) {
                return false;
            }

            router.go(slidesElems[indexOf + 1].getAttribute('data-rel'), PageSlider.go);
        }
    };

})(window.Handlebars, window.Router);
