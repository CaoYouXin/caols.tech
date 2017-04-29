/**
 * Created by cls on 2017/4/29.
 */
;(function (g, P, _3d) {

    function setLocation(obj, long, lat) {
        obj.rotation.set(0, long / 180 * Math.PI, lat / 180 * Math.PI);
        obj.updateMatrix();
    }

    var director = new _3d('#canvas');
    var pivot = new THREE.Group();
    director.Scene.add(pivot);

    console.log(director.Scene);

    var progressBar = director.ProgressBar('#h5-msg > span'), flag = false;
    progressBar.cb(function () {
        var angle = 0;
        director.Action(true).Loop(function (delta) {

            angle += delta * 0.5;

            // director.Camera.position.x = 100 * Math.cos(angle);
            // director.Camera.position.y = 0;
            // director.Camera.position.z = 100 * Math.sin(angle);
            // director.Camera.lookAt(director.Scene.position);

            director.Camera.position.x = 100 * Math.cos(angle) * Math.cos(40 / 180 * Math.PI);
            // director.Camera.position.y = 0;
            director.Camera.position.y = 100 * Math.sin(40 / 180 * Math.PI);
            director.Camera.position.z = 100 * Math.sin(angle) * Math.cos(40 / 180 * Math.PI);
            director.Camera.lookAt(director.Scene.position);
        });
    });

    // instantiate a loader
    var textureLoader = new THREE.TextureLoader();

    // load a image resource
    textureLoader.load(
        // resource URL
        'http://image.caols.tech/earth/2_no_clouds_8k.jpg',
        // Function when resource is loaded
        function ( texture ) {
            // do something with it
            texture.anisotropy = 1;
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(1, 1);
            texture.mapping = THREE.UVMapping;

            // like drawing a part of it on a canvas

            var radius = 30;
            var geometry = new THREE.SphereGeometry( radius, 32, 32, 0, 2 * Math.PI, 0, Math.PI );
            var material = new THREE.MeshPhongMaterial( { map: texture, color: 0xffffff } );
            var sphere = new THREE.Mesh( geometry, material );
            director.Scene.add( sphere );

            var equator = new THREE.Mesh( new THREE.TorusGeometry( 30, 0.5, 8, 100 ), new THREE.MeshBasicMaterial( { color: 0xffff00 } ) );
            equator.rotation.set(Math.PI / 2, 0, 0);
            equator.updateMatrix();
            director.Scene.add( equator );

            var quadrants = [[1,1],[-1,1],[-1,-1],[1,-1]];
            var points = [[1.3, 0], [.7, .6], [.7, .1], [.1, .1], [.1, .7], [.6, .7], [0, 1.3]];
            var scale = .618, squareOfRadiusPlus = (radius + 1) * (radius + 1);

            quadrants.forEach(function (q) {
                var handler = new THREE.Geometry();

                points.forEach(function (p, i) {
                    if (i + 1 === points.length) {
                        return;
                    }

                    var xInterpolate = d3.interpolate(p[0], points[(i + 1)][0]);
                    var yInterpolate = d3.interpolate(p[1], points[(i + 1)][1]);

                    var vector = new THREE.Vector3(
                        Math.sqrt(squareOfRadiusPlus - (p[0] * p[0] + p[1] * p[1]) * scale * scale),
                        scale * q[0] * p[0],
                        scale * q[1] * p[1]
                    );
                    handler.vertices.push(vector);

                    if (!q[2]) {
                        q[2] = true;
                    } else {
                        handler.vertices.push(vector.clone());
                    }

                    for (var j = 0.1; j <= 1; j += 0.1) {
                        var xx = xInterpolate(j);
                        var yy = yInterpolate(j);

                        var vector3 = new THREE.Vector3(
                            Math.sqrt(squareOfRadiusPlus - (xx * xx + yy * yy) * scale * scale),
                            scale * q[0] * xx,
                            scale * q[1] * yy
                        );
                        handler.vertices.push(vector3);
                        handler.vertices.push(vector3.clone());
                    }
                });

                handler.vertices.splice(handler.vertices.length - 1, 1);

                pivot.add(new THREE.LineSegments(handler, new THREE.LineBasicMaterial({color: 0xffffff})));
            });

            setLocation(pivot, 116, 40);
            console.log(pivot);
        },
        // Function called when download progresses
        function ( xhr ) {
            if (!flag) {
                progressBar.init(xhr.total);
                flag = !flag;
            }
            progressBar.upTogo(xhr.loaded);

            console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
        },
        // Function called when download errors
        function ( xhr ) {
            console.log( 'An error happened' );
        }
    );

})(window, window.P, window._3d);
