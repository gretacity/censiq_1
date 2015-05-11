/***************************************************************
 *  Functions related to identification
 */   
app.acquireQrCode = function() {
    app.acquireGeoCoordinates();
    barcodeReader.acquireQrCode(
        function(code) {
            $('#qrCode').val(code);
        }, 
        function(error) {
            helper.alert("Errore durante la scansione: " + error);
    });
}
app.acquireQrCodePoint = function() {
    app.acquireGeoCoordinates();
    barcodeReader.acquireQrCode(
        function(code) {
            $('#qrCode_point').val(code);
        }, 
        function(error) {
            helper.alert("Errore durante la scansione: " + error);
    });
}
/***************************************************************
 *  Functions related to geographical location
 */
app.acquireGeoCoordinates = function() {
        
    var $latLng = $('#latLng');
    
    $('#geoStatusText').removeClass('error').html('Recupero coordinate geografiche...');
    $('#getCoordinatesButton').addClass('ui-disabled');
    
    geoLocation.acquireGeoCoordinates(
        function(position) {
            // Update Census object
            app.census.position.latitude = position.coords.latitude;
            app.census.position.longitude = position.coords.longitude;
            app.census.position.accuracy = position.coords.accuracy;
            app.census.position.altitude = position.coords.altitude;
            
            $('#getCoordinatesButton').removeClass('ui-disabled');
            $latLng.val(position.coords.latitude + '/' + position.coords.longitude);

            $('#geoStatusTitle').html('Aggiorna');
            $('#geoStatusText').html('Posizione acquisita<br/>  Longitudine e Latitudine:' + app.census.position.toString()+ '<br/> Altitudine:' +app.census.position.altitude+'m');
            //console.log('tostring',app.census.position.altitude);
            if((position.coords.accuracy > config.GEO_OTPS_MINIMUM_ACCURACY_REQUIRED) &&
               (helper.isOnline())) {
                // Position is not so accurate
                page.injector.GeoCoordinatesAcquired(app.census.position);
                $('#correctPositionPanel').html(
                        //console.log('coord',);
                    "Le coordinate geografiche acquisite non sono sufficientemente accurate.<br />"+ 
                    "E' necessario interventire manualmente correggendo la posizione sulla mappa."
                );
                $('#openMapPanel').show();
            } else {
                // Position is accurate
                $('#openMapPanel').hide();
            }
        },
        function(errorMessage, error) {
            
            // Update Census object
            app.census.position.latitude = 0;
            app.census.position.longitude = 0;
            app.census.position.accuracy = 0;
            app.census.position.altitude = 0;
            
            $latLng.val('');
            $('#getCoordinatesButton').removeClass('ui-disabled');
            $('#geoStatusTitle').html('Riprova');
            $('#geoStatusText').addClass('error').html(errorMessage);
            $('#openMapPanel').hide();
        });
},


app.acquireGeoCoordinatesPoint = function() {
        
    var $latLng = $('#latLng');
    
    $('#geoStatusText').removeClass('error').html('Recupero coordinate geografiche...');
    $('#getCoordinatesButtonPoint').addClass('ui-disabled');
    
    geoLocation.acquireGeoCoordinates(
        function(position) {
            // Update Census object
            app.census.position.latitude = position.coords.latitude;
            app.census.position.longitude = position.coords.longitude;
            app.census.position.accuracy = position.coords.accuracy;
            app.census.position.altitude = position.coords.altitude;
            
            $('#getCoordinatesButtonPoint').removeClass('ui-disabled');
            $latLng.val(position.coords.latitude + '/' + position.coords.longitude);

            $('#geoStatusTitle').html('Aggiorna');
            $('#geoStatusText').html('Posizione acquisita<br/>  Longitudine e Latitudine:' + app.census.position.toString()+ '<br/> Altitudine:' +app.census.position.altitude+'m');
            //console.log('tostring',app.census.position.altitude);
            if((position.coords.accuracy > config.GEO_OTPS_MINIMUM_ACCURACY_REQUIRED) &&
               (helper.isOnline())) {
                // Position is not so accurate
                page.injector.GeoCoordinatesAcquired(app.census.position);
                $('#correctPositionPanel').html(
                        //console.log('coord',);
                    "Le coordinate geografiche acquisite non sono sufficientemente accurate.<br />"+ 
                    "E' necessario interventire manualmente correggendo la posizione sulla mappa."
                );
                $('#openMapPanel').show();
            } else {
                // Position is accurate
                $('#openMapPanel').hide();
            }
        },
        function(errorMessage, error) {
            
            // Update Census object
            app.census.position.latitude = 0;
            app.census.position.longitude = 0;
            app.census.position.accuracy = 0;
            app.census.position.altitude = 0;
            
            $latLng.val('');
            $('#getCoordinatesButtonPoint').removeClass('ui-disabled');
            $('#geoStatusTitle').html('Riprova');
            $('#geoStatusText').addClass('error').html(errorMessage);
            $('#openMapPanel').hide();
        });
},





