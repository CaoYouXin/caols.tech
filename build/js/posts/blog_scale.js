/**
 * Created by cls on 2016/10/15.
 */
;(function (P, rootHref, R, PS) {

    P.script(document, rootHref + 'build/js/post.js');

    function constant(x) {
        return function () {
            return x;
        };
    }

    // Pow
    function raise(x, exponent) {
        return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
    }

    var exponent = 2;

    function deinterpolatePow(a, b) {
        return (b = raise(b, exponent) - (a = raise(a, exponent)))
            ? function (x) {
                return (raise(x, exponent) - a) / b;
            } : constant(b);
    }

    function reinterpolatePow(a, b) {
        b = raise(b, exponent) - (a = raise(a, exponent));
        return function (t) {
            return raise(a + b * t, 1 / exponent);
        };
    }

    var start = 0, end = 1;
    demo1(start, end, deinterpolatePow(start, end), reinterpolatePow(start, end << 1), '#powScaleDemo1');

    // Linear
    function deinterpolateLinear(a, b) {
        return (b -= (a = +a))
            ? function(x) { return (x - a) / b; }
            : constant(b);
    }

    function reinterpolateLinear(a, b) {
        return a = +a, b -= a, function(t) {
            return a + b * t;
        };
    }

    demo1(start, end, deinterpolateLinear(start, end), reinterpolateLinear(start, end << 1), '#linearScaleDemo1');

    // Log
    function deinterpolateLog(a, b) {
        return (b = Math.log(b / a))
            ? function (x) {
                return Math.log(x / a) / b;
            } : constant(b);
    }

    function reinterpolateLog(a, b) {
        return a < 0
            ? function (t) {
                return -Math.pow(-b, t) * Math.pow(-a, 1 - t);
            } : function (t) {
                return Math.pow(b, t) * Math.pow(a, 1 - t);
            };
    }

    start = 0.1;
    demo1(start, end, deinterpolateLog(start, end), reinterpolateLog(start, end << 1), '#logScaleDemo1');

    function demo1(start, end, deiFn, reiFn, el) {
        var data = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><polyline fill="none" stroke="#010" stroke-width="1" points="{{points}}"></polyline></svg>';

        var xs = [], size = 100;

        for (var i = start; i <= end * 2; i += 0.1) {
            xs.push(i);
        }
        var xzs = xs.map(function (x) {
            return (x * size) + ',' + (deiFn(x) * size);
        });
        var zys = xs.map(function (x) {
            var z = deiFn(x);
            return (z * size) + ',' + (reiFn(z) * size);
        });
        var xys = xs.map(function (x) {
            return (x * size) + ',' + (reiFn(deiFn(x)) * size);
        });

        var dataXZ = data.replace('{{points}}', xzs.join(','));
        var dataZY = data.replace('{{points}}', zys.join(','));
        var dataXY = data.replace('{{points}}', xys.join(','));

        var content = document.querySelector(el);
        var firstElementChild = content.firstElementChild;

        function newImage(data) {
            var img = new Image();
            img.src = 'data:image/svg+xml,' + data;

            var canvas = document.createElement('canvas');
            canvas.style.transform = 'rotateX(180deg)';
            canvas.width = img.width;
            canvas.height = img.height;

            var context = canvas.getContext('2d');
            context.fillStyle = '#fef';
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, 0, 0);

            content.insertBefore(canvas, firstElementChild);

            return canvas.toDataURL('png');
        }

        var imageDataXZ = newImage(dataXZ);
        var imageDataZY = newImage(dataZY);
        var imageDataXY = newImage(dataXY);

        var main = new _3d(el + ' > .main');

        var geometry = new THREE.PlaneGeometry(5, 5);

        for (var fi = 0, len = geometry.faces.length; fi < len; fi++) {
            var face = geometry.faces[fi].clone();
            face.materialIndex = 1;
            geometry.faces.push(face);
            geometry.faceVertexUvs[0].push(geometry.faceVertexUvs[0][fi].slice(0));
        }


        var textureXY = new THREE.TextureLoader().load(imageDataXY);
        var materialsXY = [new THREE.MeshBasicMaterial({map: textureXY, side: THREE.FrontSide}),
            new THREE.MeshBasicMaterial({map: textureXY, side: THREE.BackSide})];
        var meshXY = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materialsXY));
        meshXY.rotation.set(Math.PI, 0, 0);
        meshXY.updateMatrix();
        meshXY.position.z += 2.5;
        main.Scene.add(meshXY);


        var textureZY = new THREE.TextureLoader().load(imageDataZY);
        var materialsZY = [new THREE.MeshBasicMaterial({map: textureZY, side: THREE.FrontSide}),
            new THREE.MeshBasicMaterial({map: textureZY, side: THREE.BackSide})];
        var meshZY = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materialsZY));
        meshZY.rotation.set(Math.PI, -Math.PI / 2, 0);
        meshZY.updateMatrix();
        meshZY.position.x -= 2.5;
        main.Scene.add(meshZY);


        var textureXZ = new THREE.TextureLoader().load(imageDataXZ);
        var materialsXZ = [new THREE.MeshBasicMaterial({map: textureXZ, side: THREE.FrontSide}),
            new THREE.MeshBasicMaterial({map: textureXZ, side: THREE.BackSide})];
        var meshXZ = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materialsXZ));
        meshXZ.rotation.set(Math.PI / 2, 0, 0);
        meshXZ.updateMatrix();
        meshXZ.position.y -= 2.5;
        main.Scene.add(meshXZ);

        var t = 0, long = 5, far = 15, m = far / long;

        function const0() {
            return 0;
        }

        function const1() {
            return far;
        }

        function asc(t) {
            return m * t;
        }

        function desc(t) {
            return far - m * t;
        }

        function make(seq) {

            var size = seq.length, ll = size * long;

            return function (t) {
                var i = 0, tt = t % ll;

                while (i < size) {
                    if (tt < (i + 1) * long) {
                        return seq[i](tt - i * long);
                    }
                    i++;
                }
            };
        }

        var fx = make([const0, const0, asc, desc, const0]);
        var fy = make([asc, const1, desc, const0, const0]);
        var fz = make([desc, const0, const0, asc, const1]);

        main.Action().Loop(function (delta) {

            t += delta;

            main.Camera.position.x = fx(t);
            main.Camera.position.y = fy(t);
            main.Camera.position.z = fz(t);

            main.Camera.lookAt(main.Scene.position);

            var tt = t % (5 * long), k = tt / long;

            if (k > 1 && k < 2) {
                main.Camera.rotation.z = Math.PI / 2 / long * (t % long);
            }

        });
    }
})(window.top.ES6Promise.Promise, window.top.Router.rootHref, window.top.Router, window.top.PageSlider);
