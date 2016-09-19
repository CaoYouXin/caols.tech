/**
 * Created by cls on 16/9/14.
 */
;(function () {

    document.addEventListener('click', function (e) {
        var parentElement = e.target.parentElement;
        if (parentElement.tagName === 'UL' && parentElement.classList.contains('post-drawer-l')) {
            e.target.classList.toggle('active');
        }
    });

})();
