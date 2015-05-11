var app = {
    
    STEP_0: 0,
    STEP_1: 1,
    STEP_2: 2,
    
    census: new Census(CensusTypes.cityAsset),
    
    localizationPageId: 'cityAssetStep0Page',
    picturesPageId: 'cityAssetStep1Page',
    
    // Application Constructor
    initialize: function() {
        // Inject common page
        page.injector.injectPage('#cityAssetStep0Page', 'localize', {title: 'Bene Comunale', footerText: '1 di 3'});
        page.injector.injectPage('#cityAssetStep1Page', '3pictures', {title: 'Bene Comunale', footerText: '2 di 3'});
        page.injector.injectPage('#summaryPage', 'summary', {continueLink: '#cityAssetStep0Page'});
        // Fill city asset type select
        var html = '<option value="0">- Seleziona -</option>';
        var cityAssetTypes = data.cityAsset.createTypeTree(data.cityAsset.getTypes());
        for(var i in cityAssetTypes) {
            if(cityAssetTypes[i].children.length == 0) continue;
            html += '<optgroup label="' + cityAssetTypes[i].name + '">';
            for(var j in cityAssetTypes[i].children) {
                var t = cityAssetTypes[i].children[j];
                html += '<option value="' + t.id + '">' + t.name + '</option>';
            }
            html += '</optgroup>';
        }
        $('#cityAssetType').html(html);
        
        this.bindEvents();
    },
    
    
    // Bind Event Listeners
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        // Force onDeviceReady if it's a browser
        if(config.EMULATE_ON_BROWSER) this.onDeviceReady();
        // For Android devices
        document.addEventListener("backbutton", function(e) {
            e.preventDefault();
            //window.location.href = 'index.html';
        }, false);
        $('.prev-step').on('click', app.previousStep);
        $('.next-step').on('click', app.stepCompleted);
        // Step 0: first step
        var $page0 = $('#cityAssetStep0Page');
        $('#acquireQrCodeButton', $page0).on('click', app.acquireQrCode);
        $('#getCoordinatesPanel', $page0).on('click', app.acquireGeoCoordinates);
        $('#openMapPageButton', $page0).on('click', function() {
            //helper.maximizeContent();
            setTimeout(function() {
                var success = app.openMap();
                if(!success) return;
                $.mobile.changePage('#mapPage', {
                    transition: 'slide',
                    reverse: false,
                    changeHash: false
                });
            }, 100);
        });        
        // Step1: second step
        var $page1 = $('#cityAssetStep1Page');
        $('a[data-addview]', $page1).on('click', app.acquirePhoto);
        $('a[data-removeview]', $page1).on('click', app.removePhoto);
        //$('a[data-showview]', $page1).on('click', app.showPhotoDialog);
        $('#photoPage a').on('click', app.hidePhotoDialog);
        // Step 2 Last step
    },
    
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        $('#qrCode').val(config.QR_CODE_TEST);
        // Load external scripts only if the wifi connection is available
        if(helper.isOnline()) {
            if(typeof(google) == "undefined") {
                /*
                var googleMapsRef = document.createElement('script');
                googleMapsRef.setAttribute("type", "text/javascript");
                googleMapsRef.setAttribute("src", "https://maps.googleapis.com/maps/api/js?key="+config.GOOGLE_MAPS_API_KEY+"&sensor="+config.GOOGLE_MAPS_SENSOR);
                alert('loaded\n' + googleMapsRef.getAttribute("src"));
                 */
                $.getScript("https://maps.googleapis.com/maps/api/js?callback=app.mapLoaded&key="+config.GOOGLE_MAPS_API_KEY+"&sensor="+config.GOOGLE_MAPS_SENSOR, function( data, textStatus, jqxhr ) {
                    console.log("Google Maps scripts was loaded" );
                });
            }
        }
    },
    
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        if(parentElement) {
            var listeningElement = parentElement.querySelector('.listening');
            var receivedElement = parentElement.querySelector('.received');
            
            listeningElement.setAttribute('style', 'display:none;');
            receivedElement.setAttribute('style', 'display:block;');
        }
        console.log('Received Event: ' + id);
    },
    
    
    
    validateStep: function(stepIndex, stepValidCallback, stepNotValidCallback) {
        var errors = [];
        if(stepIndex == app.STEP_0) {
            // Validate step 0
            if($.trim($('#qrCode').val()) == '') {
                errors.push('specificare il QR-code');
                stepNotValidCallback(errors);
            } else if($.trim($('#latLng').val()) == '') {
                helper.confirm('La posizione GPS non &egrave; stata specificata.\nVuoi procedere comunque?', function(buttonIndex) {
                    if(buttonIndex == 2) {
                        stepNotValidCallback();
                    } else {
                        stepValidCallback();
                    }
                }, 'Localizzazione GPS', ['Si', 'No']);
            } else {
                stepValidCallback();
            }
        } else if(stepIndex == app.STEP_1) {
            // Validate step 1
            stepValidCallback();
        } else if(stepIndex == app.STEP_2) {
            // Validate step 2
            if($('#cityAssetType').val() == 0) {
                errors.push('selezionare la tipologia');
            }
            if($.trim($('#cityAssetName').val()) == '') {
                errors.push('specificare il nome');
            }
            if(errors.length > 0) {
                stepNotValidCallback(errors);
            } else {
                stepValidCallback();
            }
        }
    },
    
    
    stepStarted: function() {
    },
    stepCompleted: function() {
        //event.preventDefault();
        // Current step
        var step = $(this).attr('data-step');
        // Valitate step once completed
        app.validateStep(step, function() {
            // Success: move forward
            if(step == app.STEP_0) {
                $.mobile.changePage('#cityAssetStep1Page');
            } else if(step == app.STEP_1) {
                $.mobile.changePage('#cityAssetStep2Page');
            } else if(step == app.STEP_2) {
                app.save();
            }
        }, function(errors) {
            // Validation failed: display an error message if there is at least one
            if(Array.isArray(errors) && errors.length > 0) {
                helper.alert("Prima di procedere &egrave; necessario " + errors.join(' e '), null, "Avviso");
            }
        });
    },
    previousStep: function() {
        //event.preventDefault();
        // Current step
        var step = $(this).attr('data-step');
        if(step == app.STEP_0) {
            //$.mobile.changePage('index.html#censusTypePage');
            $.mobile.changePage('index.html');
            //$.mobile.back();
        } else if(step == app.STEP_1) {
            $.mobile.changePage('#cityAssetStep0Page');
            return;
        } else if(step == app.STEP_2) {
            $.mobile.changePage('#cityAssetStep1Page');
            return;
        }
    },
    
    
    save: function() {

        // Before saving let's validate the last step:
        // "type" and "name" are required fields.
        /*var errors = app.validateStep(app.STEP_2);
        if(errors.length > 0) {
            helper.alert("Prima di salvare è necessario " + errors.join('\n e '), null, "Avviso");
            return;
        }*/
        
        // Form is valid, proceed with saving.
        // Disable save button
        $('#saveButton').addClass('ui-disabled');
        
        // Update the Census entity...
        app.census.dateAdded = new Date();
        app.census.qrCode = $('#qrCode').val();
        //app.census.position.latitude = '';    // Already set
        //app.census.position.longitude = '';   // Already set
        //app.census.position.accuracy = '';    // Already set
        app.census.fixedOnMap = $('#positionIsCorrect').val();
        
        // Pictures related to the city asset
        var imageKeys = ['front', 'back', 'perspective'];
        for(var i in imageKeys) {
            var k = imageKeys[i];
            var imageSrc = $('#cityAssetStep1Page a[data-viewtype="' + k + '"][data-showview] img').attr('src');
            if(imageSrc != '') {
                // Remove this from src attribute:
                // data:image/jpeg;base64,
                app.census.pictures[k] = imageSrc.substr(23);
            }
        }
        
        app.census.cityAsset.assetType = $('#cityAssetType').val();
        app.census.cityAsset.assetName = $('#cityAssetName').val();
        app.census.cityAsset.description = $('#cityAssetDescription').val();
        app.census.cityAsset.notes = $('#cityAssetNotes').val();
        
        // ...and save it
        data.save(app.census);
        
        
        // Once saved the census, empty fields of all the steps
        var $page = $('#cityAssetStep0Page');
        $('input[type="text"]', $page).val('');
        $('input[type="hidden"]', $page).val('');
        $('#geoStatusText', $page).html('Latitudine e longitudine');
        $('#geoStatusTitle', $page).html('Ottieni');
        $('#openMapPanel', $page).hide();
        $page = $('#cityAssetStep1Page');
        $('input[type="text"]', $page).val('');
        $('input[type="hidden"]', $page).val('');
        app.removePhoto('front');
        app.removePhoto('back');
        app.removePhoto('perspective');
        $page = $('#cityAssetStep2Page');
        $('input[type="text"]', $page).val('');
        $('input[type="hidden"]', $page).val('');
        $('textarea', $page).val('');
        $('select', $page).val(0);
        $('#saveButton', $page).removeClass('ui-disabled');
        $('#syncNowButton').removeClass('ui-disabled').html('Sincronizza subito');
        
        // Speed up development/testing
        $('#qrCode').val(config.QR_CODE_TEST);
        
        // Move to the last page of the wizard
        $.mobile.changePage('#summaryPage', {
            transition: 'slide'
        });
    }
    
};
