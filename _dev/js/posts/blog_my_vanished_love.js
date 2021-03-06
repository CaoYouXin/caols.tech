/**
 * Created by cls on 16/10/6.
 */
;(function (P, rootHref, R, PS) {

    P.script(document, rootHref + 'build/js/back_to_index.js');

    var Util = (function (el) {

        var canvas = document.querySelector(el);

        var camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 1, 2000);

        var scene = new THREE.Scene();
        scene.add(new THREE.AmbientLight(0xffffff));

        return {
            Canvas: canvas,
            Camera: camera,
            Scene: scene,
            Action: function () {

                var renderer = Util.Renderer = new THREE.WebGLRenderer({canvas: canvas});
                renderer.setPixelRatio(window.devicePixelRatio);
                renderer.setSize(canvas.clientWidth, canvas.clientHeight);

                var stats = Util.Stats = new Stats();
                document.body.appendChild(stats.dom);

                window.addEventListener('resize', function () {
                    camera.aspect = canvas.clientWidth / canvas.clientHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
                }, false);

            }
        };

    })('#canvas');

    Util.Animator = (function () {

        var clock = new THREE.Clock(), render;

        function animateFn() {
            requestAnimationFrame(animateFn);

            var delta = clock.getDelta();
            render(delta);

            THREE.AnimationHandler.update(delta);
            Util.Renderer.render(Util.Scene, Util.Camera);
            Util.Stats.update();
        }

        var lastHitTime = 0, lastForHowLong = 0, stateIndex = -1, states = [
            // 观看环外表面
            function (time) {
                var timer = time * 0.00001;

                Util.Camera.position.x = Math.cos(timer) * 36;
                Util.Camera.position.y = 0;
                Util.Camera.position.z = Math.sin(timer) * 36;
            },
            // 观看全貌
            function (time) {
                var timer = time * 0.00005;

                Util.Camera.position.x = Math.cos(timer) * 50;
                Util.Camera.position.y = Math.cos(timer * 3) * 10;
                Util.Camera.position.z = Math.sin(timer) * 50;
            },
            // 近距离观看星图
            function (time) {
                var timer = time * 0.00001;

                Util.Camera.position.x = Math.cos(timer) * 5;
                Util.Camera.position.y = Math.cos(timer * 3) * 5;
                Util.Camera.position.z = Math.sin(timer) * 5;
            },
            // 观看黑洞
            function (time) {
                var timer = time * 0.0001;

                Util.Camera.position.x = Math.cos(timer) * 180;
                Util.Camera.position.y = Math.abs(Math.cos(timer * 3)) * 50 + 15;
                Util.Camera.position.z = Math.sin(timer) * 180;

//                Util.Camera.position.x = 0;
//                Util.Camera.position.y = 15;
//                Util.Camera.position.z = 180;
            }
        ];

        function moveCamera(time, last) {
            if (time - lastHitTime > lastForHowLong) {

                stateIndex++;
                if (stateIndex === states.length) {
                    stateIndex = 0;
                }

                //            if (stateIndex !== 1) {
                //                stateIndex = 1;
                //            }

                lastHitTime = time;
                lastForHowLong = last[stateIndex];
            }

            return states[stateIndex](time);
        }

        return {
            animate: function (renderFn) {
                render = renderFn || function () {
                        // 没有动画

                        Util.Camera.position.x = 0;
                        Util.Camera.position.y = 10;
                        Util.Camera.position.z = 50;
                        Util.Camera.lookAt(Util.Scene.position);
                    };
                animateFn();
            },
            action1: function () {
                render = function () {
                    moveCamera(Date.now(), [1000 * .2, 1000 * .2, 1000 * .2, 1000 * 10]);

                    Util.Camera.lookAt(Util.Scene.position);
                }
            },
            action1plus: function () {
                var plusFn = function (delta) {
                    for (var i = 0; i < Util.Scene.blackHoleRings.length; i++) {
                        Util.Scene.blackHoleRings[i].rotateY(Math.PI * delta * (1.8 - 0.1 * i));
                    }
                };

                if (typeof render === 'function') {
                    var _render = render;
                    render = function (delta) {
                        _render(delta);
                        plusFn(delta);
                    };
                } else {
                    render = plusFn;
                }
            }
        };

    })();

    Util.ProgressBar = (function (pbEl) {

        var pbElement = document.querySelector(pbEl), upLen, up = 0;

        return {
            init: function (totalLen) {
                upLen = 100 / totalLen;
            },
            upTogo: function () {
                up += upLen;
                pbElement.innerHTML = up.toFixed(2) + '% completed';

                if (99.9 <= up) {
                    pbElement.style.visibility = 'hidden';

                    Util.Action();
                    Util.Animator.animate();
                    Util.Animator.action1();
                    Util.Animator.action1plus();
                }
            }
        };

    })('#h5-msg > span');

    Util.TextureManager = (function (progressBar) {

        var ret = [], promises = [], textureLoader = new THREE.TextureLoader(),
            ringLen;

        var heartTexture = 'http://image.caols.tech/vanished_love/love.jpg';
        var galaxyTexture = 'http://image.caols.tech/vanished_love/stars_texture2942.jpg';

        return {
            init: function (textureCfg) {
                ringLen = textureCfg.length;

                var spliceIndex = Math.random() * ringLen | 0;
                textureCfg.splice(spliceIndex, 0, heartTexture);
                textureCfg.push(galaxyTexture);

                textureCfg.every(function (textureKey) {

                    promises.push(new P(function (resolve, reject) {
                        textureLoader.load(textureKey, function (texture) {

                            texture.anisotropy = 1;
                            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                            texture.repeat.set(1, 1);
                            texture.mapping = THREE.UVMapping;

                            ret.push({
                                key: textureKey,
                                texture: texture
                            });

                            progressBar.upTogo();

                            resolve();
                        });
                    }));

                    return true;
                });
            },
            ringLen: function () {
                return ringLen;
            },
            every: function (everyFn) {

                P.all(promises).then(function () {

                    ret.every(everyFn);

                });

            },
            isHeartTexture: function (textureObj) {
                return heartTexture === textureObj.key;
            },
            isGalaxyTexture: function (textureObj) {
                return galaxyTexture === textureObj.key;
            },
            loader: textureLoader
        };

    })(Util.ProgressBar);

    Util.SceneManager = (function (progressBar, textureManager) {

        var len, angle, circleRadius, ringIndex = 0, ballIndex = 0, radius = 10, widthSegments = 9, heightSegments = 8,
            phiStart = 0, phiLength = Math.PI * 2, phiStep = phiLength / widthSegments,
            thetaStart = 0, thetaLength = Math.PI, thetaStep = thetaLength / heightSegments;

        return {
            init: function () {
                len = textureManager.ringLen();
                angle = 2 * Math.PI / len;
                circleRadius = 1.9 / Math.tan(angle / 2);

                textureManager.every(function (textureObj) {

                    if (textureManager.isHeartTexture(textureObj)) {
                        Util.SceneManager.addPole(textureObj);
                    } else if (textureManager.isGalaxyTexture(textureObj)) {
                        Util.SceneManager.addGalaxy(textureObj);
                    } else {
                        Util.SceneManager.addRing(textureObj);
                        Util.SceneManager.addBall(textureObj);
                    }

                    progressBar.upTogo();

                    return true;
                });

                this.addParticles();
            },
            addRing: function (textureObj) {
                var daeElem = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 2.4), new THREE.MeshPhongMaterial({
                    map: textureObj.texture,
                    // wireframe: true
                }));

                var daeElemInverse = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 2.4), new THREE.MeshPhongMaterial({
                    map: textureObj.texture,
                    // wireframe: true
                }));

                daeElem.rotation.set(0, ringIndex * angle, 0);
                daeElemInverse.rotation.set(0, ringIndex * angle + Math.PI, 0);

                daeElem.updateMatrix();
                daeElemInverse.updateMatrix();

                daeElem.position.z = Math.cos(ringIndex * angle) * circleRadius;
                daeElem.position.x = Math.sin(ringIndex * angle) * circleRadius;
                daeElemInverse.position.z = Math.cos(ringIndex * angle) * circleRadius;
                daeElemInverse.position.x = Math.sin(ringIndex * angle) * circleRadius;

                daeElem.updateMatrix();
                daeElemInverse.updateMatrix();

                Util.Scene.add(daeElem);
                Util.Scene.add(daeElemInverse);

                ringIndex++;
            },
            addBall: function (textureObj) {
                var y = (ballIndex / widthSegments | 0) + 1;
                var x = ballIndex - y * widthSegments;

                var mesh = new THREE.Mesh(new THREE.SphereGeometry(
                    radius, widthSegments, heightSegments, phiStart + x * phiStep, phiStep, thetaStart + y * thetaStep, thetaStep
                ), new THREE.MeshPhongMaterial({map: textureObj.texture}));

                Util.Scene.add(mesh);

                ballIndex++;
            },
            addPole: function (textureObj) {
                var mesh;

                for (var y = 0; y < heightSegments; y += heightSegments - 1) {
                    for (var x = 0; x < widthSegments; x++) {
                        mesh = new THREE.Mesh(new THREE.SphereGeometry(
                            radius, widthSegments, heightSegments, phiStart + x * phiStep, phiStep, thetaStart + y * thetaStep, thetaStep
                        ), new THREE.MeshPhongMaterial({map: textureObj.texture}));
                        Util.Scene.add(mesh);
                    }
                }
            },
            addGalaxy: function (textureObj) {
                var mesh = new THREE.Mesh(new THREE.SphereGeometry(
                    radius * 6, widthSegments * 25, heightSegments * 25, phiStart, -phiLength, thetaStart, -thetaLength
                ), new THREE.MeshPhongMaterial({map: textureObj.texture, color: 0xffffff}));
                Util.Scene.add(mesh);

                mesh = new THREE.Mesh(new THREE.SphereGeometry(
                    radius * 6, widthSegments * 25, heightSegments * 25, phiStart, phiLength, thetaStart, thetaLength
                ), new THREE.MeshPhongMaterial({map: textureObj.texture, color: 0x222222}));
                Util.Scene.add(mesh);

                mesh = new THREE.Mesh(new THREE.SphereGeometry(
                    radius * 20, widthSegments * 50, heightSegments * 50, phiStart, -phiLength, thetaStart, -thetaLength
                ), new THREE.MeshPhongMaterial({map: textureObj.texture, color: 0xffffff}));
                Util.Scene.add(mesh);

                mesh = new THREE.Mesh(new THREE.SphereGeometry(
                    radius, widthSegments * 5, heightSegments * 5, phiStart, -phiLength, thetaStart, -thetaLength
                ), new THREE.MeshPhongMaterial({map: textureObj.texture, color: 0xffffff}));
                Util.Scene.add(mesh);
            },
            addParticles: function () {
                // The number of particles in a particle system is not easily changed.
                var particleCount = 20000;

                Util.Scene.blackHoleRings = [];

                for (var i = 1; i < 10; i++) {
                    // Particles are just individual vertices in a geometry
                    // Create the geometry that will hold all of the vertices
                    var particles = new THREE.Geometry();

                    // Create the vertices and add them to the particles geometry
                    for (var p = 0; p < particleCount * i; p++) {

                        // This will create all the vertices in a range of -200 to 200 in all directions
                        var randomAngle = Math.random() * 2 * Math.PI;
                        var randomRadius = Math.random() * i * (i + 2) + radius * 6;
                        var x = randomRadius * Math.sin(randomAngle) ;
                        var y = Math.random() - 0.5;
                        var z = randomRadius * Math.cos(randomAngle);

                        // Create the vertex
                        var particle = new THREE.Vector3(x, y, z);

                        // Add the vertex to the geometry
                        particles.vertices.push(particle);
                    }

                    // Create the material that will be used to render each vertex of the geometry
                    var particleMaterial = new THREE.PointsMaterial(
                        {
                            color: new THREE.Color('rgb('+(255 - i)+', '+(255 - i * 10)+', '+(255 - i * 20)+')'),
                            size: 0.6,
                            blending: THREE.AdditiveBlending,
                            transparent: true
                        });

                    // Create & add the particle system
                    var blackHoleRing = new THREE.Points(particles, particleMaterial);
                    Util.Scene.add(blackHoleRing);

                    Util.Scene.blackHoleRings.push(blackHoleRing);
                }
            }
        };

    })(Util.ProgressBar, Util.TextureManager);

    if (!Detector.webgl) Detector.addGetWebGLMessage();

    if (window.GO_TO_HELL) {
        window.GO_TO_HELL = false;
        return window.GO_TO_HELL;
    }

    P.ajax(rootHref + 'build/json/vanished.love.textures.json').then(function (data) {
        var textureData = JSON.parse(data);

        Util.ProgressBar.init((textureData.length + 2) * 2);
        Util.TextureManager.init(textureData);
        Util.SceneManager.init();
    });

})(window.top.ES6Promise.Promise, window.top.Router.rootHref, window.top.Router, window.top.PageSlider);
