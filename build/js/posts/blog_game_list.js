/**
 * Created by cls on 2016/10/20.
 */
;(function (P, rootHref, R, PS) {

    P.script(document, rootHref + 'build/js/post.js');

    var games = document.getElementById('games');
    var gallery = document.querySelector('ul.gallery');
    var w = gallery.offsetWidth;
    var it = gallery.firstElementChild;
    var count = gallery.childElementCount;
    var index = -1;
    var bar = document.createElement('ul');
    bar.classList.add('bar');
    games.appendChild(bar);
    var liW = w / count;

    while (it) {
        var number = ~~(Math.random() * (1 << 24));
        var s = number.toString(16);
        var randomBgColor = '#' + '000000'.substring(s.length) + s;

        var li = document.createElement('li');
        li.style.width = liW + 'px';
        li.style.backgroundColor = randomBgColor;
        bar.appendChild(li);

        it.style.width = w + 'px';
        it.style.backgroundImage = 'url(' + it.getAttribute('data-url') + ')';
        var innerIt = it.firstElementChild;
        while (innerIt) {
            if (innerIt.classList.contains('content')) {
                innerIt.style.backgroundColor = randomBgColor;
            }
            innerIt = innerIt.nextElementSibling;
        }
        it = it.nextElementSibling;
    }
    gallery.style.width = (w * count) + 'px';

    function set(i) {
        index = i %= count;

        console.log(index, i);

        gallery.style.transform = 'translateX(-'+(i/count*100)+'%)';

        for (var j = 0, it = bar.firstElementChild; !!it; j++, it = it.nextElementSibling) {
            if (i === j) {
                it.classList.remove('blur');
            } else {
                it.classList.add('blur');
            }
        }
    }

    setInterval(function () {
        set(++index);
    }, 5000);



})(window.top.ES6Promise.Promise, window.top.Router.rootHref, window.top.Router, window.top.PageSlider);