/***************************************************************
 *  Functions related to maps service
 */
app._adjustedCoords = null;
app._map = null;
app._marker = null;
app.mapLoaded = function() {
    console.log('Map scripts was loaded');
}
app.openMap = function() {
    if(typeof(google) == 'undefined') {
        helper.alert('Il servizio mappe non &egrave; al momento disponibile');
        return false;
    }

    app._adjustedCoords = null;
    
    var lat = app.census.position.latitude;
    var lng = app.census.position.longitude;
    var alt = app.census.position.altitude;
    
    // ROADMAP, SATELLITE, HYBRID, TERRAIN 
    var options = {
        zoom: config.GOOGLE_MAPS_ZOOM,
        center: new google.maps.LatLng(lat, lng),
        mapTypeId: eval(config.GOOGLE_MAPS_TYPE_ID)
    };
    
    if(app._map == null) {
        app._map = new google.maps.Map(document.getElementById('map'), options);
        var markerPoint = new google.maps.LatLng(lat, lng);///---
        app._marker = new google.maps.Marker({
            position: markerPoint,
            map: app._map,
            draggable: true,
            animation: google.maps.Animation.DROP,
            title: 'Posizione del segnale'
        });
        google.maps.event.addListener(
                app._map,
                'click',
                function(e) {
                    app._marker.setPosition(e.latLng);
                    app._adjustedCoords = app._marker.getPosition();                
                    app.census.position.latitude =app._marker.getPosition().lat();
                    app.census.position.longitude =app._marker.getPosition().lng();
                    page.injector.GeoCoordinatesAcquired(app.census.position);   
                });
        google.maps.event.addListener(
            app._marker, 
            'dragend', 
            function() {
                app._adjustedCoords = app._marker.getPosition();                
                app.census.position.latitude =app._marker.getPosition().lat();
                app.census.position.longitude =app._marker.getPosition().lng();
                page.injector.GeoCoordinatesAcquired(app.census.position);             
            });
            
            
        setTimeout(function(){
            helper.maximizeMap('#map');
        },100);
    } else {
        var markerPoint = new google.maps.LatLng(lat, lng);
        app._marker.setPosition(markerPoint);
    }
    return true;
},

app.closeMap = function(confirmed) {
    if(confirmed) {
        if(app._adjustedCoords != null) {
            page.injector.GeoCoordinatesAcquired(app.census.position);
            //console.log('closemap',app.census.position);
            
            //app.census.position.latitude = app._adjustedCoords.lat();
            //app.census.position.longitude = app._adjustedCoords.lng();
            //app.census.position.accuracy = 0;
            $('#latLng').val(app.census.position.latitude+'/'+app.census.position.longitude);
        }
        $('#geoStatusText').html('Posizione acquisita<br/>  Longitudine e Latitudine:' + app.census.position.toString()+ '<br/> Altitudine:' +app.census.position.altitude+'m');
        $('#positionIsCorrect').val('1');
        $('#correctPositionPanel').show();
        $('#correctPositionPanel').html(
            "La posizione &egrave; stata corretta sulla mappa."
        );
    } else {
        $('#positionIsCorrect').val('0');
        $('#correctPositionPanel').hide();
    }
    
    $.mobile.changePage('#' + app.localizationPageId);
}




/***************************************************************
 *  Functions related to photo acquisition
 */   
app.acquirePhoto = function() {
    var viewType = $(this).attr('data-viewtype');
    camera.getPicture(function(imageData) {
        app.displayPhoto(imageData, viewType);
    }, function(e) {
        // Nooo... Display "Camera cancel" if user tap the back button
        // helper.alert(error);
        console.error(e);
    });
}
app.displayPhoto = function(imageData, viewType) {
//console.log(imageData);
    $page = $('#' + app.picturesPageId);
    // Set and display acquired image
    var $anchor = $('a[data-viewtype="' + viewType + '"][data-showview]', $page);
    $('img', $anchor).attr('src', 'data:image/jpeg;base64,' + imageData);
    $anchor.show();
    
    // Show the link to remove the photo
    $('a[data-viewtype="' + viewType + '"][data-removeview]', $page).show();
    
    // Hide the link to add a new photo
    $('a[data-viewtype="' + viewType + '"][data-addview]', $page).hide();
}

