console.log('It is a honor to display a string from "caols.tech"!!!');

getElem('#testBtn', function (elem) {
    elem.addEventListener("click", function(){
        getElem('#test', function (testElem) {
            testElem.classList.toggle("hidden");
        });
    });
});

function getElem(el, cb) {
    var elem;
    if (!(elem = document.querySelector(el))) {
        setTimeout(function () {
            getElem(el, cb);
        }, 500);
    } else {
        cb(elem);
    }
}
