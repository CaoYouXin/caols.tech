/**
 * Created by cls on 16/9/26.
 */
;(function (P, rootHref) {

    P.script(document, rootHref + 'build/js/post.js');

    var apiElem = document.querySelector('table#api > tbody');
    var tr = document.createElement('tr');
    var td = document.createElement('td');

    function f(k) {
        return typeof k === 'string' && !k.match(/__/);
    }

    for (var arrayKeys = Reflect.ownKeys(Array.prototype).filter(f),
             objectKeys = Reflect.ownKeys(Object.prototype).filter(f),
             // reflectKeys = Reflect.ownKeys(Reflect.prototype).filter(f),
             count = Math.max(arrayKeys.length, objectKeys.length),
             i = 0, aK = arrayKeys[i], oK = objectKeys[i]; i < count;
         i++, aK = arrayKeys[i], oK = objectKeys[i]) {

        var tr = document.createElement('tr');
        apiElem.appendChild(tr);

        var td = document.createElement('td');
        td.innerHTML = !!aK ? aK.toString() : '';
        tr.appendChild(td);

        td = document.createElement('td');
        td.innerHTML = !!oK ? oK.toString() : '';
        tr.appendChild(td);

        // td = document.createElement('td');
        // td.innerHTML = !!rK ? rK.toString() : '';
        // tr.appendChild(td);
    }

})(window.top.ES6Promise.Promise, window.top.Router.rootHref);
