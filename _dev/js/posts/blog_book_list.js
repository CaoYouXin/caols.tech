/**
 * Created by cls on 16/9/29.
 */
;(function (P, rootHref, H) {

    P.script(document, rootHref + 'build/js/post.js');

    var btns = Array.from(document.querySelectorAll('.btns > span.btn'));
    var listShow = document.querySelector('ul.book-list-show');

    function route(elem, e) {
        if (elem.tagName === 'DIV' && elem.classList.contains('book-content')) {
            e.preventDefault();

            elem.classList.toggle('active');
        }
    }

    function eventHandler(e) {
        var indexOf = btns.indexOf(e.target);
        if (-1 !== indexOf) {
            e.preventDefault();

            listShow.style.transform = 'translateX(-' + (33.33 * indexOf) + '%)';

            btns.forEach(function (b) {
                b.classList.remove('active');
            });
            e.target.classList.add('active');
        }

        if (e.target.classList.contains('show-full-cover')) {
            e.preventDefault();

            var it = e.target.nextSibling;
            do {
                if (it.tagName === 'DIV' && it.classList.contains('book-content')) {
                    it.classList.toggle('hidden');
                    e.target.innerHTML = it.classList.contains('hidden') ? '-' : '+';
                }
            } while (it = it.nextSibling);
        }

        var iter = e.target;
        do {
            route(iter, e);
        } while (iter = iter.parentElement);
    }

    document.addEventListener('touchend', eventHandler);
    document.addEventListener('click', eventHandler);

    P.all([
        P.script(document, rootHref + '3rdLib/prism/prism.min.js'),
        P.ajax(rootHref + 'build/json/books.json'),
        P.ajax(rootHref + 'build/x-handlebars-templates/favorite_book_list.html')
    ]).then(function (values) {
        var codeElem = document.getElementById('code');
        codeElem.innerHTML = window.Prism.highlight(values[1], window.Prism.languages.json);

        var tableBody = document.querySelector('#table > tbody');
        var data = JSON.parse(values[1]);
        var keys = ['name', 'author', 'category', 'publish_time', 'publish_org', 'introduction', 'state', 'cover_url'];
        data.forEach(function (d) {
            var tr = document.createElement('tr');

            keys.forEach(function (k) {
                var td = document.createElement('td');

                if ('cover_url' === k) {
                    td.innerHTML = '<div style="width: 100px;height: 150px;margin: 10px;background: rgba(0,0,0,.5) url(' + d[k] + ') no-repeat top;background-size: contain;"></div>';
                } else {
                    td.innerHTML = d[k];
                }

                tr.appendChild(td);
            });

            tableBody.appendChild(tr);

            var number = ~~(Math.random() * (1 << 24));
            var s = number.toString(16);
            d.bgColor = '#' + '000000'.substring(s.length) + s;

            d.color = number > (1 << 23) ? '#000000' : '#ffffff';
        });

        var favorite = document.getElementById('favorite');
        P.append(favorite, H.compile(values[2])(data));
    }).then(function () {
        console.log(document.getElementById('code').offsetHeight);
        console.log(document.getElementById('table').offsetHeight);
        console.log(document.getElementById('favorite').offsetHeight);
    });

})(window.top.ES6Promise.Promise, window.top.Router.rootHref, window.top.Handlebars);
