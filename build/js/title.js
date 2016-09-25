/**
 * Created by cls on 16/9/25.
 */
;(function () {

    var h1 = document.createElement('h1');
    h1.innerHTML = document.querySelector('meta[name="post-name"]').getAttribute('content');

    var span = document.createElement('span');
    span.classList.add('post-span');
    span.classList.add('titled-post-span');

    var config = {
        'post-category': '分类: ',
        'post-date': '时间: ',
        'post-label': '标签: '
    };

    var body = document.querySelector('section.post-content');
    var it = body.firstElementChild;
    body.insertBefore(h1, it);

    for (var keys = Object.keys(config), len = keys.length, i = 0, key = keys[i]; i < len; key = keys[++i]) {
        var node = span.cloneNode(false);
        node.setAttribute('data-title', config[key]);
        node.innerHTML = document.querySelector('meta[name="'+key+'"]').getAttribute('content');
        body.insertBefore(node, it);
    }

})();