app.removePhoto = function(viewType) {
    $page = $('#' + app.picturesPageId);
    if(typeof(viewType) != 'string') {
        viewType = $(this).attr('data-viewtype');
    }
    // Hide picture
    var $anchor = $('a[data-viewtype="' + viewType + '"][data-showview]', $page);
    $('img', $anchor).attr('src', '');
    $anchor.hide();
    // Hide the link to remove this view
    $('a[data-viewtype="' + viewType + '"][data-removeview]', $page).hide();
    // Hide the link to add a new view
    $('a[data-viewtype="' + viewType + '"][data-addview]', $page).show();
}        


app.acquirePhotoSola = function() {
    var viewType = $(this).attr('data-viewtype');
    camera.getPicture(function(imageData) {
        app.displayPhotoSola(imageData, viewType);
    }, function(e) {
        // Nooo... Display "Camera cancel" if user tap the back button
        // helper.alert(error);
        console.error(e);
    });
}
app.displayPhotoSola = function(imageData, viewType) {
//console.log(imageData);
    $page = $('#' + app.picturesPageIdd);
    // Set and display acquired image
    var $anchor = $('a[data-viewtype="' + viewType + '"][data-showview]', $page);
    $('img', $anchor).attr('src', 'data:image/jpeg;base64,' + imageData);
    $anchor.show();
    
    // Show the link to remove the photo
    $('a[data-viewtype="' + viewType + '"][data-removeview]', $page).show();
    
    // Hide the link to add a new photo
    $('a[data-viewtype="' + viewType + '"][data-addview]', $page).hide();
}

app.removePhotoSola = function(viewType) {
    $page = $('#' + app.picturesPageIdd);
    if(typeof(viewType) != 'string') {
        viewType = $(this).attr('data-viewtype');
    }
    // Hide picture
    var $anchor = $('a[data-viewtype="' + viewType + '"][data-showview]', $page);
    $('img', $anchor).attr('src', '');
    $anchor.hide();
    // Hide the link to remove this view
    $('a[data-viewtype="' + viewType + '"][data-removeview]', $page).hide();
    // Hide the link to add a new view
    $('a[data-viewtype="' + viewType + '"][data-addview]', $page).show();
}    

app.showPhotoDialog = function() {
    var viewType = $(this).attr('data-viewtype');
    $('#photoPage img').attr('src', $('img', $(this)).attr('src'));
    $.mobile.changePage('#photoPage', {transition: 'flip'});
}
app.hidePhotoDialog = function() {
    $('#photoPage img').attr('src', '');
    $.mobile.back();
}

app.syncNow = function() {
    
    var syncButton = $('#syncNowButton');
    
    var itemId = app.census.id;
    if(itemId == 0) {
        // Used when come back from login page
        itemId = helper.getParamValue('id');
    }
    console.log("ITEM_ID",itemId)
    if((itemId || 0) == 0) {
        syncButton.addClass('ui-disabled');
        helper.alert('Impossibile sincronizzare', null, 'Sincronizza elemento');
        return;
    }
    
    var html = syncButton.html();
    syncButton.html("Sincronizzato...");
    syncButton.addClass('ui-disabled');
    
console.log('Synchronizing entity with ID ' + itemId);
    services.uploadEntity(itemId, function(parItemId, response) {
        //sincronizzato...
        syncButton.html("Sincronizzato");
        // Delete item from storage
        data.delete(parItemId, null);
        helper.alert('Sincronizzato', null, 'Sincronizza elemento');
    }, function(parItemId, loginRequired, errorMessage, errorCode) {
        syncButton.html("Impossibile sincronizzare");
        if(loginRequired) {
            var returnUrl = helper.getDocumentLocation();
            if((helper.getParamValue('id') || '') == '') {
                //returnUrl += '?id=' + parItemId;
                // Format URL according the following format: protocol/path/querystring/hash
                returnUrl = location.protocol + '//' + location.pathname + '?id=' + parItemId + location.hash;
            }
            document.location.href="login.html?returnurl=" + encodeURIComponent(returnUrl);
            return;
        }
        helper.alert('Si sono verificati errori durante la sincronizzazione\n' + errorMessage, null, 'Sincronizza elemento');
    });
    
    
}
