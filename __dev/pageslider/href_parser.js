;(function(){

  window.top.parseHref = window.top.parseHref || function() {
    var domain = 'caols.tech';
    var isProductEnv = domain === document.domain;
    var regExp = new RegExp('^http.*?\/\/.*?(\/.*?'+domain+'\/)(.*)$');
    var matched = window.location.href.toString().match(regExp);
    var rootHref = isProductEnv ? '/' : matched[1];

    return {
      hrefParseInfo: matched,
      rootHref: rootHref
    };
  };

})();
