
var geoLocation = {
    
    
    loadGoogleMapsScript: function(callbackName) {
        /*
        var googleMapsRef = document.createElement('script');
        googleMapsRef.setAttribute("type", "text/javascript");
        googleMapsRef.setAttribute("src", "https://maps.googleapis.com/maps/api/js?key="+config.GOOGLE_MAPS_API_KEY+"&sensor="+config.GOOGLE_MAPS_SENSOR);
        alert('loaded\n' + googleMapsRef.getAttribute("src"));
         */
        var url = "https://maps.googleapis.com/maps/api/js?";
        if(callbackName != "")
            url += "callback=" + callbackName + "&";
        url += "key="+config.GOOGLE_MAPS_API_KEY+"&sensor="+config.GOOGLE_MAPS_SENSOR;
        
        $.getScript(url, function( data, textStatus, jqxhr ) {
            //
            //console.log(data ); // Data returned
            //console.log(textStatus ); // Success
            //console.log(jqxhr.status ); // 200
            console.log("Google Maps scripts was loaded" );
        });
    },    
    
    
    acquireGeoCoordinates: function(successCallback, errorCallback) {
        
        var options = {maximumAge: config.GEO_OPTS_MAXIMUM_AGE,
                       timeout: config.GEO_OPTS_TIMEOUT, 
                       enableHighAccuracy: config.GEO_OPTS_HIGH_ACCURACY};
        
        
        if(config.EMULATE_ON_BROWSER) {
            //errorCallback('errorino');return;
            if(successCallback) {
                //var lat = 38.858364, lng = 16.549469, accuracy = 15;
                var lat = 38.9059348, lng =16.5979429, accuracy = 15, altitude=10;
                successCallback(
                    {coords: {longitude: lng, latitude: lat, accuracy: accuracy, altitude: altitude}}
                );
            }
            return;
        }
        
        navigator.geolocation.getCurrentPosition(function(position) {  
            //console.log
            // success
            if(successCallback) successCallback(position);
        }, function (error) {
            // error
            // Impossibile recuperare le coordinate geografiche.                                                    
            var errorMessage = '';
            switch(error.code) {
                // Returned when the user does not allow your application to 
                // retrieve position information.
                // This is dependent on the platform.
                case PositionError.PERMISSION_DENIED:
                    errorMessage = 'Permesso negato';
                    break;
                    
                // Returned when the device was unable to retrieve a position.
                // In general this means the device has no network connectivity
                // and/or cannot get a satellite fix.
                case PositionError.POSITION_UNAVAILABLE:
                    errorMessage = 'Posizione non disponibile';
                    break;
                    
                // Returned when the device was unable to retrieve a position
                // within the time specified in the geolocationOptions' timeout
                // property.
                case PositionError.TIMEOUT:
                    errorMessage = 'Impossibile recuperare la posizione';
                    break;
            }
            if(errorCallback) errorCallback(errorMessage, error);
        }, options);
    },
    
    reverseGeocoding: function(params, successCallback) {
        //console.log('params',params);
            //var lat = params.lat;
            //var lng = params.lng;
            //params.lat=41.4731791;
            //params.lng=12.8893273;
    //*params.lat = 38.827707; params.lng = 16.628456; // Via Caprera 144
    //params.lat = 38.827512; params.lng = 16.627475; // Via Niccoloso da Recco 6
            //geoLocation._googleReverseGeocoding(params, successCallback);
            geoLocation._osmReverseGeocoding(params, successCallback);
        },
        _osmReverseGeocoding: function(params, successCallBack) {
        // http://nominatim.openstreetmap.org/reverse?lat=38.858364&lon=16.549469&format=json&addressdetails=1&zoom=18
        var url = 'http://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&zoom=18&lat=' + params.latitude +'&lon=' + params.longitude;
        
        $.get(url, function(result) {
            console.log("result",result);
            var retVal = {
                prov: result.address.county,
                city: result.address.city,
                town: result.address.town,
                village: result.address.village,
                road: result.address.road,
                streetNumber: result.address.street_number,
            };
            successCallBack(retVal);
        });
    }
    
    
}