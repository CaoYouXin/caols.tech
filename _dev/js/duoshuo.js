/**
 * Created by cls on 16/9/22.
 */
;(function () {

    var duoshuo = document.createElement('div');
    duoshuo.classList.add('ds-thread');
    var url = location.href.toString();
    duoshuo.setAttribute('data-url', url);
    var buildUrl = url.match(/(build\/(.*html))/)[2];
    duoshuo.setAttribute('data-thread-key', buildUrl);
    var meta = document.querySelector('meta[name="post-name"]');
    duoshuo.setAttribute('data-title', null !== meta ? meta.getAttribute('content') : buildUrl);

    (document.querySelector('section.post-content') || document.querySelector('section.main-content')).appendChild(duoshuo);

    var protocol = (("https:" == document.location.protocol) ? " https://" : " http://");
    var scriptsLive = (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]);

    window.duoshuoQuery = {short_name: "clstech"};
    var ds = document.createElement('script');
    ds.type = 'text/javascript';
    ds.async = true;
    ds.src = protocol + '//static.duoshuo.com/embed.js';
    ds.charset = 'UTF-8';
    scriptsLive.appendChild(ds);

})();
