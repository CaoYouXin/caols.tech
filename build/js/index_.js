/**
 * Created by cls on 16/9/15.
 */
;(function (P, rootHref) {

    var rootHref = window.top.Router.rootHref;

    function processData(data) {
        var _categories = data.categories;
        var order = ['H5', 'Java', 'Personal', 'Web Interview', 'Old'];
        var ret = [];

        for (var i = 0, keys = order; i < keys.length; i++) {
            ret.push({
                group: keys[i],
                blogs: _categories[keys[i]]
            });
        }

        return ret;
    }

    function route(elem, e) {
        if (elem.tagName === 'A') {
            e.preventDefault();

            var url = elem.getAttribute('data-rel');

            window.top.Router.go(url, window.top.PageSlider.go);
        }
    }

    var _timestamp = 0;
    function eventHandler(e) {
        var timestamp = new Date().getTime();
        if (Math.abs(_timestamp - timestamp) < 400) {
            return true;
        }
        _timestamp = timestamp;

        if (e.target.classList.contains('project-tagline')) {
            e.preventDefault();

            window.top.store.clear();
            window.top.location.href = rootHref;
        }

        var it = e.target;
        do {
            route(it, e);
        } while (it = it.parentElement);
    }

    document.addEventListener('touchend', eventHandler);
    document.addEventListener('click', eventHandler);

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
