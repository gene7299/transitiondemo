// From here, with a few improvements (options classes argument, ability to pass plain text in):
// http://stackoverflow.com/questions/118241/calculate-text-width-with-javascript

(function($) {
    "use strict";
    $.fn.textMetrics = function(classes) {
        //return this.each(function() {
        var h = 0,
            w = 0;

        var divo = document.createElement('div');
        document.body.appendChild(divo);
        var div = $(divo);
        div.css({
            position: 'absolute',
            left: -1000,
            top: -1000,
            display: 'none'
        });
        var el = this;
        // 'el' might be html, or just plain text:
        div.html($(el).html() || el);
        // add any custom classes first:
        div.addClass($.makeArray(classes).join(' '));
        var styles = ['font-size', 'font-style', 'font-weight', 'font-family', 'line-height', 'text-transform', 'letter-spacing'];
        $(styles).each(function() {
            var s = this.toString();
            div.css(s, $(el).css(s));
        });

        h = div.outerHeight();
        w = div.outerWidth();

        div.remove();

        var ret = {
            height: h,
            width: w
        };

        return ret;
        //});

    };

})(jQuery);
