/**
 * Created by cls on 16/9/29.
 */
;(function (P, rootHref) {

    P.script(document, rootHref + 'build/js/post.js');

    P.ajax(rootHref + 'build/x-handlebars-templates/house_images.html')
        .then(function (html) {
            P.append(document.querySelector('section.post-content'), html);

            var cover = document.getElementById('cover'),
                pageX, pageY;

            function route(elem, e) {
                if (!(elem.parentElement && elem.parentElement.parentElement)) {
                    return;
                }

                if (elem.tagName === 'IMG' && elem.parentElement.tagName === 'LI' && elem.parentElement.parentElement.classList.contains('gallery')) {
                    e.preventDefault();

                    var src = elem.getAttribute('src');

                    cover.style.background = 'url("'+src+'") center no-repeat';
                    cover.style.backgroundSize = 'contain';
                    cover.style.opacity = '1';
                    cover.style.visibility = 'visible';
                }
            }

            function el(e) {
                if (e instanceof TouchEvent) {
                    var dx = Math.abs(e.pageX - pageX);
                    var dy = Math.abs(e.pageY - pageY);

                    if (dx * dx + dy * dy > 44 * 44) {
                        return;
                    }
                }

                var it = e.target;
                do {
                    route(it, e);
                } while (it = it.parentElement);

                if (e.target.id === 'cover') {
                    e.target.style.opacity = '0';
                    setTimeout(function () {
                        e.target.style.visibility = 'hidden';
                    }, 900);
                }
            }

            document.addEventListener('click', el);
            document.addEventListener('touchstart', function (e) {
                pageX = e.pageX;
                pageY = e.pageY;
            });
            document.addEventListener('touchend', el);
        });

})(window.top.ES6Promise.Promise, window.top.Router.rootHref, window.top.Router, window.top.PageSlider);
