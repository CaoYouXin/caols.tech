/**
 * Created by cls on 2017/4/27.
 */
;(function (g, P, H, highlight) {

    var timeout;
    g.handlers = g.handlers || {};
    g.handlers.btnClicked = function (index) {
        var btns = document.querySelectorAll('.btns > .btn');
        var activeBtn = document.querySelector('.btns > .btn.active');

        if (activeBtn) activeBtn.classList.remove('active');
        btns[index].classList.add('active');

        var lis = document.querySelectorAll('ul.book-list-show > li');
        var activeLI = document.querySelector('ul.book-list-show > li.active');

        if (activeLI) activeLI.classList.remove('active');
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            if (activeLI) activeLI.style.display = 'none';
            lis[index].style.display = 'block';
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                lis[index].classList.add('active');
                clearTimeout(timeout);
            }, 100);
        }, 1000);

        if (1 === index) {
            var pre = document.querySelector('pre.code-border');
            var code = pre.children[0];
            pre.removeChild(code);
            pre.appendChild(code);
        }
    };

    P.all([
        P.ajax(P.template('http://localhost:8080/caols.tech/src/x-handlebars-templates/books.json')),
        P.ajax(P.template('http://localhost:8080/caols.tech/src/x-handlebars-templates/favorite_book_list.html'))
    ]).then(function (values) {
        console.log(1);
        var codeElem = document.getElementById('code');
        // codeElem.innerHTML = highlight.highlightAuto(values[0]).value;
        console.log(2);
        console.log(highlight.highlightAuto(values[0]));
        P.append(codeElem, highlight.highlightAuto(values[0]).value);

        var tableBody = document.querySelector('#table > tbody');
        var data = JSON.parse(values[0]);
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
        P.append(favorite, H.compile(values[1])(data));

        g.handlers.btnClicked(1);
    });

})(window, window.P, window['Handlebars'], window['hljs']);