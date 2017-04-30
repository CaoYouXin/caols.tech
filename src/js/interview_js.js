/**
 * Created by cls on 2017/4/30.
 */
;(function (g) {

    var apiElem = document.querySelector('table#api > tbody');

    function f(k) {
        return typeof k === 'string' && !k.match(/__/);
    }

    var tr, td;
    try {
        for (var arrayKeys = Reflect.ownKeys(Array.prototype).filter(f),
                 objectKeys = Reflect.ownKeys(Object.prototype).filter(f),
                 // reflectKeys = Reflect.ownKeys(Reflect.prototype).filter(f),
                 count = Math.max(arrayKeys.length, objectKeys.length),
                 i = 0, aK = arrayKeys[i], oK = objectKeys[i]; i < count;
             i++, aK = arrayKeys[i], oK = objectKeys[i]) {

            tr = document.createElement('tr');
            apiElem.appendChild(tr);

            td = document.createElement('td');
            td.innerHTML = !!aK ? aK.toString() : '';
            tr.appendChild(td);

            td = document.createElement('td');
            td.innerHTML = !!oK ? oK.toString() : '';
            tr.appendChild(td);

            // td = document.createElement('td');
            // td.innerHTML = !!rK ? rK.toString() : '';
            // tr.appendChild(td);
        }
    } catch (e) {
        tr = document.createElement('tr');
        apiElem.appendChild(tr);

        td = document.createElement('td');
        td.setAttribute('colspan', '2');
        td.innerHTML = '你的浏览器不支持Reflect API!';
        tr.appendChild(td);
    }

})(window);
