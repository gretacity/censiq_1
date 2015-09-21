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
    ACQ_GPS:true,
    ID_GPS:0,  
    ACQ:false,
    SELECTED_QRCODE: null,
    MAP:false,
    census: new Census(CensusTypes.sopralluoghi),
    picturesPageId: 'foto',
    pageOffsetTop: 0,
    ADDRESS_ACQ: 0,
    
    // Application Constructor
    initialize: function() 
    {
       this.bindEvents();        
    },
     
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        
        document.addEventListener('deviceready', this.onDeviceReady, false);
        $('#ElencoSopralluoghiPage').on('pageshow', this.loadElenco);
        $('#newButton').on('click', function(){
            $.mobile.changePage('#sopralluoghiStep1Page', {
                transition: 'slide',
                reverse: false,
                changeHash: false
                });
        });
        $('#sopralluoghiStep1Page').on('pageshow', this.showMapPositionPage);
        //$('#sopralluoghiStep2Page').on('pageshow',  this.acquireCoords);
        // Force onDeviceReady if it's a browser
        if(config.EMULATE_ON_BROWSER) this.onDeviceReady();
        $('.prev-step').on('click', this.previousStep);
        $('.next-step').on('click', this.stepCompleted);
        
        var $page3 = $('#foto');
        $('a[data-addview]', $page3).on('click', this.acquirePhoto);
        $('a[data-removeview]', $page3).on('click', this.removePhoto);
        $('#photoPage a').on('tap', this.hidePhotoDialog);
        //$('#addRoadSignButton').on('click', app.addRoadSignPanel);
        $('#addRoadSignButtonBIG').on('click', app.addRoadSignPanel);
        $('#addRoadSignButtonPanel').on('click', app.nuovoCartello);
        $('#oldpole_p').on('change', app.showOlPoleInfo);
        $('div[data-role="dialog"]').on('create', function() {
            app.pageOffsetTop = $(this).offset().top;
        });
        $('div[data-role="dialog"]').on('pagehide', function() {
            $.mobile.silentScroll(app.pageOffsetTop);
        });
    },
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
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
    loadElenco: function()
    {
        
        data.fetch({status: [data.REC_STATUS_ADDED, data.REC_STATUS_SYNCH_ERROR]}, function(result)
        {
            var itemCount = result.rows.length;
            var html = '';
            for(var i = 0; i < itemCount; i++) 
            {
                var row = result.rows.item(i);
                if(row.entity_type==4 )
                {
                    //console.log("ROW",row);
                    var obj = data.deserialize(row, row.entity_type);
                    var itemId = 'item' + obj.id;
                    var qrCode = obj.qrCode;
                    var dateAdded = Date.parseFromYMDHMS(row.date_added).toDMYHMS();
                    html += '<li id="row'+obj.id+'" style="padding:0;">';
                    html+='<div id="cls_'+obj.id+'">'+
                            '<img  onclick="app.updateItems(\''+qrCode+'\')" src="img/update.png" style="float:right;margin-right:10px; height:32px;width: 32px">'+
                            '</div>';
                    if(obj.sopraluoghi.signs.lenght>0)
                    {
                    html+='<div style="margin-right:5px;overflow:hidden;float:left">'+
                            '<img class="img'+obj.roadSign.signs[0].roadSignId+'"  style="width:24px;height:24px;">'+
                            '</div>';
                    }
                    else
                    {
                        html+='<div style="margin-right:5px;overflow:hidden;float:left;width:24px;height:24px;">'+
                            '<img src="img/noPhoto.png"  style="width:24px;height:24px;">'+
                            '</div>';
                    }    
                    html += '<div style="overflow:hidden;float:left"><b>'+qrCode+'</b><br>';
                    html += obj.roadSign.street+' '+obj.roadSign.streetNumber+' '+obj.roadSign.comune+'<br>';
                            '</div></li>';
                    
                    for(var j=0;j<obj.roadSign.signs.length;j++)
                    {    
                        
                        params = { id: obj.roadSign.signs[j].roadSignId}; 
                        data.sopralluoghi.getRoadSigns(params, function(result)
                        {
                            try
                            {
                                var imageUrl =config.getNativeBaseURL()+ config.ROADSIGN_BASE_PATH_ICONS + result.item(0).icon;
                               
                                $(".img"+result.item(0).id).attr("src",imageUrl);
                                $(".img"+result.item(0).id).css("width","24px");
                                $(".img"+result.item(0).id).css("height","24px");
                                
                            }
                            catch(e)
                            {
                                helper.alert(e.message);
                            }
                            
                        });
                    }
                }
            }
            $('#itemList').html(html);
        });
          
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
    updateItems: function(qrCode)
    {
        $('#curr_qrcode','#localizeroadSignPage').val(qrCode);
        $('#qrCode_point','#localizeroadSignPage').val('');
        $.mobile.changePage('#localizeroadSignPage', {
            transition: 'slide',
            reverse: false,
            changeHash: false
        });
    },
    validateStep: function(stepIndex, stepValidCallback, stepNotValidCallback) {
        var errors = [];
        if(stepIndex == app.STEP_1) {
            if(app.ADDRESS_ACQ==0)
            {
                this.acquireCoords();
                app.ADDRESS_ACQ=1;
                $("#localizzazione").fadeIn(500);
            }    
            else
            {   
                if($.trim($('#comune','#sopralluoghiStep1Page').val()) == '')
                {
                    errors.push('specificare Comune');
                    stepNotValidCallback(errors);
                    return false;
                }
                if($.trim($('#provincia','#sopralluoghiStep1Page').val()) == '')
                {
                    errors.push('specificare Provincia');
                    stepNotValidCallback(errors);
                    return false;
                }
                if($.trim($('#street','#sopralluoghiStep1Page').val()) == '')
                {
                    errors.push('specificare Strada/Via');
                    stepNotValidCallback(errors);
                    return false;
                }
                $("localizzazione").fadeOut(500,stepValidCallback());
                
            }    
        } else if(stepIndex == app.STEP_2) {
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
        else if(stepIndex == app.STEP_6) {
            // Validate step 5
            stepValidCallback();
        }
        else if(stepIndex == app.STEP_10) {
                this.updateCode();
        }
    },
    stepStarted: function() {},
    stepCompleted: function()
    {
        // Current step
        var step = $(this).attr('data-step');
        // Valitate step once completed
        app.validateStep(step, function() 
        {
           // Success: move forward
           if(step == app.STEP_1)
           {
                try
                {
                    clearInterval(app.ID_GPS);
                }
                catch(e){}
               
                //$.mobile.changePage('#sopralluoghiStep2Page');
                //app.openRoadSignFinder();
                app.addRoadSignPanel(); 
            } 
            else if(step == app.STEP_2)
            {
                
                $.mobile.changePage('#sopralluoghiStep3Page');
            } 
           
            else if(step == app.STEP_3)
            {
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
        
         if(step == app.STEP_2) {
            $.mobile.changePage('#sopralluoghiStep1Page');
        } else if(step == app.STEP_3) {
            
            $.mobile.changePage('#sopralluoghiStep2Page');
        }  
    },
    updateCode: function()
    {
        if($('#qrCode_point','#localizeroadSignPage').val()!='')
        {
            data.fetch({status: [data.REC_STATUS_ADDED, data.REC_STATUS_SYNCH_ERROR]}, function(result)
            {
                var itemCount = result.rows.length;
                for(var i = 0; i < itemCount; i++) 
                {
                    var row = result.rows.item(i);
                    var obj = data.deserialize(row, row.entity_type);
                    if(obj.qrCode==$('#curr_qrcode','#localizeroadSignPage').val())
                    {
                        
                        var new_code=$('#qrCode_point','#localizeroadSignPage').val();
                        //console.log(row.id+'--------'+ new_code);
                        console.log(obj);
                        console.log(row);
                        data.updateQrCode(row.id, new_code);
                        return;
                    }
                }
            });
        }
        $.mobile.changePage('#ElencoSopralluoghiPage', {
               transition: 'slide',
               reverse: false,
               changeHash: false
           });
    },
    save: function() {
        var d= new Date();
        // Form is valid, proceed with saving.
        // Disable save button
        $('#saveButton').addClass('ui-disabled');
        
        var supportTableData = {manufacturers: [], installers: [], owners: []};
        
        // Update the Census entity...
        app.census.dateAdded = new Date();
        //app.census.qrCode = $('#qrCode').val();
        //app.census.position.latitude = '';    // Already set
        //app.census.position.longitude = '';   // Already set
        //app.census.position.accuracy = '';    // Already set
        app.census.fixedOnMap = $('#positionIsCorrect').val();
        
        app.census.sopralluoghi.comune = $ ('#comune').val();
        app.census.sopralluoghi.provincia = $ ('#provincia').val();
        app.census.sopralluoghi.street = $('#street').val();
        app.census.sopralluoghi.note = $('#note').val();
        
        // Pictures related to the city asset
        var imageKeys = ['front', 'back', 'perspective'];
        for(var i in imageKeys) {
            var k = imageKeys[i];
            var imageSrc = $('#sopralluoghiStep3Page a[data-viewtype="' + k + '"][data-showview] img').attr('src');
            if(imageSrc != '') {
                // Remove this from src attribute:
                // data:image/jpeg;base64,
                app.census.pictures[k] = imageSrc.substr(23);
            }
        }
        
        // Loop into roadsigns
        app.census.roadSign.signs=Array();
        $('#roadSignContainer div[data-roadsignno]').each(function() {
            var $container = $(this);
           
            var signInfo = new RoadSign.SignInfo();
            
            // Front
            signInfo.roadSignId = $('input[type="hidden"].roadsign-signid', $container).val();      // ID dell'immagine del segnale
            signInfo.size = $('a label.roadsign-size', $container).attr('data-sizeid');             // Dimensione
            signInfo.roadSignType = $('a label.roadsign-type[data-changed="true"]', $container).html() || ''; // Tipologia (monofacciale, bifacciale)
            signInfo.support = $('a label.roadsign-support', $container).attr('data-supportid');    // Supporto (alluminio, ferro)
            signInfo.film = $('a label.roadsign-film', $container).attr('data-filmid');             // Pellicola
            app.census.roadSign.signs.push(signInfo);
             
            
        });

        // Add pole and brackets informations
        var poleInfo = new RoadSign.PoleInfo();
        poleInfo.numberOfPoles = $('#numberOfPoles').val();                                  // Numero di pali
        poleInfo.poleDiameter = $('#poleDiameter').val();                               // Diametro dei pali
        poleInfo.poleHeight = $('#poleHeight').val();                                   // Altezza dei pali
        poleInfo.old_signs_number=$('#old_signs_number').val();
        
        
        app.census.sopralluoghi.poleInfo = poleInfo;
        // ...and save it
        // TODO Reenable
        //data.sopralluoghi.updateSupportTables(supportTableData);
        data.save(app.census);
        
        
        
        
        // Once saved the census, empty fields of all the steps
        
        $('input[type="text"]').val('');
        $('input[type="hidden"]').val('');
        app.removePhoto('front');
        app.removePhoto('back');
        app.removePhoto('perspective');     
        // Move to the last page of the wizard
        $.mobile.changePage('#ElencoSopralluoghiPage', {
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
                        $("#btnCoord").fadeIn(100);
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
       
        //if(jQuery.mobile.path.getLocation().indexOf('sopralluoghiStep1Page')>0)
        
     
        if($('#map_0').length>0)
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
                                var txt = '<div style="padding:20px 5px;margin:20px !important">Lat: '+app.census.position.latitude.toFixed(7)+'<br>'+
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
        app.ADDRESS_ACQ=0;
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
            {
                  
                
            }
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
                    console.log(e);
                }
            }
            
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
        if(params.title=='Tipo segnale')
        {
            html+='<li><a href="javascript:app.setRoadSignTypes(0, \'Nessuna selezione\')">Nessuna selezione</a></li>';
        } 
        
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
        $.mobile.changePage('#sopralluoghiStep3Page', {
            reverse: true,
        });
    },

    
    
    
    
    
    
    
    
    /***************************************************************
     *  CENSIMENTI
     */
    _allRoadSigns: null,    // Used to perform search
    _roadSignCounter: 0,    // Counter increased each time a new panel is added
    _currentRoadSign: null, // Current roadsign in editing
    addRoadSignPanel: function() {
        var rem=0;
        var count = ++app._roadSignCounter;
        app.openRoadSignFinder( count,rem);
        var $roadSignPanel = $('<div data-roadsignno="' + count + '" data-inset="false" data-role="collapsible" data-collapsed="true" data-collapsed-icon="carat-r" data-expanded-icon="carat-d" data-theme="b">' +
                                    '<h1>' +
                                        '<img src="" class="roadsign-picture" style="width:24px;height:24px"/> <span>Cartello</span>' +
                                        '</h1>' +
                                    '<ul data-role="listview" class="ui-listview ui-group-theme-b"></ul>' +
                                '</div>');
        $('#roadSignContainer').append($roadSignPanel);
        $roadSignPanel.collapsible({collapsed: false});
        $roadSignPanel.trigger("create");
        $listview = $('ul', $roadSignPanel);
        $listview.append('<input type="hidden" id="rimozione" value="0" />');    
                                   
      
      
        $listview.append('<li class="roadsign-sign-li">' +
                            '<a href="javascript:app.openRoadSignTypes(' + count + ')">' +
                                '<!--img src="img/Segnali/cod_1.svg" /-->' +
                                '<input type="hidden" id="roadsign-signtypeid" value="0" />' +
                                 '<div class="roadsign-type">Categoria</div>' +
                                
                            '</a>' +
                        '</li>');
                
      
                
        // ROADSIGN PICTURE
        $listview.append('<li class="roadsign-sign-li">' +
                            '<a disabled="true" href="javascript:app.openRoadSignFinder(' + count + ')">' +
                                '<!--img src="img/Segnali/cod_1.svg" /-->' +
                                '<input type="hidden" class="roadsign-signid" />' +
                                 '<div class="roadsign-signdescr">Figura</div>' +
                            '</a>' +
                        '</li>');
        // SIZE
        $listview.append('<li><a href="javascript:app.openRoadSignSizePanel(' + count + ')">Dimensione</a></li>');
        // TYPE
        $listview.append('<li><a href="javascript:app.openRoadSignTypePanel(' + count + ')">Tipologia</a></li>');
        // SUPPORT
        $listview.append('<li><a href="javascript:app.openRoadSignSupportPanel(' + count + ')">Supporto </a></li>');
        // FILM
        $listview.append('<li><a href="javascript:app.openRoadSignFilmPanel(' + count + ')">Pellicola</a></li>');
        // NOTE
        $('<li data-theme="b"><a href="#" class="textarea"><textarea class="roadsign-notes" placeholder="Note"></textarea></a></li>').appendTo($listview).trigger('create');
        // REMOVE BUTTON
        $listview.append('<li data-theme="b">' +
                            '<a href="javascript:app.removeRoadSignPanel(' + app._roadSignCounter + ')" class="ui-btn ui-icon-delete ui-btn-icon-right">Rimuovi cartello</a>' +
                        '</li>');
        
        $listview.listview("refresh");
        $('#startMessage').hide();
       
    },
    removeRoadSignPanel: function(index) {
        var $el = $('#roadSignContainer div[data-roadsignno="' + index + '"]');
        $el.collapsible('destroy');
        $el.remove();
        if($('#roadSignContainer div[data-roadsignno]').length == 0) {
            $('#startMessage').show();
        }
    },
    
    
    /***************************************************************
     *  Functions related to roadsigns search
     */
    openRoadSignFinder: function(signIndex) {
        var roadSignPanel = $('div[data-roadsignno="' + signIndex + '"]');
        
            
        app._currentRoadSign = signIndex;
        $.mobile.changePage('#roadSignFinder', {
            transition: 'pop'
        });
        if($("#oldpole").val()==-1)
        {
            $("#a_sp_dialog a").addClass("alert_sup");
            $("#supp_title").html("Specificare esistente");
        }
        else
        {
            $("#a_sp_dialog a").removeClass("alert_sup");
            $("#supp_title").html("Supporto");
        }    
        $("#searchRoadSignText").val('').focus();
        
        data.sopralluoghi.getRoadSignSupports(function(result) {
            var params={
                rows: result,
                textFieldName: 'name',
                hrefFields: ['id', 'name'],
                hrefFormat: 'javascript:app.setRoadSignSupport({0}, \'{1}\')'
            };
            
            
            
                var $dialog = $('#materiale_supporto');
                var $listview = $('ul',$dialog );
                //$listview.appendTo($dialog);
      
                var html = '';
                // (params.rows.constructor.name == 'SQLResultSetRowList')
                var isSQLResulSetRowList = (typeof(params.rows.item) != 'undefined');
                var rowCount = params.rows.length;
                for(var i = 0; i < rowCount; i++)
                {
                    var r = params.rows[i];
                    var refVals = [];
                    for(var j in params.hrefFields)
                    {
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
            
            
        });
        
        
        
        
        //app.setRoadSignSizeDialog(0);
    },
    
    searchRoadSign: function() {
        var MAX_RESULTS = 20;
        // Text used for searching
        var searchText = $("#searchRoadSignText").val();
        if(searchText == '') {
            helper.alert('Inserisci almeno un carattere per effettuare la ricerca', null, 'Cerca segnale');
            $("#searchRoadSignText").focus();
            return;
        }
        // Filter by shape
        var searchShape = ($('#roadSignShapeList').prop('selectedIndex') == 0) ? 
                                    null :
                                    $('#roadSignShapeList').val();
        
        $.mobile.loading('show');
        
            
        
        var params = {
            search: searchText,
            shape: searchShape,
            type:0
        };
        
        var roadSignPanel = $('div[data-roadsignno="' + app._currentRoadSign + '"]');
        $('#roadsign-signtypeid',roadSignPanel).val()!=0
        if($('#roadsign-signtypeid',roadSignPanel).val()!=0 )
        {
            params = {
             search: searchText,
             shape: searchShape,
             type:$('#roadsign-signtypeid',roadSignPanel).val()
            }; 
        }
        
        
        data.sopralluoghi.getRoadSigns(params, function(result) {
            
       
            
            var lenght = result.length;
            
            var foundRoadSigns = [];
            var found = 0;
            var html = '';
            for(var i = 0; i < lenght; i++) {
                //var roadSign = app._allRoadSigns[i];
                var roadSign = result.item(i);
                foundRoadSigns.push(roadSign);
                // Append to results
                //var imageUrl = (roadSign.icon != '') ? config.ROADSIGN_BASE_PATH_ICONS + roadSign.icon : '';
                var imageUrl = config.getNativeBaseURL();
                if(imageUrl.substr(-1) != '/') imageUrl += '/';
                imageUrl += config.ROADSIGN_BASE_PATH_ICONS + roadSign.icon;
                
                html += '<li><a href="javascript:app.setRoadSign(' + roadSign.id + ','+roadSign.category+')">' +
                            '<img src="' + imageUrl + '" class="roadsign-picture" />' + 
                            '<h1>' + roadSign.name + '</h1>' +
                            '<p>codice: ' + roadSign.code + '<br />' + roadSign.figure +' '+ roadSign.formato+ '</p>' +
                        '</a></li>';
                if(++found == MAX_RESULTS) {
                    html += '<li>Altri risultati omessi per brevità</li>';
                    break;
                }
            }
            
            app._allRoadSigns = foundRoadSigns;
            
            $('#roadSignList').html(html).listview("refresh");
            
            $.mobile.loading('hide');
            
            if(result.length == 0) {
                helper.alert('Nessun segnale trovato', null, 'Ricerca segnali');
            }
        });
    },
    
    setRoadSign:function(signId, category) {
        var rsn=app._currentRoadSign;
        data.sopralluoghi.getRoadSignTypes(function(result)
        {
            var rowCount = result.length;
            for(var i = 0; i < rowCount; i++)
            {
                var r = result[i];
                if(r.id==category)
                {
                    var roadSignPanel = $('div[data-roadsignno="' + rsn + '"]');
                    $('#roadsign-signtypeid', roadSignPanel).val(r.id);
                    $('.roadsign-signtypename', roadSignPanel).html(r.nome);
                    break;
                }    
            }    
        });
        var roadSign = null;
        for(var i in app._allRoadSigns) {
            if(app._allRoadSigns[i].id == signId) {
                roadSign = app._allRoadSigns[i];
                break;
            }
        }
        if(roadSign != null) 
        {
            
            $("#roadSignList").html("");
            //var imageUrl = config.ROADSIGN_BASE_PATH_ICONS + roadSign.icon;
            var imageUrl = config.getNativeBaseURL();
            if(imageUrl.substr(-1) != '/') imageUrl += '/';
            imageUrl += config.ROADSIGN_BASE_PATH_ICONS + roadSign.icon;
            var roadSignPanel = $('div[data-roadsignno="' + app._currentRoadSign + '"]');
            $('h1 img', roadSignPanel).attr('src', imageUrl);
            $('h1 span', roadSignPanel).html(roadSign.name);
            
            $('h3 img', $("#img_segnale")).attr('src', imageUrl);
            $('h3 span',$("#img_segnale")).html(roadSign.name);
            
            
            $('input[type="hidden"].roadsign-signid', roadSignPanel).val(roadSign.id);
            $('p.roadsign-signdescr', roadSignPanel).html(roadSign.figure);
            
         
            var _params = {
             search: roadSign.id
            }; 
            app._currentRoadSign = roadSign.id;
            data.sopralluoghi.getRoadSignSizes(_params,function(result)
            {
                 
                var params={
                    rows: result, //data.sopralluoghi.getRoadSignSizes(),
                    textFieldName: 'size',
                    hrefFields: ['id', 'size'],
                    hrefFormat: 'javascript:app.setRoadSignSizeDialog({0}, \'{1}\')'
                }
                var dialog = $('#dimensioni_segnale');
                var $listview = $('ul',dialog );
                //$listview.appendTo(dialog);
      
                var html = '';
                // (params.rows.constructor.name == 'SQLResultSetRowList')
                var isSQLResulSetRowList = (typeof(params.rows.item) != 'undefined');
                var rowCount = params.rows.length;
                for(var i = 0; i < rowCount; i++)
                {
                    var r = params.rows[i];
                    var refVals = [];
                    for(var j in params.hrefFields)
                    {
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
                
            });
        }

        //app.closeRoadSignFinder();
    },
    
    
    
    nuovoCartello: function()
    {
        //app.closeRoadSignFinder();
        //app.addRoadSignPanel();
        app._allRoadSigns = null;
        app._currentRoadSign = null;
        
        $('#roadSignList').empty().listview("refresh");
        $("#img_segnale").html( '<h3>'+
                        '<img src="img/noPhoto.png" style="width:70%; margin:0 auto">'+
                    '</h3>'+
                    '<span>Ricerca segnale per nome o codice</span>');
        $("#dimensioni_segnale").html('');    
        
        app.addRoadSignPanel(); 
    },
    
    
    
    
    saveRoadSign: function() {
        $("#oldpole").val($("#oldpole_p").val());
        $("#numberOfPoles_p").val($("#numberOfPoles_p").val());
        $("#poleHeight").val($("#poleHeight_p").val());
        $("#poleDiameter").val($("#poleDiameter_p").val());

        app._allRoadSigns = null;
        app._currentRoadSign = null;
        $('#roadSignList').empty().listview("refresh");
        $.mobile.changePage('#sopralluoghiStep2Page');
        
    },
    
    
    closeRoadSignFinder: function() {
        //$.mobile.changePage('#sopralluoghiStep2Page');
        app._allRoadSigns = null;
        app._currentRoadSign = null;
        $('#roadSignList').empty().listview("refresh");
        //$.mobile.back();
        $.mobile.changePage('#sopralluoghiStep2Page');
        
    },
    
    
    /***************************************************************
     *  Functions related to editing of roadsign property using
     *  the ListDialog
     */
    openRoadSignSizePanel: function(signIndex) {
        
        var roadSignPanel = $('div[data-roadsignno="' + signIndex + '"]');
        if($('.roadsign-signid',roadSignPanel).val()!='' )
        {    
            var params = {
             search: $('.roadsign-signid',roadSignPanel).val()
            }; 
            
            data.sopralluoghi.getRoadSignSizes(params,function(result) {
                app.openListDialog({
                    roadSignIndex: signIndex,
                    title: 'Formato del segnale',
                    rows: result, //data.sopralluoghi.getRoadSignSizes(),
                    textFieldName: 'size',
                    hrefFields: ['id', 'size'],
                    hrefFormat: 'javascript:app.setRoadSignSize({0}, \'{1}\')'
                });
            });
        }
        else
        {
           helper.alert('Seleziona il segnale ',null,'Dimensione');
        }        
    },
    setRoadSignSizeDialog: function(signSizeId, signSize) {
        var roadSignPanel = $('div[data-roadsignno="' + app._currentRoadSign + '"]');
        $('a label.roadsign-size', roadSignPanel).attr('data-sizeid', signSizeId).html(signSize);
         data.sopralluoghi.getRoadSignSupports(function(result) {
            var params={
                rows: result,
                textFieldName: 'name',
                hrefFields: ['id', 'name'],
                hrefFormat: 'javascript:app.setRoadSignSupport({0}, \'{1}\')'
            };
            
            
            
                var $dialog = $('#materiale_supporto');
                var $listview = $('ul',$dialog );
                //$listview.appendTo($dialog);
      
                var html = '';
                // (params.rows.constructor.name == 'SQLResultSetRowList')
                var isSQLResulSetRowList = (typeof(params.rows.item) != 'undefined');
                var rowCount = params.rows.length;
                for(var i = 0; i < rowCount; i++)
                {
                    var r = params.rows[i];
                    var refVals = [];
                    for(var j in params.hrefFields)
                    {
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
            
            
        });
        
        
        
    },
    setRoadSignSize: function(signSizeId, signSize) {
        var roadSignPanel = $('div[data-roadsignno="' + app._currentRoadSign + '"]');
        $('a label.roadsign-size', roadSignPanel).attr('data-sizeid', signSizeId).html(signSize);
        app.closeListDialog();
    },
    
    openRoadSignTypePanel: function(signIndex) {
        app.openListDialog({
            roadSignIndex: signIndex,
            title: 'Tipologia del segnale',
            rows: data.sopralluoghi.getRoadSignType(),
            textFieldName: '',
            hrefFields: [],
            hrefFormat: 'javascript:app.setRoadSignType(\'{0}\')'
        });
    },
    
    setRoadSignType: function(signType)
    {
        var roadSignPanel = $('div[data-roadsignno="' + app._currentRoadSign + '"]');
        $('a label.roadsign-type', roadSignPanel).html(signType).attr('data-changed', 'true');
        app.closeListDialog();
    },
    openRoadSignSupportPanel: function(signIndex) {
        // Changed: now use the async pattern
        data.sopralluoghi.getRoadSignSupports(function(result) {
            app.openListDialog({
                roadSignIndex: signIndex,
                title: 'Tipo Supporto',
                rows: result,
                textFieldName: 'name',
                hrefFields: ['id', 'name'],
                hrefFormat: 'javascript:app.setRoadSignSupport({0}, \'{1}\')'
            });
        });
    },
    setRoadSignSupport: function(signSupportId, signSupport) {
        var roadSignPanel = $('div[data-roadsignno="' + app._currentRoadSign + '"]');
        $('a label.roadsign-support', roadSignPanel).attr('data-supportid', signSupportId).html(signSupport);
        app.closeListDialog();
    },
    openRoadSignTypes: function(signIndex)
    {
        data.sopralluoghi.getRoadSignTypes(function(result) {
            
           
            
            app.openListDialog({
                roadSignIndex: signIndex,
                title: 'Tipo segnale',
                rows: result,
                textFieldName: 'nome',
                hrefFields: ['id', 'nome'],
                hrefFormat: 'javascript:app.setRoadSignTypes({0}, \'{1}\')'
            });
        });
    },
    
    setRoadSignTypes: function(typeid, typename)
    {
        
        
        var roadSignPanel = $('div[data-roadsignno="' + app._currentRoadSign + '"]');
        $('#roadsign-signtypeid', roadSignPanel).val(typeid);
        $('.roadsign-signtypename', roadSignPanel).html(typename);
        app.closeListDialog();
    },
    
    
    
    openInterventoTypes: function(signIndex)
    {
       app.openListDialog({
            roadSignIndex: signIndex,
            title: 'Tipo intervento',
            rows: data.sopralluoghi.getRoadSignIntervento(),
            textFieldName: 'name',
            hrefFields: ['id', 'name'],
            hrefFormat: 'javascript:app.setRoadSignIntervento({0},\'{1}\')'
        });
    },
    
    
    setRoadSignIntervento: function(typeid, typename) {
        
        
        var roadSignPanel = $('div[data-roadsignno="' + app._currentRoadSign + '"]');
        $('#rimozione', roadSignPanel).val(typeid);
        $('.roadsign-rimozione', roadSignPanel).html(typename);
        app.closeListDialog();
    },
    
    openRoadSignFilmPanel: function(signIndex) {
        data.sopralluoghi.getRoadSignFilms(function(result) {
            app.openListDialog({
                roadSignIndex: signIndex,
                title: 'Tipo Pellicola',
                rows: result,
                textFieldName: 'name',
                hrefFields: ['id', 'name'],
                hrefFormat: 'javascript:app.setRoadSignFilm({0}, \'{1}\')'
            });
        });
    },
    setRoadSignFilm: function(signFilmId, signFilm) {
        var roadSignPanel = $('div[data-roadsignno="' + app._currentRoadSign + '"]');
        $('a label.roadsign-film', roadSignPanel).attr('data-filmid', signFilmId).html(signFilm);
        app.closeListDialog();
    },
    
    showOlPoleInfo: function() {
        var val=$("#oldpole_p").val();
        if(val==0 || val=="1")
        {
            $('#info_pole_div').css("height","auto");
        }
        else
        {
            $('#info_pole_div').css("height","0");
        }    
        
    }
    
    
    
}; 
