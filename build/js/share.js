/**
 * Created by cls on 16/9/25.
 */
;(function () {

    wx.ready(function () {
        var shareData = {
            title: 'title',
            desc: 'desc',
            link: window.location.href.split('#')[0],
            // imgUrl:
        };
        wx.onMenuShareAppMessage(shareData);
        wx.onMenuShareTimeline(shareData);
    });

    wx.error(function (res) {
        console.log(res.errMsg);
    });

})();
