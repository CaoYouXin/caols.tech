/**
 * Created by cls on 16/9/15.
 */
;(function (P, rootHref) {

    function processData(data) {
        var _categories = data.categories;
        var order = ['D3', 'Design Pattern', 'H5', 'Java', 'Personal', 'Old'];
        var ret = [];

        for (var i = 0, keys = order; i < keys.length; i++) {
            var blogs = _categories[keys[i]];
            var number = (blogs.length % 3 === 0) ? blogs.length / 3 : Math.floor( blogs.length / 3) + 1;

            blogs.forEach(function (b) {
               b.blog_width = 100 / number;
            });

            ret.push({
                group: keys[i],
                blogs: blogs,
                blogs_width: 100 * number,
                pager: 1 === number ? '' : ' pager'
            });
        }

        return ret;
    }

    function handlerProxy(e, inHandler, outHandler) {
        var computedStyle = window.getComputedStyle(e.target, ':after');

        var height = +computedStyle.height.match(/(\d+)/)[0];
        var offsetTop = e.target.offsetTop + e.target.offsetHeight - 20 - height;
        var rangeY = [offsetTop, offsetTop + height];

        var width = +computedStyle.width.match(/(\d+)/)[0];
        var offsetLeft = e.target.offsetLeft + e.target.offsetWidth - 20 - width;
        var rangeX = [], step = width / 4;
        for (var i = 0; i < 5; i++) {
            rangeX.push(offsetLeft + i * step);
        }

        // console.log('1 ', e.screenX, e.screenY, e.clientX, e.clientY + document.body.scrollTop / window.innerHeight * document.body.offsetHeight, rangeY);
        if (inRange(e.clientY + document.body.scrollTop, rangeY)) {
            // console.log('2 ', e.clientX, e.clientY + document.body.scrollTop, rangeX);

            var index = inRange(e.clientX, rangeX);

            // console.log('in  ', index);
            if (index) {

                inHandler(index - 1);
            } else {

                outHandler();
            }
        } else {

            outHandler(e);
        }
    }

    function route1(elem, e) {
        if (elem.tagName === 'A') {
            var url = elem.getAttribute('data-rel');

            if (url) {
                e.preventDefault();

                window.top.Router.go(url, window.top.PageSlider.go);

                return true;
            }
        } else if (elem.tagName === 'UL') {
            console.log(e.clientX, e.clientY);
        }
    }

    function constant(x) {
        return function () {
            return x;
        };
    }

    var _timestamp = 0;

    function eventHandler1(e) {
        var timestamp = new Date().getTime();
        if (Math.abs(_timestamp - timestamp) < 400) {
            return true;
        }
        _timestamp = timestamp;

        if (e.target.classList.contains('project-tagline') && e.target.classList.contains('btn')) {
            e.preventDefault();

            window.top.store.clear();
            window.top.location.href = rootHref;

            return true;
        }

        if (e.target.classList.contains('blogs-wrapper')) {

            handlerProxy(e, function (index) {
                var blogs = e.target.firstElementChild;
                var columnCount = blogs.style.width.match(/\d/)[0];
                var currentOffset = (blogs.style.transform.match(/(\d+)/) || [0])[0];
                var step = 100 / columnCount;

                (function (offset) {
                    blogs.style.transform = 'translateX(-' + offset + '%)';
                })([
                    constant(0),
                    function () {
                        return Math.max(0, currentOffset - step);
                    },
                    function () {
                        return Math.min(100 - step, currentOffset + step);
                    },
                    constant(100 - step)
                ][index]());
            }, function () {

            });

            return true;
        }

        var it = e.target;
        do {
            if (route1(it, e)) {
                return true;
            }
        } while (it = it.parentElement);
    }

    function inRange(number, range) {
        if (range.length === 2) {
            return number >= range[0] && number < range[1];
        } else {
            for (var i = 1; i < range.length; i++) {
                if (number >= range[i - 1] && number < range[i]) {
                    return i;
                }
            }
        }
    }

    var duration = 800;

    function eventHandler2(e) {
        var timestamp = new Date().getTime();
        if (Math.abs(_timestamp - timestamp) < duration) {
            return true;
        }
        _timestamp = timestamp;

        if (e.target.classList.contains('blogs-wrapper')) {

            handlerProxy(e, function (index) {
                duration = 100;

                e.target.setAttribute('data-pager', [
                    '<̲<̲   <   >   >>',
                    '<<   <̲   >   >>',
                    '<<   <   >̲   >>',
                    '<<   <   >   >̲>̲'
                ][index]);
            }, function () {
                duration = 800;

                e.target.setAttribute('data-pager', '<<   <   >   >>');
            });

            return true;
        }
    }

    document.addEventListener('touchend', eventHandler1);
    document.addEventListener('click', eventHandler1);
    document.addEventListener('mousemove', eventHandler2);

    P.all([
        P.getJSON(rootHref + 'build/posts/articles.json'),
        P.ajax(rootHref + 'build/x-handlebars-templates/article_list.html'),
        P.script(document, rootHref + 'build/js/duoshuo.js')
    ]).then(function (values) {
        var html = window.top.Handlebars.compile(values[1])(processData(values[0]));

        var articleListElem = document.getElementById('article_list');

        articleListElem.innerHTML = html;
    });

    var resume = document.createElement('div');
    resume.id = 'resume';
    resume.onclick = function () {
        this.classList.remove("show");
    };
    document.querySelector('section.page-header').appendChild(resume);

    document.getElementById('resume-marker').onclick = function () {
        resume.classList.add('show');
    };

})(window.top.ES6Promise.Promise, window.top.Router.rootHref);
