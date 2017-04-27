/**
 * Created by cls on 2017/4/27.
 */
;(function (global) {

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
        it.style.backgroundSize = 'contain';
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
            if (i === j && !it.classList.contains('blur')) {
                it.classList.add('blur');
            } else {
                it.classList.remove('blur');
            }
        }
    }

    function loop() {
        set(++index);
        clearTimeout(timeout);
        timeout = setTimeout(loop, 5000);
    }
    var timeout = setTimeout(loop, 5000);

    bar.addEventListener('click', function (e) {
        for (var i = 0; i < bar.childElementCount; i++) {
            if (bar.children[i] === e.target) {
                set(i);
                clearTimeout(timeout);
                timeout = setTimeout(loop, 5000);
            }
        }
    });

})(window);
