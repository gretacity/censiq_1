var app = {
    
    STEP_0: 0,
    STEP_1: 1,
    STEP_2: 2,
    STEP_3: 3,
    STEP_4: 4,
    STEP_5: 5,
    STEP_6: 6,
    STEP_7: 7,
    STEP_10: 10,
    STEP_11: 11,
    STEP_12: 12,
    STEP_13: 13,
    STEP_14: 14,
    STEP_15: 15,
    ACQ_GPS:true,
    ID_GPS:0,  
    ACQ:false,
    SELECTED_QRCODE: null,
    MAP:false,
    census: new Census(CensusTypes.guardrail),
    localizationPageId: 'guardrailStep0Page',
    picturesPageId: 'guardrailStep3Page',
    picturesPageIdd: 'guardrailStep4Page',
    pageOffsetTop: 0,
    // Application Constructor
    initialize: function() {
        page.injector.injectPage('#summaryPage', 'summary', {continueLink: '#guardrailStep0Page'});
        var html = '<option>Classe</option>';
        var guardrailClasse = data.guardrail.getGuardrailClasse();
        for(var i in guardrailClasse) 
        {
            html += '<option>' + guardrailClasse[i].name + '</option>';
        }
        $('#classe').html(html);
        var html = '<option>Posizione</option>';
        var guardrailSpartitraffico = data.guardrail.getGuardrailSpartitraffico();
        for(var i in guardrailSpartitraffico) {
            html += '<option>' + guardrailSpartitraffico[i].name + '</option>';
        }
        $('#spartitraffico').html(html);
        
        var html = '<option>Tipo</option>';
        var guardrailTipologia = data.guardrail.getGuardrailTipologia();
        for(var i in guardrailTipologia) {
            html += '<option>' + guardrailTipologia[i].name + '</option>';
        }
        $('#tipologia').html(html);
        
        var html = '<option>Tipo</option>';
        var guardrailFasce = data.guardrail.getGuardrailFasce();
        for(var i in guardrailFasce) {
            html += '<option>' + guardrailFasce[i].name + '</option>';
        }
        $('#fasce').html(html);
        
        var html = '<option>Tipo</option>';
        var guardrailTipologiaPaletto = data.guardrail.getGuardrailTipologiaPaletto();
        for(var i in guardrailTipologiaPaletto) {
            html += '<option>' + guardrailTipologiaPaletto[i].name + '</option>';
        }
        $('#tipologiaPaletto').html(html);
        
        var html = '<option>Tipo</option>';
        var guardrailAncoraggio = data.guardrail.getGuardrailAncoraggio();
        for(var i in guardrailAncoraggio) {
            html += '<option>' + guardrailAncoraggio[i].name + '</option>';
        }
        $('#ancoraggio').html(html);
        
        var html = '<option>Tipo</option>';
        var guardrailClasseElemento = data.guardrail.getGuardrailClasseElemento();
        for(var i in guardrailClasseElemento) {
            html += '<option>' + guardrailClasseElemento[i].name + '</option>';
        }
        $('#classeElemento').html(html);
        
        var html = '<option>Tipo</option>';
        var guardrailClasseChiuso = data.guardrail.getGuardrailClasseChiuso();
        for(var i in guardrailClasseChiuso) {
            html += '<option>' + guardrailClasseChiuso[i].name + '</option>';
        }
        $('#classeChiuso').html(html);
        
        var html = '<option>Tipo</option>';
        var guardrailClasseAttenuatore = data.guardrail.getGuardrailClasseAttenuatore();
        for(var i in guardrailClasseAttenuatore) {
            html += '<option>' + guardrailClasseAttenuatore[i].name + '</option>';
        }
        $('#classeAttenuatore').html(html);
        
        this.bindEvents();        
    },
    
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        // Force onDeviceReady if it's a browser
        if(config.EMULATE_ON_BROWSER) this.onDeviceReady();
        $pageAdd = $('#localizeGuardrailPage');
        $('#mapGuardrailPage').on('pageshow', this.showMapPage);
        $('#mapLocalizeGuardrailPage').on('pageshow', this.showMapPositionPage);
        $('#guardrailStep1Page').on('pageshow', this.showMapPositionPage);
        $('#mapresultGuardrailPage').on('pageshow',  this.acquireCoords);
        $('#guardrailStep2Page').on('pageshow',  this.acquireCoords);
        $('#acquireQrCodePointButton', $pageAdd).on('click', this.acquireQrCodePoint);
        
        $('#newButton').on('click', function(){
            $.mobile.changePage('#guardrailStep0Page', {
                transition: 'slide',
                reverse: false,
                changeHash: false
                });
        });
        $('.prev-step').on('click', this.previousStep);
        $('.next-step').on('click', this.stepCompleted);
        // Step 0
        $page0 = $('#guardrailStep0Page');
        $('#acquireQrCodeButton', $page0).on('click', this.acquireQrCode);
        var $page1 = $('#guardrailStep1Page');
        $('a[data-addview]', $page1).on('click', this.acquirePhoto);
        $('a[data-removeview]', $page1).on('click', this.removePhoto);
        //$('a[data-showview]', $page1).on('click', this.showPhotoDialog);
        $('#photoPage a').on('tap', this.hidePhotoDialog);
        //Step 3
        var $page4 = $('#guardrailStep4Page');
        $('a[data-addview]', $page4).on('click', this.acquirePhotoSola);
        $('a[data-removeview]', $page4).on('click', this.removePhotoSola);
        $("input[name$='radioGroup']").click(function()
        {
            var radio_value =$(this).val();
            if (radio_value=='0'){
                $('.chiuso').show();
                $('.attenuatore').hide();
                                }
            if (radio_value=='2'){
                $('.attenuatore').show();
                $('.chiuso').hide();
            }
            if (radio_value=='1'){
                $('.chiuso').hide();
                $('.attenuatore').hide();
            }
        });
        $('.chiuso').hide();
        $('.attenuatore').hide();
        $('#alberi').change(function()
        {
            if (this.checked)
            {
                $('#textAlberi').fadeIn('slow');
            }
            else
            {
                $('#textAlberi').fadeOut('slow');
            }
        });
        $('#textAlberi').hide();
        
        $('#pali').change(function()
        {
            if (this.checked)
            {
                $('#textPali').fadeIn('slow');
            }
            else
            {
                $('#textPali').fadeOut('slow');
            }
        });
        $('#textPali').hide();
        $('#portaliSegnaletici').change(function()
        {
            if (this.checked)
            {
                $('#textPortaliSegnaletici').fadeIn('slow');
            }
            else
            {
                $('#textPortaliSegnaletici').fadeOut('slow');
            }
        });
        $('#textPortaliSegnaletici').hide();
        $('#paliIlluminazione').change(function()
        {
            if (this.checked)
            {
                $('#textPaliIlluminazione').fadeIn('slow');
            }
            else
            {
                $('#textPaliIlluminazione').fadeOut('slow');
            }
        });
        $('#textPaliIlluminazione').hide();
        $('#barriereAntirumore').change(function()
        {
            if (this.checked)
            {
                $('#textBarriereAntirumore').fadeIn('slow');
            }
            else
            {
                $('#textBarriereAntirumore').fadeOut('slow');
            }
        });
        $('#textBarriereAntirumore').hide();
        $('#altro').change(function()
        {
            if (this.checked)
            {
                $('#textAltro').fadeIn('slow');
            }
            else
            {
                $('#textAltro').fadeOut('slow');
            }
        });
        $('#textAltro').hide();
        $('div[data-role="dialog"]').on('create', function() {
            app.pageOffsetTop = $(this).offset().top;
        });
        $('div[data-role="dialog"]').on('pagehide', function() {
            $.mobile.silentScroll(app.pageOffsetTop);
        });
    },
    showPoints: function(id)
    {
        if($('#'+id).height()==0)
        {
            var height=$('#'+id).prop('scrollHeight');
            $('#'+id).animate({height: height});
        }
        else
        {
            $('#'+id).animate({height: 0});
        }    
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() 
    {
        app.receivedEvent('deviceready');
        data.fetch({status: [data.REC_STATUS_ADDED, data.REC_STATUS_SYNCH_ERROR]}, function(result) {
            //console.log("RESULT SYNC FETCH",result);
            var itemCount = result.rows.length;
            var html = '';
            for(var i = 0; i < itemCount; i++) 
            {
                var row = result.rows.item(i);
                if(row.entity_type==3)
                {
                    //console.log("ROW",row);
                    var obj = data.deserialize(row, row.entity_type);
                    //console.log(obj.guardrail.guardrailInfo);
                    if(obj.guardrail.guardrailInfo.inizio==1)
                    {    
                        var itemId = 'item' + obj.id;
                        var name = data.shortDescription(obj);
                        var qrCode = obj.qrCode;
                        var dateAdded = Date.parseFromYMDHMS(row.date_added).toDMYHMS();
                        html += '<li id="row'+obj.id+'" style="padding:0;' + (false ? 'background-color:#f00;' : '') + '">' ;
                        if(obj.guardrail.guardrailInfo.chiuso==1)
                        {
                                html+='<div id="cls_'+obj.id+'"><img  onclick="app.closeItems(\''+obj.id+'\',0)" src="img/close.png" style="float:right;margin-right:10px; height:32px;width: 32px"></div>';
                        }
                        else
                        {
                            html+='<div id="cls_'+obj.id+'"><img onclick="app.deleteItems(\''+obj.id+'\')" src="img/delete.png" style="float:right;margin-right:10px; height:32px;width: 32px">'+
                                   '<img onclick="app.closeItems(\''+obj.id+'\',1)" src="img/close_red.png" style="float:right;margin-right:10px; height:32px;width: 32px">'+
                                   '<img onclick="app.updateItems(\''+qrCode+'\')" src="img/add_car.png" style="float:right;margin-right:10px; height:32px;width: 32px"></div>';
                        }
                        if( typeof(google) != 'undefined')
                        {  
                            html += '<img onclick="app.showMap(\''+qrCode+'\')" src="img/world.png" style="float:right;margin-right:10px; height:32px;width: 32px">';
                        }
                        html += '<label for="' + itemId +'">'+qrCode+'<br>'+obj.guardrail.guardrailInfo.nomei+'<br>Via ' +obj.guardrail.street +' >> '+obj.guardrail.comune;  
                        if(name != '')
                        {
                            html += '<br />' + name;
                        }
                        html += 
                                '</label>' +
                                '<div id="row'+qrCode+'" ></div>'+
                                '</li>';
                    }
                }
            }
            
            $('#itemList').html(html);
            //$('#itemList').listview("refresh");
            $('#elencoGuardrailPage').trigger('create');
            for(var i = 0; i < itemCount; i++) 
            {
                var row = result.rows.item(i);
                if(row.entity_type==3)
                {
                    var obj = data.deserialize(row, row.entity_type);
                    if(obj.guardrail.guardrailInfo.inizio!=1)
                    {   
                        var parent=$("#row"+obj.guardrail.guardrailInfo.parent);
                        if($("#child"+obj.guardrail.guardrailInfo.parent,parent).length==0)
                        {
                            var txt='<div style="float:right">'+
                                        '<div style="float:right;width: 126px;margin-bottom:3px">'+
                                        '<a id="p_child'+obj.guardrail.guardrailInfo.parent+'" style="margin-right:16px;text-decoration:none;line-height:32px;float:right" href="javascript:app.showPoints(\'child'+obj.guardrail.guardrailInfo.parent+'\')">Punti</a>'+
                                        '</div>'+
                                        '<ul id="child'+obj.guardrail.guardrailInfo.parent+'" class="mainlistChild"></ul>'+
                                        
                                    '</div>'        
                            ;
                            var child=$(txt);   
                            child.appendTo(parent); 
                        }
                        var itemId = 'item' + obj.id;
                        var name = data.shortDescription(obj);
                        var txt= 
                                '<li id="row'+obj.id+'" style="padding:0;">' + 
                                'QR '+obj.qrCode+
                                '<img onclick="app.deleteItems(\''+obj.id+'\')" src="img/delete.png" style="vertical-align:middle;float:right;margin-left:10px; height:32px;width: 32px">'+
                                '</li>';
                        var row_c=$(txt);
                        row_c.appendTo($("#child"+obj.guardrail.guardrailInfo.parent));
                        var pt="punti";
                        if($("#child"+obj.guardrail.guardrailInfo.parent+" li").length==1)
                        {
                            pt="punto";
                        }    
                        
                        $('#p_child'+obj.guardrail.guardrailInfo.parent).html($("#child"+obj.guardrail.guardrailInfo.parent+" li").length+" "+pt);
                    }
                }
            }
           
 
        });
        $('#qrCode').val(config.QR_CODE_TEST);
        $('#qrCode_point').val(config.QR_CODE_TEST);
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
    closeItems: function(itemId, stato)
    {
        data.close(itemId);
       
        data.fetch({status: [data.REC_STATUS_ADDED, data.REC_STATUS_SYNCH_ERROR]}, function(result) {
            //console.log("RESULT SYNC FETCH",result);
            var code='';
            var itemCount = result.rows.length;
           
            for(var i = 0; i < itemCount; i++) 
            {
                var row = result.rows.item(i);
                if(row.entity_type==3)
                {
                    var obj = data.deserialize(row, row.entity_type);
                    if(obj.id==itemId)
                    {    
                      code=obj.qrCode;

                    }
                }
            }
            
            data.fetch({status: [data.REC_STATUS_ADDED, data.REC_STATUS_SYNCH_ERROR]}, function(result) {
            //console.log("RESULT SYNC FETCH",result);
            var itemCount = result.rows.length;
           
            for(var i = 0; i < itemCount; i++) 
            {
                var row = result.rows.item(i);
                if(row.entity_type==3)
                {
                    var obj = data.deserialize(row, row.entity_type);
                    if(obj.guardrail.guardrailInfo.parent==code)
                    {    

                        data.close(obj.id) 
                    }
                }
            }
        });
        
        
        var html='';
        if(stato==1)
        {
                html+='<img  onclick="app.closeItems(\''+itemId+'\',0)" src="img/close.png" style="float:right;margin-right:10px; height:32px;width: 32px">';
        }
        else
        {
            html+='<img onclick="app.deleteItems(\''+itemId+'\')" src="img/delete.png" style="float:right;margin-right:10px; height:32px;width: 32px">'+
                   '<img onclick="app.closeItems(\''+itemId+'\',1)" src="img/close_red.png" style="float:right;margin-right:10px; height:32px;width: 32px">'+
                   '<img onclick="app.updateItems(\''+code+'\')" src="img/add_car.png" style="float:right;margin-right:10px; height:32px;width: 32px">';
        } 
        $("#cls_"+itemId).html(html);
            
            
            
         });
        
         
    },
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
                    if(jQuery.mobile.path.getLocation().indexOf('guardrailStep2Page')>0)
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
                    else
                    {    
                        $('#street_point').val(result.road);
                        $('#provincia_point').val(result.prov);
                        if (result.village != null ){                
                            $('#comune_point').val(result.village);
                        }
                        else if (result.town != null ){                
                            $(' #comune_point').val(result.town);
                        }
                        else
                        {    
                            $('#comune_point').val(result.city);
                        }
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
            
            
            if(jQuery.mobile.path.getLocation().indexOf('guardrailStep1Page')>0)
            {
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
                            $("#btnCoord_0").fadeIn(100);
                            //page.injector.GeoCoordinatesAcquired(app.census.position);             
                        });
                    }
                }
            }
            else
            {    
                $("#start_gps_1").html("GPS");
                $("#start_gps_1").css("color", "#FF1111");
                if( typeof(google) != 'undefined')
                { 
                    if(app._marker!=null && app._marker!=undefined)
                    {
                        app._marker.setOptions({draggable: true});
                        google.maps.event.addListener(
                        app._marker, 
                        'dragend', 
                        function() {
                            app._adjustedCoords = app._marker.getPosition();                
                            app.census.position.latitude =app._marker.getPosition().lat();
                            app.census.position.longitude =app._marker.getPosition().lng();
                            $("#latitudine_1").html('Lat:  '+app.census.position.latitude.toFixed(5));
                            $("#longitudine_1").html('Lon:  '+app.census.position.longitude.toFixed(5));
                            $("#btnCoord_1").fadeIn(100);
                            //page.injector.GeoCoordinatesAcquired(app.census.position);             
                        });
                    }
                }
            }    
        }
        else
        {
            app.ACQ_GPS=true;
            if(jQuery.mobile.path.getLocation().indexOf('guardrailStep1Page')>0)
            {
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
            else
            {
                if( typeof(google) != 'undefined')
                { 
                    if(app._marker!=null && app._marker!=undefined )
                    {
                        app._marker.setOptions({draggable: false});
                        google.maps.event.clearListeners(app._marker, 'dragend');
                    }
                }
                $("#start_gps_1").html("MANUALE");
                $("#start_gps_1").css("color", "#3388cc");
                try
                {
                    clearInterval(app.ID_GPS);
                }
                catch(e){}
                app.ID_GPS=setInterval(function(){app.readGPS()},5000);
            }
        }    
        
    }, 
    readGPS :function()
    {
        if(app.ID_GPS!=0)
        {
            clearInterval(app.ID_GPS);
        }
        
        if(jQuery.mobile.path.getLocation().indexOf('guardrailStep1Page')>0 ||
           jQuery.mobile.path.getLocation().indexOf('mapLocalizeGuardrailPage')>0)
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
                    if(jQuery.mobile.path.getLocation().indexOf('guardrailStep1Page')>0)
                    {
                        $("#latitudine_0").html('Lat:  '+app.census.position.latitude.toFixed(5));
                        $("#longitudine_0").html('Lon:  '+app.census.position.longitude.toFixed(5));
                        $("#accuratezza_0").html('Acc:  '+app.census.position.accuracy.toFixed(1))+' m';
                        $("#btnCoord_0").fadeIn(100);
                    }
                    else
                    {    
                        $("#latitudine_1").html('Lat:  '+app.census.position.latitude.toFixed(5));
                        $("#longitudine_1").html('Lon:  '+app.census.position.longitude.toFixed(5));
                        $("#accuratezza_1").html('Acc:  '+app.census.position.accuracy.toFixed(1))+' m';
                        $("#btnCoord_1").fadeIn(100);
                    }
                    try
                    {
                        var map=app._map;
                        if( typeof(google) != 'undefined')
                        {
                            var markerPoint = new google.maps.LatLng(app.census.position.latitude,app.census.position.longitude);
                            try
                            {

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
                            catch(e)
                            {}
                        }
                        else
                        {
                            var txt = '<div style="padding:20px;margin:20px !important">Lat: '+app.census.position.latitude.toFixed(7)+'<br>'+
                                    'Lon: '+app.census.position.longitude.toFixed(7)+'<br>'+
                                    '<span style="color:#FF1111" >Acc: '+app.census.position.accuracy.toFixed(1)+'</span></div>';
                                $('#'+app.id_map).html(txt);    
                        }
                        
                        if(app.ACQ_GPS)
                        {
                            app.ID_GPS=setInterval(function(){app.readGPS()},5000);
                           
                        }
                    }
                    catch(e)
                    {
                        helper.alert(e.message);
                    }

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
                if(jQuery.mobile.path.getLocation().indexOf('guardrailStep1Page')>0)
                {
                    app.id_map="map_0";
                }
                else
                {    
                    app.id_map="map_1";
                }
                console.log(app.id_map);
                if( typeof(google) != 'undefined')
                {
                   
                    app.MAP=app.openMap();
                    console.log(app.MAP);
                    if(app.MAP)
                    {    
                        app._map.setZoom(16);
                        if(jQuery.mobile.path.getLocation().indexOf('guardrailStep1Page')>0)
                        {
                            $('#start_gps_0').on('click', function(){app.startGPS();});
                            $('#btn_gps_control_0').fadeIn(100);
                        }
                        else
                        {    
                            $('#start_gps_1').on('click', function(){app.startGPS();});
                            $('#btn_gps_control_1').fadeIn(100);
                        }
                    }
                }
                else
                {
                     $('#'+app.id_map).html('<div style="padding:20px;margin:20px !important">Il servizio mappe non è al momento disponibile<br><br>Attendi per la lettura delle coordinate GPS</div>');
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
    showMapPage: function()
    {
        $('#btnback').on('click', function(){
            $.mobile.changePage('#ElencoGuardrailPage', {
                transition: 'slide',
                reverse: false,
                changeHash: false
                });
        });
        
        data.fetch({status: [data.REC_STATUS_ADDED, data.REC_STATUS_SYNCH_ERROR]}, function(result) {
            //console.log("RESULT SYNC FETCH",result);
            var itemCount = result.rows.length;
            var point=null;
            app._map = null;
            app._marker=null;
            app.addEvent=false;
            app.addMarker=false;
            app.id_map="map";
            app.openMap();
            setTimeout( function(){
                app._map.setZoom(16);
                var map = app._map;
                for(var i = 0; i < itemCount; i++) 
                {
                    var row = result.rows.item(i);
                    if(row.entity_type==3)
                    {
                        var obj = data.deserialize(row, row.entity_type);
                        if(obj.guardrail.guardrailInfo.parent== app.SELECTED_QRCODE || obj.qrCode==app.SELECTED_QRCODE)
                        {
                            var markerPoint = new google.maps.LatLng(obj.position.latitude, obj.position.longitude);
                            if(obj.qrCode==app.SELECTED_QRCODE)
                            {
                                point=markerPoint;
                            }    
                            var marker = new google.maps.Marker({
                                    position: markerPoint,
                                    map: map,
                                    draggable: false,
                                    animation: google.maps.Animation.DROP,
                                    title: app.SELECTED_QRCODE
                                });

                            

                        }
                    }
                }
                map.panTo(point);
                },900);
        }); 
    },

    showMap :function(qrCode)
    {
      
        $.mobile.changePage('#mapGuardrailPage', {
                transition: 'slide',
                reverse: false,
                changeHash: false
                });
        app.SELECTED_QRCODE=qrCode;        
    },

    updateItems: function(qrCode)
    {
        data.fetch({status: [data.REC_STATUS_ADDED, data.REC_STATUS_SYNCH_ERROR]}, function(result)
        {
            var itemCount = result.rows.length;
            var seq=2;
            for(var i = 0; i < itemCount; i++) 
            {
                  
                var row = result.rows.item(i);
                if(row.entity_type==3)
                { 
                    console.log(result.rows.item(i));
                    var obj = data.deserialize(row, row.entity_type);
                    if(obj.guardrail.guardrailInfo.parent== qrCode)
                    {
                        seq++;
                    }
                }    
            
            }
            $('#localizeGuardrailPage #sequenza_point').val(seq);
            
        });
        $('#parent','#localizeGuardrailPage').val(qrCode);
        $.mobile.changePage('#localizeGuardrailPage', {
            transition: 'slide',
            reverse: false,
            changeHash: false
        });
    },
    
    deleteItems: function(itemId) {
        helper.confirm('Eliminare in modo definitivo gli elementi selezionati?', function(buttonIndex) {
            if(buttonIndex == 1) {
              
                
                    var liElem = $('#row'+itemId);
                    data.delete(itemId, function() {
                        liElem.remove();
                    
                });
                
             
            }
        }, 'Conferma eliminazione', ['Si', 'No']);
    },
    
    validateStep: function(stepIndex, stepValidCallback, stepNotValidCallback) {
        var errors = [];
        if(stepIndex == app.STEP_0)
        {
            if($.trim($('#qrCode').val()) == '')
            {
                errors.push('specificare il QR-code');
                stepNotValidCallback(errors);
            } else
            {
                stepValidCallback();
            }
        } 
        else if(stepIndex == app.STEP_1) 
        {
            // Validate step 1
            stepValidCallback();
        } 
        else if(stepIndex == app.STEP_2)
        {
            if($.trim($('#comune').val()) == '')
            {
                errors.push('specificare Comune');
                stepNotValidCallback(errors);
                return false;
            }
            else if($.trim($('#provincia').val()) == '')
            {
                errors.push('specificare Provincia');
                stepNotValidCallback(errors);
                return false;
             
            }
            
            else if($.trim($('#street').val()) == '')
            {
                errors.push('specificare Strada');
                stepNotValidCallback(errors);
                return false;
             
            } 
            else if($.trim($('#streetNumber').val()) == '')
            {
                errors.push('specificare Km');
                stepNotValidCallback(errors);
                return false;
             
            } 
            else 
            {    
                stepValidCallback();
            }
        } 
        else if(stepIndex == app.STEP_3)
        {
            stepValidCallback();
        }
        else if(stepIndex == app.STEP_4)
        {
            if($.trim($('#nameIni').val()) == '')
            {
                errors.push('Etichetta inizio tratta');
                $('#nameIni').focus();
                stepNotValidCallback(errors);
            }
            else
            {
                stepValidCallback();
            }
           
        }
        else if(stepIndex == app.STEP_10)
        {
            // Validate step 0
            if($.trim($('#qrCode_point').val()) == '')
            {
                errors.push('specificare il QR-code');
                stepNotValidCallback(errors);
             
            } 
            else {
                stepValidCallback();
            }
        }
        else if(stepIndex == app.STEP_11)
        {
                
            stepValidCallback();
            
        }
        else  if(stepIndex == app.STEP_12)
        {
            if($.trim($('#comune_point').val()) == '')
            {
                errors.push('specificare Comune');
                stepNotValidCallback(errors);
             
            }
            else if($.trim($('#provincia_point').val()) == '')
            {
                errors.push('specificare Provincia');
                stepNotValidCallback(errors);
             
            }
            
            else if($.trim($('#street_point').val()) == '')
            {
                errors.push('specificare Strada');
                stepNotValidCallback(errors);
             
            } 
            else if($.trim($('#streetNumber_point').val()) == '')
            {
                errors.push('specificare Km');
                stepNotValidCallback(errors);
             
            } 
            else 
            {    
                stepValidCallback();
            }
            
        }
    },
    
    stepStarted: function() {
    },
           
    stepCompleted: function() {   
        var step = $(this).attr('data-step');        
        app.validateStep(step, function() {
            // Success: move forward
            if(step == app.STEP_0)
            {
                 $.mobile.changePage('#guardrailStep1Page');
            }
            else if(step == app.STEP_1)
            {
                try
                {
                    clearInterval(app.ID_GPS);
                }
                catch(e){}
                $.mobile.changePage('#guardrailStep2Page');
            } 
            else if(step == app.STEP_2) 
            {
                $.mobile.changePage('#guardrailStep3Page');
            }
            else if(step == app.STEP_3) 
            {
                $.mobile.changePage('#guardrailStep4Page');
            }
            else if(step == app.STEP_4 || step == app.STEP_12)
            {
                app.save();
            }
            else  if(step == app.STEP_10) {
                $.mobile.changePage('#mapLocalizeGuardrailPage');
            }
            else if(step == app.STEP_11)
            {
                try
                {
                    clearInterval(app.ID_GPS);
                }
                catch(e){}
                $.mobile.changePage('#mapresultGuardrailPage');
            }
            else
            {
               
            }    
            
        }, function(errors) {
            // Validation failed: display an error message if there is at least one
            if(Array.isArray(errors) && errors.length > 0) {
                helper.alert("Prima di procedere è necessario " + errors.join(' e '), null, "Avviso");
            }
        });
    },
    
    previousStep: function() {
        var step = $(this).attr('data-step');
        if(step == app.STEP_0) {
            //$.mobile.changePage('index.html#censusTypePage');
            $.mobile.changePage('census.guardrail.html');
        } 
        else if(step == app.STEP_1)
        {
            $.mobile.changePage('#guardrailStep0Page');
            if(app.ID_GPS!=0)
            {
                clearInterval(app.ID_GPS);
                
            }    
        } 
        else if(step == app.STEP_2)
        {
            $.mobile.changePage('#guardrailStep1Page');
        }
        else if(step == app.STEP_3)
        {
            $.mobile.changePage('#guardrailStep2Page');
            
        }
        else if(step == app.STEP_4)
        {
            $.mobile.changePage('#guardrailStep3Page');
        }
        
        else if(step == app.STEP_10) {
           // $.mobile.changePage('#guardrailStep1Page');
        //} else if(step == app.STEP_3) {
            $.mobile.changePage('#ElencoGuardrailPage');
        }
        else if(step == app.STEP_11)
        {
            if(app.ID_GPS!=0)
            {
                clearInterval(app.ID_GPS);
                
            } 
            $.mobile.changePage('#localizeGuardrailPage');
        }
         else if(step == app.STEP_12) {
          $.mobile.changePage('#mapLocalizeGuardrailPage');
        }
        
        
        
    },
    
    save: function() {
        var supportTableData = {grcen: []};
        // Form is valid, proceed with saving.
        // Disable save button
        $('#saveButton').addClass('ui-disabled');
        
        // Update the Census entity...
        app.census.dateAdded = new Date();
        
        app.census.qrCode = $('#qrCode').val();
        if(app.census.qrCode=='' && $('#qrCode_point').val()!='')
        {
            app.census.qrCode = $('#qrCode_point').val();
           
        }
        //app.census.fixedOnMap = $('#positionIsCorrect').val();
        app.census.guardrail.comune = $ ('#comune').val();
        if(app.census.guardrail.comune=='' && $('#comune_point').val()!='')
        {  
          app.census.guardrail.comune = $('#comune_point').val();  
        }
        app.census.guardrail.provincia = $ ('#provincia').val();
        if(app.census.guardrail.provincia=='' && $('#provincia_point').val()!='')
        {
            app.census.guardrail.provincia = $('#provincia_point').val(); 
        }
        app.census.guardrail.street = $('#street').val();
        if(app.census.guardrail.street=='' && $('#street_point').val()!='')
        {
            app.census.guardrail.street = $('#street_point').val(); 
        }
        app.census.guardrail.streetNumber = $('#streetNumber').val();
        if(app.census.guardrail.streetNumber=='' && $('#street_point').val()!='')
        {
            app.census.guardrail.streetNumber = $('#streetNumber_point').val(); 
        }
        var imageKeysGr = ['foto0','foto1', 'foto2', 'foto3','foto4','foto5','foto6'];
        for(var i in imageKeysGr) {
            var k = imageKeysGr[i];
            var imageSrcGr = $('#guardrailStep4Page a[data-viewtype="' + k + '"][data-showview] img').attr('src');
            if(imageSrcGr != '') {
                // Remove this from src attribute:
                //data:image/jpeg;base64,
                app.census.pictures[k] = imageSrcGr.substr(23);
            }
        }
        // informazioni guardrail
        var guardrailInfo = new guardrail.guardrailInfo();
        guardrailInfo.classificazione_classe = $('#classe').val();  
        guardrailInfo.spartitraffico = $('#spartitraffico').val();                                       
        guardrailInfo.pianoVariabile = $('#pianoVariabile').val();                       
        guardrailInfo.tipo = $('#tipologia').val();                               
        guardrailInfo.fasce = $('#fasce').val(); 
        guardrailInfo.tipologiaPaletto = $('#tipologiaPaletto').val();
        guardrailInfo.sezione = $('#sezione').val();                                     
        guardrailInfo.interasse = $('#interasse').val();                           
        guardrailInfo.ancoraggio = $('#ancoraggio').val();                             
        guardrailInfo.classeElemento = $('#classeElemento').val(); 
        guardrailInfo.parent = $('#parent').val();
        guardrailInfo.denominazione_strada = $('#denominazione_strada').val();
        guardrailInfo.textAlberi=$('#nAlberi').val();
        guardrailInfo.tipo_strada=$('#tipo_strada').val();
        guardrailInfo.textPali=$('#nPali').val();
        guardrailInfo.ubicazione_marcia=$('#ubicazione_marcia').val();
        guardrailInfo.textPaliIlluminazione=$('#nPaliIlluminazione').val();
        guardrailInfo.textPortaliSegnaletici=$('#nPortaliSegnaletici').val();
        guardrailInfo.textBarriereAntirumore=$('#nBarriereAntirumore').val();
        guardrailInfo.textAltro=$('#nAltro').val();
        guardrailInfo.radioGroup =$('input:radio[name=radioGroup]:checked').val();
        guardrailInfo.classeChiuso=$('#classeChiuso').val();
        guardrailInfo.classeAttenuatore=$('#classeAttenuatore').val();
        guardrailInfo.nomei = $('#nameIni').val();           
        // nome inizio
        if($('#sequenza_point').val()!='')
        {    
            guardrailInfo.sequenza = $('#sequenza_point').val();
        }
        else
        {
            guardrailInfo.sequenza=1;
            guardrailInfo.parent=0;
        }    
        guardrailInfo.chiuso =0;
        if(guardrailInfo.parent!=0)
        {
            guardrailInfo.inizio=0;
            guardrailInfo.chiuso=0;
        }
        else
        { 
            guardrailInfo.inizio=1;
        }
        app.census.guardrail.guardrailInfo = guardrailInfo;
        data.save(app.census);
        $('#sequenza_point', $page).val('');
        
        // Once saved the census, empty fields of all the steps
        var $page = $('#guardrailStep0Page');
        $('input[type="text"]', $page).val('');
        
        $('input[type="hidden"]', $page).val('');
        var $page = $('#guardrailStep1Page');
        $('input[type="text"]', $page).val('');
        $('input[type="hidden"]', $page).val('');
        app.removePhoto('front');
        app.removePhoto('back');
        app.removePhoto('perspective');
    
        var $page = $('#guardrailStep2Page');
        $('input[type="text"]', $page).val('');
        $('input[type="number"]', $page).val('');
        $('input[type="hidden"]', $page).val('');
        $('select', $page).val(0);
        var $page = $('#guardrailStep3Page');
        $('input[type="text"]', $page).val('');
        $('input[type="number"]', $page).val('');
        $('input[type="hidden"]', $page).val('');
        $('textarea', $page).val('');
        app.removePhoto('foto0');
        app.removePhoto('foto1');
        app.removePhoto('foto2');
        app.removePhoto('foto3');
        app.removePhoto('foto4');
        app.removePhoto('foto5');
        app.removePhoto('foto6');
        $('select', $page).val(0);
        $('#saveButton', $page).removeClass('ui-disabled');
        //$('#syncNowButton').removeClass('ui-disabled').html('Sincronizza subito');
        
        // Speed up development/testing
        $('#qrCode').val(config.QR_CODE_TEST);
        $('#qrCode_point').val(config.QR_CODE_TEST);
        // Move to the last page of the wizard
        $.mobile.changePage('#summaryPage', {
            transition: 'slide'
        });
    }
}
    
    
    
    
    
    
  