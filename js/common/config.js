var config = {
    
    EMULATE_ON_BROWSER: false,
    
    APP_NAME: "censiq",
    API_V: "1.0",
    
    DB_FILENAME: "censiq",          // Database file name
    DB_SCHEMA: "2.5",               // Version of database schema
    DB_NAME: "CensiQ",              // Display name of the database
    DB_SIZE: 1024 * 1024 * 50,      // Size in bytes: 1024 * 1024 * 1 equal to 1MB
    
    
    //USER_KEY: 'userdata',
    SESSION_ID_KEY: 'censiq_sessionid',
    
    
    MODE_DEBUG: 'D',
    MODE_RELEASE: 'R',
    RUNNING_MODE: 'R', //config.MODE_DEBUG,
    
    
    // To speed up development / testing
    // In release mode they must be empty
    QR_CODE_TEST: '',
    LOGIN_DEFAULT_USERNAME: '',
    LOGIN_DEFAULT_PASSWORD: '',
    
    
    URL_BASE: 'http://www.gretacity.com',
    URL_LOGIN: '/web/index.php?mode=module&p=login&t=login_app&s=app_login',
    URL_DATA_ROADSIGN: '/web/index.php?p=segnaletica_stradale&s=export&s_t=ss_segnale_new&mode=module',
    URL_DATA_TYPES: '/web/index.php?p=segnaletica_stradale&s=export&s_t=ss_segnaletica_tipologia&mode=module',
    
    
    URL_DATA_FILMS: '/web/index.php?p=segnaletica_stradale&s=export&s_t=ss_pellicola&mode=module',
    URL_DATA_SHAPES: '/web/index.php?p=segnaletica_stradale&s=export&s_t=ss_forma&mode=module',
    URL_DATA_SIZES: '/web/index.php?p=segnaletica_stradale&s=export&s_t=ss_dimensione&mode=module',
    URL_DATA_SUPPORTS: '/web/index.php?p=segnaletica_stradale&s=export&s_t=ss_supporto&mode=module',
    URL_SYNC_CITYASSET: '/web/index.php?mode=module&p=beni&t=censimenti&s=bn_censimento_edit_web&s_t=new_bene',
    URL_SYNC_ROADSIGN: '/web/index.php?mode=module&p=segnaletica_stradale&t=censimenti&s=ss_censimento_edit_web&s_t=new',
    URL_SYNC_GUARDRAIL: '/web/index.php?mode=module&p=guardrails&t=censimenti&s=gr_censimento_edit_web&s_t=new',
    URL_PASSO: '/web/getPasso.php',
    GOOGLE_MAPS_API_KEY: "",
    GOOGLE_MAPS_SENSOR: "true",
    GOOGLE_MAPS_ZOOM: 19,
    GOOGLE_MAPS_TYPE_ID: 'google.maps.MapTypeId.SATELLITE',
    
    GEO_OPTS_MAXIMUM_AGE: 3000,
    GEO_OPTS_TIMEOUT: 5000,
    GEO_OPTS_HIGH_ACCURACY: true,
    // Minimum accuracy level required of the latitude
    // and longitude coordinates in meters
    GEO_OTPS_MINIMUM_ACCURACY_REQUIRED: 3,
    
    CAMERA_QUALITY: 25, //25
    CAMERA_CORRECT_ORIENTATION: true,
    CAMERA_TARGET_WIDTH: 1600, //300, null
    CAMERA_TARGET_HEIGHT: 1200, //400, null
    CAMERA_SAVE_TO_PHOTO_ALBUM: false,
    CAMERA_ALLOW_EDIT: false,
    
    
    //ROADSIGN_BASE_PATH_ICONS: 'img/Segnali/',
    ROADSIGN_BASE_PATH_ICONS: 'RoadsignIcons/',
    
    
    USE_WIFI_ONLY_KEY: 'censinq_usewifi',
    getUseWifiOnly: function() {
        var useWifi = window.localStorage.getItem(config.USE_WIFI_ONLY_KEY);
        if(typeof(useWifi) == 'string') useWifi = JSON.parse(useWifi);
        return (useWifi == null) ? true : useWifi;
    },
    setUseWifiOnly: function(wifiOnly) {
        window.localStorage.setItem(config.USE_WIFI_ONLY_KEY, wifiOnly);
    },
    
    
    
    SERVER_DATA_LAST_UPDATE_KEY: 'censiq_serverdatalastupdate',
    getServerDataLastUpdate: function() {
        var lastUpdate = window.localStorage.getItem(config.SERVER_DATA_LAST_UPDATE_KEY);
        if(typeof(lastUpdate) == 'string') {
            lastUpdate = new Date(lastUpdate); //JSON.parse(lastUpdate);
        }
        return lastUpdate;
    },
    setServerDataLastUpdate: function(lastUpdate) {
        window.localStorage.setItem(config.SERVER_DATA_LAST_UPDATE_KEY, lastUpdate);
    },
    

    FIRST_UPDATE_NOTIFICATION_KEY: 'censiq_firstupdatenotification',
    getFirstUpdateNotification: function() {
        return (window.localStorage.getItem(config.FIRST_UPDATE_NOTIFICATION_KEY) || false);
    },
    setFirstUpdateNotification: function(notified) {
        window.localStorage.setItem(config.FIRST_UPDATE_NOTIFICATION_KEY, !!notified);
    },
    
    
    NATIVE_BASE_URL_KEY: 'censiq_nativebaseurl',
    getNativeBaseURL: function() {
        return (window.localStorage.getItem(config.NATIVE_BASE_URL_KEY) || '');
    },
    setNativeBaseURL: function(url) {
        window.localStorage.setItem(config.NATIVE_BASE_URL_KEY, url);
    }
    
};


