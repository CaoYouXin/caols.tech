/**
 * MobileWeb 通用功能助手，包含常用的 UA 判断、页面适配、search 参数转 键值对。
 * 该 JS 应在 head 中尽可能早的引入，减少重绘。
 *
 * fixScreen 方法根据两种情况适配，该方法自动执行。
 *      1. 定宽： 对应 meta 标签写法 -- <meta name="viewport" content="target-densitydpi=device-dpi,width=750">
 *          该方法会提取 width 值，主动添加 scale 相关属性值。
 *          注意： 如果 meta 标签中指定了 initial-scale， 该方法将不做处理（即不执行）。
 *      2. REM: 不用写 meta 标签，该方法根据 dpr 自动生成，并在 html 标签中加上 data-dpr 和 font-size 两个属性值。
 *          该方法约束：IOS 系统最大 dpr = 3，其它系统 dpr = 1，页面每 dpr 最大宽度（即页面宽度/dpr） = 750，REM 换算比值为 16。
 *          对应 css 开发，任何弹性尺寸均使用 rem 单位，rem 默认宽度为 视觉稿宽度 / 16;
 *              scss 中 $ppr(pixel per rem) 变量写法 -- $ppr: 750px/16/1rem;
 *                      元素尺寸写法 -- html { font-size: $ppr*1rem; } body { width: 750px/$ppr; }。
 */
window.mobileUtil = (function (win, doc) {

    'use strict';

    var UA = navigator.userAgent,
        isAndroid = /android|adr/gi.test(UA),
        isIos = /iphone|ipod|ipad/gi.test(UA) && !isAndroid, // 据说某些国产机的UA会同时包含 android iphone 字符
        isMobile = isAndroid || isIos;  // 粗略的判断

    return {
        fixScreen: function () {
            var data = {
                width: win.screen.availWidth > 1080 ? win.screen.availWidth : 800
            }, metaEl = doc.querySelector('meta[name="viewport"]');
            data['initial-scale'] = data['maximum-scale'] = data['minimum-scale'] = 1;

            if (isMobile) {
                var scale = win.screen.availWidth / data.width;

                scale = scale.toFixed(10);


                var _onload = window.onload || function () {

                    };
                window.onload = function () {
                    _onload();
                    document.body.style.width = data.width + 'px';
                    document.body.style.zoom = scale;
                }
            }

            metaEl.content = JSON.stringify(data).replace(/\s*/g, '').replace(/[{}"]/g, '').replace(/:/g, '=');
        }
        // alert(JSON.stringify(data));
    };
})
(window, document);

// 默认直接适配页面
window.mobileUtil.fixScreen();
