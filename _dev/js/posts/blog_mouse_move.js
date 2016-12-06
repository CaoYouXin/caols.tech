/**
 * Created by cls on 2016/12/1.
 */
;(function (P, rootHref, R, PS) {

    P.script(document, rootHref + 'build/js/post.js');

})(window.top.ES6Promise.Promise, window.top.Router.rootHref, window.top.Router, window.top.PageSlider);

(function (T, _3d) {

    console.log(T);
    console.log(_3d);

    var isMoving = false;

    var ctrlStart = document.querySelector('.ctrl-start');

    ctrlStart.addEventListener('click', function (e) {
        isMoving = true;
    });

    _3d.W.addEventListener('keypress', function (e) {
        if ('KeyG' === e.code) {

            if (ctrlStart.style.visibility === '' || ctrlStart.style.visibility === 'hidden') {
                ctrlStart.style.visibility = 'visible';
            }
        }
    });

    _3d.Canvas.addEventListener('mousemove', function (e) {
        if (isMoving) {
            console.log(e);
        } else {
            console.log(e.movementX, e.movementY);
        }
    });

    _3d.Action();
    _3d.Loop(function (delta) {
        _3d.Camera.position.x = 20;
        _3d.Camera.position.y = 1.76;
        _3d.Camera.position.z = 20;
        _3d.Camera.lookAt({x: 30, y: 1.76, z: 30});
    });

    // Grid
    var size = 20, step = 1;
    var geometry = new THREE.Geometry();
    var material = new THREE.LineBasicMaterial({color: 0x888888});
    for (var i = -size; i <= size; i += step) {
        geometry.vertices.push(new THREE.Vector3(-size, 0, i));
        geometry.vertices.push(new THREE.Vector3(size, 0, i));
        geometry.vertices.push(new THREE.Vector3(i, 0, -size));
        geometry.vertices.push(new THREE.Vector3(i, 0, size));
    }

    geometry.vertices.push(new THREE.Vector3(0, -size, 0));
    geometry.vertices.push(new THREE.Vector3(0, size, 0));

    var line = new THREE.LineSegments(geometry, material);

    _3d.Scene.add(line);

    // env texture
    var env = new THREE.Mesh(new THREE.SphereGeometry(
        5 * 20, 3 * 50, 3 * 50, 0, -(2 * Math.PI), 0, -(Math.PI)
    ), new THREE.MeshPhongMaterial({
        map: T.ImageUtils.loadTexture('../mini-images/stars_texture2942.jpg'),
        color: 0xffffff
    }));

    _3d.Scene.add(env);

    // add text
    var text = _3d.Text(['移动鼠标', '旋转镜头']);
    text.rotation.set(0, - 3 / 4 * Math.PI, 0);
    text.updateMatrix();
    text.position.x = 50;
    text.position.y = 10;
    text.position.z = 36;

    _3d.Scene.add(text);

})(THREE, window._3d);