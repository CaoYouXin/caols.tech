/**
 * Created by cls on 16/9/22.
 */
;(function () {

    /**
     *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
     *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables */
    window.disqus_config = function () {
        var match = location.href.toString().match(/(build\/(.*))/);

        this.page.url = location.href.toString();  // Replace PAGE_URL with your page's canonical URL variable
        this.page.identifier = match[2]; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
    };
    (function() { // DON'T EDIT BELOW THIS LINE
        var d = document, s = d.createElement('script');
        s.src = '//clstech.disqus.com/embed.js';
        s.setAttribute('data-timestamp', ''+new Date());
        (d.head || d.body).appendChild(s);
    })();

})();
