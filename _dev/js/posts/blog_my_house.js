/**
 * Created by cls on 16/9/29.
 */
;(function (P, rootHref) {

    P.all([
        P.script(document, rootHref + 'build/js/post.js'),
        P.ajax(rootHref + 'build/x-handlebars-templates/house_images.html')
    ]).then(function (values) {
        P.append(document.querySelector('section.post-content > .images'), values[1]);

        var cover = document.getElementById('cover'),
            pageX, pageY;

        function route(elem, e) {
            if (!(elem.parentElement && elem.parentElement.parentElement)) {
                return;
            }

            if (elem.tagName === 'IMG' && elem.parentElement.tagName === 'LI' && elem.parentElement.parentElement.classList.contains('gallery')) {
                e.preventDefault();

                var src = elem.getAttribute('src');

                cover.style.backgroundImage = 'url("'+src+'")';
                cover.style.backgroundPosition = 'center';
                cover.style.backgroundRepeat = 'no-repeat';
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

        new jPlayerPlaylist({
            jPlayer: "#jquery_jplayer_1",
            cssSelectorAncestor: "#jp_container_1"
        }, [
            {
                title:"客厅",
                artist:"Me",
                free:true,
                m4v:"irStr(../../images/house/VID_20161225_102638_1.mp4)"
            },
            {
                title:"卧室",
                artist:"Me",
                m4v: "irStr(../../images/house/VID_20161225_102638_2.mp4)"
            }
        ], {
            swfPath: "../../../3rdLib/jplayer/jplayer",
            supplied: "webmv, ogv, m4v",
            useStateClassSkin: true,
            autoBlur: false,
            smoothPlayBar: true,
            keyEnabled: true
        });
    });

})(window.top.ES6Promise.Promise, window.top.Router.rootHref, window.top.Router, window.top.PageSlider);
