/**
 * Created by cls on 16/9/8.
 */
;(function (T, W) {
    if (!T) {
        return false;
    }

    // var paintCanvas = document.createElement('canvas');
    // paintCanvas.style.background = 'linear-gradient(to bottom, rgba(255,255,255,.5) 0%, rgba(246,246,246,.5) 47%, rgba(237,237,237,.5) 100%)';
    // paintCanvas.style.position = 'fixed';
    // paintCanvas.style.zIndex = 399999;
    // paintCanvas.style.right = '0';
    // paintCanvas.style.top = '0';
    // paintCanvas.width = 500;
    // paintCanvas.height = 300;
    // // document.body.appendChild(paintCanvas);
    // var paintCtx = paintCanvas.getContext('2d');
    // var fontFamily = 'Avenir, Helvetica Neue, Helvetica, Arial, sans-serif';
    // var fontSize = 100, gap = 4, factor = 20;
    //
    // function setFontSize(s) {
    //     paintCtx.font = 'bold ' + s + 'px ' + fontFamily;
    // }
    //
    // function isNumber(n) {
    //     return !isNaN(parseFloat(n)) && isFinite(n);
    // }

    W._3d = function (el) {

        var canvas = this.Canvas = document.querySelector(el);
        this.Camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 1, 2000);
        this.Scene = new THREE.Scene();
        this.Scene.add(new THREE.AmbientLight(0xffffff));

        this.RequestFrame = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
        this.Clock = new THREE.Clock();

    };

    W._3d.prototype.Action = function (statsFlag) {

        var canvas = this.Canvas, camera = this.Camera;

        var renderer = this.Renderer = new THREE.WebGLRenderer({canvas: canvas});
        renderer.setPixelRatio(W['devicePixelRatio']);
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);

        if (!!statsFlag) {
            var stats = this.Stats = new Stats();
            document.body.appendChild(stats.dom);
        }

        W.addEventListener('resize', function () {
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        }, false);

        return this;
    };

    W._3d.prototype.Loop = function (fn) {
        // ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

        var delta = this.Clock.getDelta();

        THREE.AnimationHandler.update(delta);
        this.Renderer.render(this.Scene, this.Camera);

        if (!!this.Stats) {
            this.Stats.update();
        }

        this.renderFn = !this.renderFn ? fn : this.renderFn;
        this.renderFn(delta);
        this.RequestFrame.call(W, this.Loop.bind(this));
    };

    W._3d.prototype.ProgressBar = function (pbEl) {

        var pbElement = document.querySelector(pbEl), upLen, up = 0, _totalLen, _cb = function () {
        }, _params = [], did = false;
        var self = this;

        return {
            init: function (totalLen) {
                upLen = 100 / totalLen;
                _totalLen = totalLen;
            },
            upTogo: function (high) {
                if (!!high) {
                    up = high / _totalLen * 100;
                } else {
                    up += upLen;
                }
                pbElement.innerHTML = up.toFixed(2) + '% completed';

                if (!did && 99.9 <= up) {
                    did = !did;

                    pbElement.style.display = 'none';

                    _cb.apply(null, _params);
                }
            },
            cb: function (cb, params) {
                _cb = cb;
                _params = params || [];
            }
        };

    };

    W._3d.prototype.Group = function (position) {

        var _position = position, root = new THREE.Object3D();

        root.position.x = _position.x;
        root.position.y = _position.y;
        root.position.z = _position.z;

        this.Scene.add(root);

        function set(mesh, pOffset, rotation) {
            mesh.position.x = pOffset.x;
            mesh.position.y = pOffset.y;
            mesh.position.z = pOffset.z;

            mesh.updateMatrix();

            if (Object.prototype.toString.call(rotation) === '[object Array]') {

                mesh.rotation.set.apply(null, rotation);

                mesh.updateMatrix();
            }
        }

        return {
            add: function (mesh, pOffset, rotation) {

                set(mesh, pOffset, rotation);

                root.add(mesh);

            },
            update: function (new_position, rotation) {

                set(root, new_position, rotation);

            }
        };

    };

    W._3d.prototype.VideoBox = function () {

        var self = this;
        self.globalCursor = 0;

        function findFrameLinear() {
            if (!self.aniSeq.length) {
                return null;
            }

            while (self.aniSeq[self.aniCursor].accumulatedDur < self.globalCursor) self.aniCursor++;

            var curKeyFrame = self.aniSeq[self.aniCursor];

            var duration = self.globalCursor - (self.aniCursor <= 0 ? 0 : self.aniSeq[self.aniCursor - 1].accumulatedDur);

        }

        return {
            init: function (ratio, keyProps) {
                self.ratio = ratio;
                self.keyProps = keyProps;

                self.aniSeq = [];
                self.aniCursor = 0;

                self.lastKeyFrame = null;

                return {
                    add: function (data) {//contains time prop, type: int
                        data.duration = 1000;
                        data.accumulatedDur = 0;

                        if (!self.lastKeyFrame) {
                            self.lastKeyFrame = data;
                            return this;
                        } else {
                            data.accumulatedDur = self.lastKeyFrame.accumulatedDur;
                        }

                        var duration = data.time - self.lastKeyFrame.time;

                        self.keyProps.forEach(function (p) {
                            self.lastKeyFrame['_v_' + p] = (data[p] -  self.lastKeyFrame[p]) / duration;
                        });

                        this.end(duration);

                        return this;
                    },
                    end: function (duration) {

                        if (duration !== undefined && duration > 0) {
                            self.lastKeyFrame.duration = duration;
                            self.lastKeyFrame.accumulatedDur += duration;
                        } else {
                            self.lastKeyFrame.accumulatedDur += self.lastKeyFrame.duration;
                        }

                        self.aniSeq.push(self.lastKeyFrame);
                        self.needsUpdate = true;

                        return this;
                    },
                    renderFn: function (fn) {
                        self.renderFn = fn;

                        return this;
                    }
                };
            },
            render: function (delta) {
                self.globalCursor += delta;

                var frame = findFrame();

                self.renderFn(frame);
            },
            len: function () {
                if (self.needsUpdate) {
                    self.len = self.aniSeq[self.aniSeq.length - 1].accumulatedDur;
                    self.needsUpdate = false;
                }
                return self.len;
            },
            goTo: function (time) {
                self.globalCursor = time;

                var frame = findFrame();

                self.renderFn(frame);
            }
        };

    };

})(THREE, window);