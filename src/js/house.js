/**
 * Created by cls on 2017/4/28.
 */
;(function (g, P) {

    new jPlayerPlaylist({
        jPlayer: "#jquery_jplayer_1",
        cssSelectorAncestor: "#jp_container_1"
    }, [
        {
            title:"客厅",
            artist:"Me",
            free:true,
            m4v: P.misc("../../images/house/VID_20161225_102638_1.mp4")
        },
        {
            title:"卧室",
            artist:"Me",
            m4v: P.misc("../../images/house/VID_20161225_102638_2.mp4")
        }
    ], {
        swfPath: P.misc("http://localhost:8080/caols.tech/src/misc/jplayer"),
        supplied: "webmv, ogv, m4v",
        useStateClassSkin: true,
        autoBlur: false,
        smoothPlayBar: true,
        keyEnabled: true
    });

    g.handlers = g.handlers || {};

    g.handlers.toCover = function (e) {
        var src = e.target.getAttribute('src');

        cover.style.backgroundImage = 'url("'+src+'")';
        cover.style.backgroundPosition = 'center';
        cover.style.backgroundRepeat = 'no-repeat';
        cover.style.backgroundSize = 'contain';
        cover.style.opacity = '1';
        cover.style.visibility = 'visible';
    };

    g.handlers.hideCover = function () {
        var elem = document.getElementById('cover');
        elem.style.opacity = '0';
        var timeout = setTimeout(function () {
            elem.style.visibility = 'hidden';
            clearTimeout(timeout);
        }, 900);
    };

    P.ajax(P.misc('http://localhost:8080/caols.tech/src/misc/x-handlebars-templates/house_images.html')).then(function (html) {
        P.append(document.getElementById('images'), html);
    });

})(window, window.P);
