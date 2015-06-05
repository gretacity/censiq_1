var app = {
    
    STEP_0: 0,
    STEP_1: 1,
    STEP_2: 2,
    STEP_3: 3,
    STEP_4: 4,
    STEP_5: 5,
    STEP_6: 6,
    STEP_7: 7,
    STEP_8: 8,
    STEP_9: 9,
    STEP_10: 10,
    STEP_20:20,
    ACQ_GPS:true,
    ID_GPS:0,  
    ACQ:false,
    SELECTED_QRCODE: null,
    MAP:false,
    RESULT:null,

    census: new Census(CensusTypes.roadSign),
    picturesPageId: 'roadSignStep3Page',
    pageOffsetTop: 0,
    
    // Application Constructor
    initialize: function() 
    {
        // Custom fields used for localization (street , no/km)
        page.injector.injectPage('#roadSignStep3Page', '3pictures', {title: 'Segnaletica', footerText: '4 di 6',dataStep:'3'});
        page.injector.injectPage('#summaryPage', 'summary', {continueLink: '#roadSignStep0Page'});
        
        // Road Sign shapes
        var html = '<option>Qualsiasi forma</option>';
        var roadSignShapes = data.roadSign.getRoadSignShapes();
        for(var i in roadSignShapes) {
            html += '<option>' + roadSignShapes[i].name + '</option>';
        }
        $('#roadSignShapeList').html(html);
        
        // Bracket diameters
        html = '<option></option>';
        var bracketDiameters = data.roadSign.getBracketDiameters();
        for(var i in bracketDiameters) {
            html += '<option>' + bracketDiameters[i] + '</option>';
        }
        $('#poleDiameter').html(html);
        $('#upwindPoleDiameter').html(html);
        
        this.bindEvents();        
    },
    
    
    
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        
        document.addEventListener('deviceready', this.onDeviceReady, false);
        $('#roadSignStep1Page').on('pageshow', this.showMapPositionPage);
        $('#roadSignStep2Page').on('pageshow',  this.acquireCoords);
        $('#roadSignStep4Page').on('pageshow',  app.addRoadSignPanel);
        $('#resultPage').on('pageshow',  app.loadResult);

        
        
        
        // Force onDeviceReady if it's a browser
        if(config.EMULATE_ON_BROWSER) this.onDeviceReady();
        $('.prev-step').on('click', this.previousStep);
        $('.next-step').on('click', this.stepCompleted);
        // Step 0
        var $page0 = $('#roadSignStep0Page');
        $('#acquireQrCodeButton', $page0).on('click', this.acquireQrCode);
        
        // Step3
        var $page3 = $('#roadSignStep3Page');
        $('a[data-addview]', $page3).on('click', this.acquirePhoto);
        $('a[data-removeview]', $page3).on('click', this.removePhoto);
        //$('a[data-showview]', $page1).on('click', this.showPhotoDialog);
        $('#photoPage a').on('tap', this.hidePhotoDialog);
        // Step4
        
        var $page4 = $('#roadSignStep4Page');
        $('#addRoadSignButton').on('click', app.addRoadSignPanel);
        
        
        $('div[data-role="dialog"]').on('create', function() {
            app.pageOffsetTop = $(this).offset().top;
        });
        $('div[data-role="dialog"]').on('pagehide', function() {
            $.mobile.silentScroll(app.pageOffsetTop);
        });
    },
    
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        $('#qrCode').val(config.QR_CODE_TEST);
        // For Android devices
        document.addEventListener("backbutton", function(e) {
            e.preventDefault();
            //window.location.href = 'index.html';
        }, false);
        // Load external scripts only if the wifi connection is available
        if(helper.isOnline()) {
            if(typeof(google) == "undefined") {
                geoLocation.loadGoogleMapsScript('app.mapLoaded');
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
            if($.trim($('#qrCode').val()) == '')
            {
                errors.push('specificare il QR-code');
                stepNotValidCallback(errors);
            } 
            else
            {
                if( typeof(google) != 'undefined')
                {     
                    services.getPasso($.trim($('#qrCode').val()),
                    function(result)
                    {
                       app.showResult(result)

                    },
                    function(jqXHR, textStatus, errorThrown)
                    {
                        stepValidCallback(); 
                    }
                    );
                }
                else
                {
                    stepValidCallback(); 
                }    
                
            }
        } else if(stepIndex == app.STEP_1) {
            
            // Validate step 1
            stepValidCallback();
        } else if(stepIndex == app.STEP_2) {
            
            if($.trim($('#comune','#roadSignStep2Page').val()) == '')
            {
                errors.push('specificare Comune');
                stepNotValidCallback(errors);
                return false;
            }
            if($.trim($('#provincia','#roadSignStep2Page').val()) == '')
            {
                errors.push('specificare Provincia');
                stepNotValidCallback(errors);
                return false;
            }
            if($.trim($('#street','#roadSignStep2Page').val()) == '')
            {
                errors.push('specificare Strada/Via');
                stepNotValidCallback(errors);
                return false;
            }
            if($.trim($('#streetNumber','#roadSignStep2Page').val()) == '')
            {
                errors.push('specificare Civico/Km');
                stepNotValidCallback(errors);
                return false;
            }
            stepValidCallback();
            
            
        } else if(stepIndex == app.STEP_3) {
            // Validate step 3
            stepValidCallback();
        }
        else if(stepIndex == app.STEP_4) {
            // Validate step 4
            stepValidCallback();
        }
         else if(stepIndex == app.STEP_5) {
            // Validate step 5
            stepValidCallback();
        }
        else if(stepIndex == app.STEP_20) {
                app.RESULT=null;
                $.mobile.changePage('#roadSignStep0Page');

            }
    },
    
    
    stepStarted: function() {
        //
    },
    stepCompleted: function() {
        
        // Current step
        var step = $(this).attr('data-step');
        
        // Valitate step once completed
        app.validateStep(step, function() {
            // Success: move forward
            if(step == app.STEP_0) {
                $.mobile.changePage('#roadSignStep1Page');
            } else if(step == app.STEP_1) {
                try
                {
                    clearInterval(app.ID_GPS);
                }
                catch(e){}
                $.mobile.changePage('#roadSignStep2Page');
            } else if(step == app.STEP_2) {
                 $.mobile.changePage('#roadSignStep3Page');
            } else if(step == app.STEP_3) {
                $.mobile.changePage('#roadSignStep4Page');
            } else if(step == app.STEP_4) {
                app.save();
            }
            
        }, function(errors) {
            // Validation failed: display an error message if there is at least one
            if(Array.isArray(errors) && errors.length > 0) {
                helper.alert("Prima di procedere è necessario " + errors.join(' e '), null, "Avviso");
            }
        });
    },
    previousStep: function() {
        
        // Current step
        var step = $(this).attr('data-step');
        
        if(step == app.STEP_0)
        {
            try
            {
                clearInterval(app.ID_GPS);
            }
            catch(e){}
            //$.mobile.changePage('index.html#censusTypePage');
            $.mobile.back();
        } else if(step == app.STEP_1) {
            $.mobile.changePage('#roadSignStep0Page');
        } else if(step == app.STEP_2) {
            $.mobile.changePage('#roadSignStep1Page');
        } else if(step == app.STEP_3) {
            $.mobile.changePage('#roadSignStep2Page');
        } else if(step == app.STEP_4) {
            $.mobile.changePage('#roadSignStep3Page');
        } else if(step == app.STEP_5) {
            $.mobile.changePage('#roadSignStep4Page');
        }
    },
    
    
    
    
    
    

    
    
    
    
    
    
    
    
    save: function() {
        
        // Form is valid, proceed with saving.
        // Disable save button
        $('#saveButton').addClass('ui-disabled');
        
        var supportTableData = {manufacturers: [], installers: [], owners: []};
        
        // Update the Census entity...
        app.census.dateAdded = new Date();
        app.census.qrCode = $('#qrCode').val();
        app.census.fixedOnMap = $('#positionIsCorrect').val();
        
        app.census.roadSign.comune = $ ('#comune').val();
        app.census.roadSign.provincia = $ ('#provincia').val();
        app.census.roadSign.street = $('#street').val();
        app.census.roadSign.streetNumber = $('#streetNumber').val();
        
        // Pictures related to the city asset
        var imageKeys = ['front', 'back', 'perspective'];
        for(var i in imageKeys) {
            var k = imageKeys[i];
            var imageSrc = $('#roadSignStep3Page a[data-viewtype="' + k + '"][data-showview] img').attr('src');
            if(imageSrc != '') {
                // Remove this from src attribute:
                // data:image/jpeg;base64,
                app.census.pictures[k] = imageSrc.substr(23);
            }
        }
        
        // Loop into roadsigns 392
        $('#roadSignContainer div[data-roadsignno]').each(function() {
            
            var $container = $(this);
            
            var signInfo = new RoadSign.SignInfo();
            
            // Front
            signInfo.roadSignId = 392;      // ID dell'immagine del segnale
            signInfo.size = 0;             // Dimensione
            signInfo.roadSignType = 'Monofacciale'; // Tipologia (monofacciale, bifacciale)
            signInfo.support = 1;    // Supporto (alluminio, ferro)
            signInfo.film = 1;             // Pellicola
            signInfo.maintenance = 0;    // Tipo intervento
            signInfo.particolari_descrizione = $('textarea.roadsign-notes', $container).val();             // Descrizione (eventuali note)
            
            // Back
            signInfo.marking = 'CE'; // Marchio [CE], [OM]ologato, []Non Omologato
            signInfo.manufacturer = '';          // Ditta produttrice
            signInfo.manufacturerNo =  '';          // Numero autorizzazione ditta produttrice
            signInfo.manufacturingYear =  '';     // Anno di produzione
            signInfo.installer = '';                        // Azienda installatrice
            signInfo.installationDate =  '';         // Azienda installatrice
            signInfo.owner = $('a label.roadsign-owner[data-changed="true"] span.proprietario', $container).html() || '';                                                        // Intestatario
            signInfo.proprietario_1 = $('a label.roadsign-owner[data-changed="true"] span.proprietario_1', $container).html() || '';                                                        // Intestatario
            signInfo.proprietario_2 = $('a label.roadsign-owner[data-changed="true"] span.proprietario_2', $container).html() || '';                                                        // Intestatario
            signInfo.ordinanceNo = $('a label.roadsign-ordinance[data-changed="true"] span.roadsign-ordinance-no', $container).html() || '';                   // Ordinanza numero
            signInfo.ordinanceDate = $('a label.roadsign-ordinance[data-changed="true"] span.roadsign-ordinance-date', $container).html() || '';               // Data dell'ordinanza
            signInfo.data_scadenza = $('a label.roadsign-ordinance[data-changed="true"] span.roadsign-ordinancedata_scadenza', $container).html() || '';               // Data dell'ordinanza
            
            
            app.census.roadSign.signs.push(signInfo);
            
            // TODO Review
            // Add entries to the supportTableData object
            if((signInfo.manufacturer || '') != '')
                supportTableData.manufacturers.push({'name': signInfo.manufacturer, 'authNo': (signInfo.manufacturerNo || '')});
            if((signInfo.installer || '') != '') 
                supportTableData.installers.push({'name': signInfo.installer});
            if((signInfo.owner || '') != '')
                supportTableData.owners.push({'name': signInfo.owner});
        });

        // Add pole and brackets informations
        var poleInfo = new RoadSign.PoleInfo();
        app.census.roadSign.poleInfo = poleInfo;
        
        // ...and save it
        // TODO Reenable
        //data.roadSign.updateSupportTables(supportTableData);
        data.save(app.census);
        
        
        // Once saved the census, empty fields of all the steps
        var $page = $('#roadSignStep0Page');
        $('input[type="text"]', $page).val('');
        $('input[type="hidden"]', $page).val('');
        $('#geoStatusText', $page).html('Latitudine e longitudine');
        $('#geoStatusTitle', $page).html('Ottieni');
        $('#openMapPanel', $page).hide();
        var $page = $('#roadSignStep3Page');
        $('input[type="text"]', $page).val('');
        $('input[type="hidden"]', $page).val('');
        app.removePhoto('front');
        app.removePhoto('back');
        app.removePhoto('perspective');
        var $page = $('#roadSignStep2Page');
        $('#roadSignContainer', $page).empty();
        $('#startMessage', $page).show();
        var $page = $('#roadSignStep3Page');
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
    },
    
    
    /****************************************************************
     * MAP FUNCTIONS
     * 
     * 
     * 
     */
    acquireCoords: function()
    {
        if( typeof(google) != 'undefined')
        {    
        
            app.ACQ=true;
            var town;
            var city;
            var village;
            var latlng;
            geoLocation.reverseGeocoding(app.census.position, function(result) 
            {
                if(result)
                {
                    $('#street').val(result.road);
                    $('#provincia').val(result.prov);
                    if (result.village != null ){                
                        $('#comune').val(result.village);
                    }
                    else if (result.town != null ){                
                        $(' #comune').val(result.town);
                    }
                    else
                    {    
                        $('#comune').val(result.city);
                    }
                }
            });
        }    
    },
    startGPS :function()
    {
        if(app.ACQ_GPS)
        {
           
            clearInterval(app.ID_GPS);
            app.ACQ_GPS=false;
            $("#start_gps_0").html("GPS");
            $("#start_gps_0").css("color", "#FF1111");
            if( typeof(google) != 'undefined')
            {    
                if(app._marker!=null && app._marker!=undefined )
                {

                    app._marker.setOptions({draggable: true});

                    google.maps.event.addListener(
                    app._marker, 
                    'dragend', 
                    function() {
                        app._adjustedCoords = app._marker.getPosition();                
                        app.census.position.latitude =app._marker.getPosition().lat();
                        app.census.position.longitude =app._marker.getPosition().lng();
                        $("#latitudine_0").html('Lat:  '+app.census.position.latitude.toFixed(5));
                        $("#longitudine_0").html('Lon:  '+app.census.position.longitude.toFixed(5));
                        //page.injector.GeoCoordinatesAcquired(app.census.position);             
                    });
                }
            }
        }
        else
        {
            app.ACQ_GPS=true;
            if( typeof(google) != 'undefined')
            {    
                if(app._marker!=null && app._marker!=undefined )
                {
                    app._marker.setOptions({draggable: false});
                    google.maps.event.clearListeners(app._marker, 'dragend');

                }
            }
            $("#start_gps_0").html("MANUALE");
            $("#start_gps_0").css("color", "#3388cc");
            try
            {
                clearInterval(app.ID_GPS);
            }
            catch(e){}
            app.ID_GPS=setInterval(function(){app.readGPS()},5000);
                
            
        }    
        
    }, 
    readGPS :function()
    {
        if(app.ID_GPS!=0)
        {
            clearInterval(app.ID_GPS);
        }
        
        if(jQuery.mobile.path.getLocation().indexOf('roadSignStep1Page')>0)
        {
            if(app.ACQ_GPS)
            {    
                app.acquireGeoCoordinates1(
                function()
                {
                    if(app.ID_GPS!=0)
                    {
                        clearInterval(app.ID_GPS);
                    }
                    $("#latitudine_0").html('Lat:  '+app.census.position.latitude.toFixed(5));
                    $("#longitudine_0").html('Lon:  '+app.census.position.longitude.toFixed(5));
                    $("#accuratezza_0").html('Acc:  '+app.census.position.accuracy.toFixed(1))+' m';
                    
                    try
                    {
                        var map=app._map;
                        try
                        {
                            if( typeof(google) != 'undefined')
                            {     
                                var markerPoint = new google.maps.LatLng(app.census.position.latitude,app.census.position.longitude);
                                if(app._marker==null)
                                {    
                                  var marker = new google.maps.Marker({
                                        position: markerPoint,
                                        map: map,
                                        draggable: false,
                                        animation: google.maps.Animation.DROP,
                                        title: app.SELECTED_QRCODE
                                    });
                                    //var infowindow = new google.maps.InfoWindow({content: '<div></div>'});
                                    //infowindow.open(map, marker);
                                }
                                else
                                {    
                                    app._marker.setPosition(markerPoint );
                                }
                                if(app._marker==null)
                                { 
                                    app._marker=marker;
                                    map.panTo(markerPoint);
                                }
                            }
                            else
                            {
                                var txt = '<div style="padding:20px;margin:20px !important">Lat: '+app.census.position.latitude.toFixed(7)+'<br>'+
                                        'Lon: '+app.census.position.longitude.toFixed(7)+'<br>'+
                                        '<span style="color:#FF1111" >Acc: '+app.census.position.accuracy.toFixed(1)+'</span></div>';
                                    $('#map_0').html(txt);    
                            }
                        }
                        catch(e)
                        {}
                        if(app.ACQ_GPS)
                        {
                            app.ID_GPS=setInterval(function(){app.readGPS()},5000);
                           
                        }
                    }
                    catch(e)
                    {
                        helper.alert(e.message);
                    }
                    $("#btnCoord").fadeIn(100);

                }, 
                function(errorMessage)
                {
                    if(app.ID_GPS!=0)
                    {
                        clearInterval(app.ID_GPS);
                    }
                    if(app.ACQ_GPS)
                    {
                        app.ID_GPS=setInterval(function(){app.readGPS()},5000);
                        
                    }
                }
                );
            }
        }
        
    },
    showMapPositionPage: function()
    {
        if(!app.ACQ)
        {    
            var point=null;
            app._map = null;
            app._marker=null;
            try
            {
                app.addEvent=false;
                app.addMarker=false;
                app.id_map="map_0";
              
                if( typeof(google) != 'undefined')
                {   
                    
                    app.MAP=app.openMap();
                    
                    if(app.MAP)
                    {    
                        app._map.setZoom(16);
                        
                        $('#start_gps_0').on('click', function(){app.startGPS();});
                        $('#btn_gps_control_0').fadeIn(100);
                    }
                }
                else
                {
                     $('#map_0').html('<div style="padding:20px;margin:20px !important">Il servizio mappe non è al momento disponibile<br><br>Attendi per la lettura delle coordinate GPS</div>');
                }    
            }
            catch(e)
            {}
            app.readGPS();
        }
        else
        {
            if(app.MAP)
            {    
                try
                {
                    google.maps.event.trigger(app._map, 'resize')
                }
                catch(e)
                {

                }
            }
            app.readGPS();
        }    
    },
    
    
    
    
    
    
    /***************************************************************
     *  LIST DIALOG
     *  params {
     *      roadSignIndex: 0,
     *      rows: [],
     *      textFieldName: '', 
     *      hrefFields: [], // array of string
     *      hrefFormat: 'javascript:function({0}, {1}, ..., {n})'
     *  }
     */
    openListDialog: function(params) {
        
        app._currentRoadSign = params.roadSignIndex;
        var $dialog = $('#listDialog');
        // Set title
        $('h1.title', $dialog).html(params.title);
        // Set listview
        var $listview = $('ul', $dialog);
        var html = '';
        
        // (params.rows.constructor.name == 'SQLResultSetRowList')
        var isSQLResulSetRowList = (typeof(params.rows.item) != 'undefined');
        
        var rowCount = params.rows.length;
        
        for(var i = 0; i < rowCount; i++) {
            
            var r = params.rows[i];
            
            var refVals = [];
            for(var j in params.hrefFields) {
                var val = '';
                if(isSQLResulSetRowList) {
                    val = eval('params.rows.item(i).' + params.hrefFields[j]);
                } else {
                    val = eval('r.' + params.hrefFields[j]);
                }
                refVals.push(val);
            }
            
            if(refVals.length == 0) {
                refVals[0] = r;
            }
            
            // Set ref
            var ref = null;
            if((params.hrefFormat || '') == '') {
                // In this case always takes first element of refVals
                ref = refVals[0];
            } else {
                // params.hrefFormat.replace('{0}', refVal.replace('\'', '\\\''));
                ref = params.hrefFormat;
                for(var j in refVals) {
                    var val = refVals[j];
                    if(typeof(refVals[j]) == 'string') {
                        val = val.replace('\'', '\\\'');
                    }
                    ref = ref.replace('{' + j + '}', val);
                }
            }
            
            //var text = (params.textFieldName == '') ? r : eval('r.' + params.textFieldName);
            var text = '';
            if(params.textFieldName == '') {
                text = r;
            } else if(isSQLResulSetRowList) {
                text = eval('params.rows.item(i).' + params.textFieldName);
            } else {
                text = eval('r.' + params.textFieldName);
            }
            
            html += '<li><a href="' + ref + '">' + text + '</a></li>';
        }
        $listview.html(html);
        $listview.listview();
        //$listview.trigger("create");
        $listview.listview("refresh");
        
        $.mobile.changePage('#listDialog');
    },
    closeListDialog: function() {
        app._currentRoadSign = null;
        $.mobile.changePage('#roadSignStep4Page', {
            reverse: true,
        });
    },

    
    
    
    
    
    
    
    
    /***************************************************************
     *  ROADSIGN PANEL
     */
    _allRoadSigns: null,    // Used to perform search
    _roadSignCounter: 0,    // Counter increased each time a new panel is added
    _currentRoadSign: null, // Current roadsign in editing
    addRoadSignPanel: function() {
        if(app._roadSignCounter!=1)
        {
            var count = ++app._roadSignCounter;

            var $roadSignPanel = $('<div data-roadsignno="' + count + '" data-inset="false" data-role="collapsible" data-collapsed="true" data-collapsed-icon="carat-r" data-expanded-icon="carat-d" data-theme="b">' +
                                        '<ul data-role="listview"></ul>' +
                                    '</div>');

            $('#roadSignContainer').append($roadSignPanel);
            $roadSignPanel.collapsible({collapsed: false});
            $roadSignPanel.trigger("create");

            $listview = $('ul', $roadSignPanel);
            
            var imageUrl = config.getNativeBaseURL();
            if(imageUrl.substr(-1) != '/') imageUrl += '/';
            imageUrl += config.ROADSIGN_BASE_PATH_ICONS + '392' + '.svg';
                     //imageUrl='/RoadsignIcons/392.svg';

            
             // ROADSIGN PICTURE
            $listview.append('<li class="roadsign-sign-li">' +
                                '<img src="'+imageUrl+'" class="roadsign-picture">' +
                                '<input type="hidden" class="roadsign-signid" />' +
                                '<p class="roadsign-signdescr"></p>' +
                                '<h1 class="roadsign-signname"></h1>' +
                            
                        '</li>');
            
            
            
            // ORDINANCE
            $listview.append('<li><a href="javascript:app.openRoadSignOrdinancePanel(' + count + ')">Ordinanza <label class="roadsign-ordinance">Specifica l\'ordinanza</label></a></li>');
            
            // OWNER
            $listview.append('<li><a href="javascript:app.openRoadSignOwnerPanel(' + count + ')">Intestatario <label class="roadsign-owner">Specifica il proprietario</label></a></li>');

           // NOTE
            $('<li data-theme="b"><textarea class="roadsign-notes" placeholder="Note"></textarea></li>').appendTo($listview).trigger('create');
            
            $listview.listview("refresh");
            app.setRoadSign(392);

            $('#startMessage').hide();
        }
    },
    /***************************************************************
     *  Functions related to roadsigns search
     */
    
    setRoadSign:function(signId) {
        var roadSign = null;
        var params = {
            search: 'passo',
            shape: null
        };
        data.roadSign.getRoadSigns(params, function(result) 
        {
            var lenght = result.length;
            var foundRoadSigns = [];
            var found = 0;
            var html = '';
            for(var i = 0; i < lenght; i++)
            {
                var roadSign = result.item(i);
                if(roadSign.id==signId)
                {
                    foundRoadSigns.push(roadSign);
                    var imageUrl = config.getNativeBaseURL();
                    if(imageUrl.substr(-1) != '/') imageUrl += '/';
                    imageUrl += config.ROADSIGN_BASE_PATH_ICONS + roadSign.id + '.svg';
                    
                    //imageUrl='/RoadsignIcons/392.svg';
                    
                    var roadSignPanel = $('div[data-roadsignno="1"]');
                    $('h1 span', roadSignPanel).html(roadSign.name);
                    $('input[type="hidden"].roadsign-signid', roadSignPanel).val(roadSign.id);
                    $('p.roadsign-signdescr', roadSignPanel).html(roadSign.figure);
                    break;
                }
            }
            app._allRoadSigns = foundRoadSigns;
            
            
        });
        
        
        //app.closeRoadSignFinder();
    },
    
    
    
    
    
    

    

    /***************************************************************
     *  Functions related to editing of roadsign property using
     *  customs dialogs
     */
    
    openRoadSignOwnerPanel: function(signIndex) {
        app._currentRoadSign = signIndex;
        $.mobile.changePage('#roadSignOwnerPage', {
            transition: 'pop'
        });
    },
    setRoadSignOwner: function(signOwner) {
        var ownerName = '<span class="proprietario">'+$('#roadSignOwnerSurname').val()+' '+$('#roadSignOwnerName').val()+'</span>';
        var proprietario_1 = '<span class="proprietario_1">'+$('#proprietario_1').val()+'</span>';
        var proprietario_2 = '<span class="proprietario_2">'+$('#proprietario_2').val()+'</span>';
        var completeOwner=ownerName+'<br>'+proprietario_1+'<br>'+proprietario_2;
        //if(ownerName == '') ownerName = 'Non specificato';
        var roadSignPanel = $('div[data-roadsignno="' + app._currentRoadSign + '"]');
        $('a label.roadsign-owner', roadSignPanel).html(completeOwner).attr('data-changed', 'true');
        app.closeRoadSignOwnerPanel();
    },
    closeRoadSignOwnerPanel: function() {
        app._currentRoadSign = null;
        $.mobile.changePage('#roadSignStep4Page', {
            transition: 'pop',
            reverse: true,
        });
    },
    
    openRoadSignOrdinancePanel: function(signIndex) {
        app._currentRoadSign = signIndex;
        $.mobile.changePage('#roadSignOrdinancePage', {
            transition: 'pop'
        });
    },
    setRoadSignOrdinance: function(signOrdinance) {
        var ordinanceNo = $('#roadSignOrdinanceNo').val();
        var ordinanceDate = $('#roadSignOrdinanceDate').val();
        var data_scadenza = $('#scadenzaData').val();

        var text = '';
        if(ordinanceNo != '') text = 'Ord. n. <span class="roadsign-ordinance-no">' + ordinanceNo + '</span> ';
        if(ordinanceDate != '') text += '<br>del <span class="roadsign-ordinance-date">' + ordinanceDate + '</span>';
        if(data_scadenza != '') text += '<br>scade <span class="roadsign-ordinancedata_scadenza">' + data_scadenza + '</span>';

        var roadSignPanel = $('div[data-roadsignno="' + app._currentRoadSign + '"]');
        $('a label.roadsign-ordinance', roadSignPanel).html(text).attr('data-changed', 'true');
        app.closeRoadSignOrdinancePanel();
    },
    closeRoadSignOrdinancePanel: function() {
        app._currentRoadSign = null;
        $.mobile.changePage('#roadSignStep4Page', {
            transition: 'pop',
            reverse: true,
        });
    },
    
    showResult: function(result)
    {
        app.RESULT=result;
         $.mobile.changePage('#resultPage');
    },
    
    loadResult: function()
    {
       var page=$('#resultPage');
       $('#comune',page).val(app.RESULT.comune)+' ('+app.RESULT.provincia+')';
       $('#street',page).val(app.RESULT.strada)+ ' '+app.RESULT.denominazione_strada;
       $('#streetNumber',page).val(app.RESULT.civico);
       $('#proprietario',page).val(app.RESULT.proprietario);
       $('#proprietario_1',page).val(app.RESULT.proprietario_1);
       $('#proprietario_2',page).val(app.RESULT.proprietario_2);
       $('#ordinanza',page).val('N° '+app.RESULT.ordinanza_numero+ ' del '+app.RESULT.ordinanza_del);
       $('#scadenza',page).val(app.RESULT.data_scadenza);
       $('#note',page).val(app.RESULT.particolari_descrizione);




    }
    
};
