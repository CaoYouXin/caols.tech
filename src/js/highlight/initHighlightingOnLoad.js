/**
 * Created by cls on 2017/4/30.
 */
;(function (g, HL) {

    var codeElems = document.querySelectorAll('pre > code');

    for (var i = 0; i < codeElems.length; i++) {
        codeElems[i].innerHTML = HL.highlightAuto(codeElems[i].innerHTML).value;
    }

})(window, window['hljs']);
