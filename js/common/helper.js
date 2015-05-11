
var helper = {
    
    isOnline: function() {

        if(config.EMULATE_ON_BROWSER) return true;
        
        if(typeof(navigator.connection) == 'undefined') {
            alert('Impossibile stabilire il tipo di connessione');
            return false;
        }
        
        return config.getUseWifiOnly() ? (navigator.connection.type == Connection.WIFI) :
                                         (navigator.connection.type != Connection.NONE);
    },
    
    
    getDocumentLocation: function() {
        return document.location.toString().substr(document.location.href.indexOf('/www/') + 5);
    },
    
    // Get parameter value from query string
    getParamValue: function(name) {
        return (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1];
    },
    
    _maximizeContent: function() {
        window.scrollTo(0,0);
        var winhigh = $.mobile.getScreenHeight(); //Get available screen height, not including any browser chrome
        var headhigh = $('[data-role="header"]').first().outerHeight(); //Get height of first page's header
        var foothigh = $('[data-role="footer"]').first().outerHeight(); //Get height of first page's header
        var $content=$('[data-role="main"]');
        var contentpaddingwidth=parseInt(($content.css("padding-left")||'').replace("px", ""))+parseInt(($('[data-role="main"]').css("padding-right")||'').replace("px", ""));
        var contentpaddingheight=parseInt(($content.css("padding-top")||'').replace("px", ""))+parseInt(($('[data-role="main"]').css("padding-bottom")||'').replace("px", ""));
        winhigh = winhigh - headhigh - foothigh - contentpaddingheight; 
        winwide = $(document).width(); //Get width of document
        winwide = winwide - contentpaddingwidth; 
        $content.css('width',winwide + 'px').css('height',winhigh + 'px'); //Change div to maximum visible area
    },
    
    
    
    
    alert: function(message, callback, title, buttonName) {
        if(config.EMULATE_ON_BROWSER) {
            alert(message);
            if(callback != null) callback();
        } else {
            navigator.notification.alert(message, callback, title, buttonName);
        }
    },
    
    confirm: function(message, callback, title, buttonLabels)  {
        if(config.EMULATE_ON_BROWSER) {
            var result = confirm(message);
            if(callback != null) {
                callback(result ? 1 : 2);
            }
        } else {
            navigator.notification.confirm(message, callback, title, buttonLabels);
        }
    },
    
    
    
    toArray: function(list) {
        return Array.prototype.slice.call(list || [], 0);
    },

////////////////////////////
    // Common functions
     
    maximizeMap: function(map) {
        var mapEl = (typeof(map) == 'string') ? $(map) : map;
        var page = mapEl.closest('div[data-role="page"]');
//console.log("ID PAGE",page);
        var pageHeight = page.outerHeight();
//console.log("Altezza PAGE",pageHeight);
        var height = 0;
        height += $('div[data-role="header"]', page).outerHeight();
//console.log("ALTEZZA HEADER",height);
        height += $('div[data-role="footer"]', page).outerHeight();
//console.log("ALTEZZA FOOTER + HEADER",height);
        $('div[data-role="main"]', page).children(':visible').each(function() {
            var el = $(this);
            if(el.attr('id') != mapEl.attr('id')) {
                height += el.outerHeight();
            }
        });
//console.log("ALTEZZA TOTALE",height);
        mapEl.height(
            pageHeight - height-height
        );
//console.log("ALTEZZA MAPPA",mapEl.height());
    }
}