// Set the EMULATE_ON_BROWSER property
config.EMULATE_ON_BROWSER = (typeof(cordova) == 'undefined');
if(config.EMULATE_ON_BROWSER) {
    // If cordova is not found, this object must be defined anyway
    PositionError = {PERMISSION_DENIED: 1,
                     POSITION_UNAVAILABLE: 2,
                     TIMEOUT: 3};
    
    /*window.requestFileSystem = window.webkitRequestFileSystem;
    LocalFileSystem = {};
    LocalFileSystem.PERSISTENT = window.PERSISTENT;
    LocalFileSystem.TEMPORARY = window.TEMPORARY;*/
}
//config.EMULATE_ON_BROWSER = true;


if(config.RUNNING_MODE == config.MODE_DEBUG) {
    config.QR_CODE_TEST = '1000000065';
    config.LOGIN_DEFAULT_USERNAME = 'marcellinara';
    config.LOGIN_DEFAULT_PASSWORD = 'marcellinara';
}






// Extends Date class
Date.prototype.toYMD = function() {
    var year, month, day;
    year = String(this.getFullYear());
    month = String(this.getMonth() + 1);
    if(month.length == 1) {
        month = "0" + month;
    }
    day = String(this.getDate());
    if(day.length == 1) {
        day = "0" + day;
    }
    return year + "-" + month + "-" + day;
}
Date.prototype.toYMDHMS = function() {
    var hh, mm, ss;
    hh = String(this.getHours());
    if(hh.length == 1) hh = "0" + hh;
    mm = String(this.getMinutes());
    if(mm.length == 1) mm = "0" + mm;
    ss = String(this.getSeconds());
    if(ss.length == 1) ss = "0" + ss;
    return this.toYMD() + " " + hh + ":" + mm + ":" + ss;
}
Date.prototype.toDMY = function() {
    var year, month, day;
    year = String(this.getFullYear());
    month = String(this.getMonth() + 1);
    if(month.length == 1) {
        month = "0" + month;
    }
    day = String(this.getDate());
    if(day.length == 1) {
        day = "0" + day;
    }
    return day + "/" + month + "/" + year;
}

Date.prototype.toDMYHMS = function() {
    var hh, mm, ss;
    hh = String(this.getHours());
    if(hh.length == 1) hh = "0" + hh;
    mm = String(this.getMinutes());
    if(mm.length == 1) mm = "0" + mm;
    ss = String(this.getSeconds());
    if(ss.length == 1) ss = "0" + ss;
    return this.toDMY() + " " + hh + ":" + mm + ":" + ss;
}
Date.parseFromYMDHMS = function(dateText) {
    var parts = dateText.split(' ');
    var dateParts = parts[0].split('-');
    var timeParts = parts[1].split(':');
    return new Date(dateParts[0], parseInt(dateParts[1])-1, 
                    dateParts[2], timeParts[0], timeParts[1], timeParts[2]);
}

