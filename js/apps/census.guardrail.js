var app = {
    
    STEP_0: 0,
    STEP_1: 1,
    STEP_2: 2,
    STEP_3: 3,

    census: new Census(CensusTypes.guardrail),
    
    localizationPageId: 'guardrailStep0Page',
    picturesPageId: 'guardrailStep1Page',
    picturesPageIdd: 'guardrailStep3Page',

    
    pageOffsetTop: 0,
    
    // Application Constructor
    initialize: function() {
        // Custom fields used for localization (street , no/km)
        var additionalContent = '<li role="listdivider">&nbsp;</li>' +
                                '<li>' +
                                    '<label for="comune">Comune</label>' +
                                    '<input id="comune" placeholder="Comune" />' +
                                '</li>' +
                                '<li>' +
                                    '<label for="provincia">Provincia</label>' +
                                    '<input id="provincia" placeholder="Provincia" />' +
                                '</li>' +
                                '<li>' +
                                    '<label for="street">Strada / Via</label>' +
                                    '<input id="street" placeholder="Strada o via" />' +
                                '</li>' +
                                '<li>' +
                                    '<label for="streetNumber">Km / Civico</label>' +
                                    '<input id="streetNumber" placeholder="Km o numero civico" />' +
                                '</li>';
        page.injector.injectPage('#guardrailStep0Page', 'localize', {title: 'Guard Rail', footerText: '1 di 3', additionalContent: additionalContent});
        //page.injector.injectPage('#guardrailStep1Page', '3pictures', {title: 'Guard Rail', footerText: '2 di 4'});
        page.injector.injectPage('#summaryPage', 'summary', {continueLink: '#guardrailStep0Page'});
        page.injector.injectPage('#guardrailStep3Page', 'dinamica', {title: 'Guard Rail', footerText: '3 di 3'});
        
        var html = '<option>Classe</option>';
        var guardrailClasse = data.guardrail.getGuardrailClasse();
        for(var i in guardrailClasse) {
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
        $('#closeButton').on('click', app.closeItems); 
        $('#deleteButton').on('click', app.deleteItems);
        $('#addButton').on('click', function(){
            $('#itemList li input[type="checkbox"]:checked').each(function() {
                var qrCode = $(this).attr("data-qrCode");
                 $('#parent','#localizeGuardrailPage').val(qrCode);
            });
            $.mobile.changePage('#localizeGuardrailPage', {
                transition: 'slide',
                reverse: false,
                changeHash: false
                });
        });
        $pageAdd = $('#localizeGuardrailPage');
        $('#acquireQrCodePointButton', $pageAdd).on('click', this.acquireQrCodePoint);
        $('#getCoordinatesPanelPoint', $pageAdd).on('click', this.acquireGeoCoordinatesPoint);
        $('#openMapPageButtonPoint', $pageAdd).on('click', function() {
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
        $('#getCoordinatesPanel', $page0).on('click', this.acquireGeoCoordinates);
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
        // Step1
        var $page1 = $('#guardrailStep1Page');
        //var id = $page1[0].id;
        //console.log('id', id);
        $('a[data-addview]', $page1).on('click', this.acquirePhoto);
        $('a[data-removeview]', $page1).on('click', this.removePhoto);
        //$('a[data-showview]', $page1).on('click', this.showPhotoDialog);
        $('#photoPage a').on('tap', this.hidePhotoDialog);
        //Step 3
        var $page3 = $('#guardrailStep3Page');
        $('a[data-addview]', $page3).on('click', this.acquirePhotoSola);
        $('a[data-removeview]', $page3).on('click', this.removePhotoSola);
        //$('a[data-showview]', $page1).on('click', this.showPhotoDialog);
        
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
    
        
        // For Android devices
        
        $logPanel = $('#log');
        $logPanel.html('Recupero elementi da visualizzare...');
        //console.log("DATA FETCH",this);
        data.fetch({status: [data.REC_STATUS_ADDED, data.REC_STATUS_SYNCH_ERROR]}, function(result) {
            //console.log("RESULT SYNC FETCH",result);
            var itemCount = result.rows.length;
            var html = '';
            for(var i = 0; i < itemCount; i++) {
                //console.log('itemcout',itemCount);
                var row = result.rows.item(i);
                //var obj = data.cityAsset.deserialize(row);
                //console.log("OGGETTO Synch ",row); //row ha latitudine e longitudine
                //console.log("TIPO=",row.entity_type);
                if(row.entity_type==3){
                    console.log("ROW",row);
                var obj = data.deserialize(row, row.entity_type);
                //console.log("OBJ",obj);
                var itemId = 'item' + obj.id;
                var name = data.shortDescription(obj);
                var qrCode = obj.qrCode;
                var dateAdded = Date.parseFromYMDHMS(row.date_added).toDMYHMS();
                html += '<li style="padding:0;' + (false ? 'background-color:#f00;' : '') + '">' + 
                        '<input type="checkbox" id="' + itemId + '" data-qrCode="'+obj.qrCode+'" data-id="' + obj.id + '"  onchange="app.countItemToGuardrail()" />' + 
                        '<label for="' + itemId +'">' + CensusTypeNames[obj.entityType];
                if(name != '') {
                    html += '<br />' + name;
                }
                html += '<br /> codice ' + qrCode +
                        '<br /> aggiunto il ' + dateAdded + '</label>' +
                        '</li>';
            }}
        
            $('#itemList').html(html);
            $('#itemList').listview("refresh");
            $('#elencoGuardrailPage').trigger('create');
            app.countItemToGuardrail();
 
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
    closeItems: function(){
                $('#itemList li input[type="checkbox"]:checked').each(function() {
                    //console.log("QUI",$('#itemList li'));
                    var itemId = $(this).attr("data-id");
                    //console.log("ID",itemId);
                    var liElem = $(this).parents('li');
                    data.close(itemId);
                });
    },

    deleteItems: function() {
        helper.confirm('Eliminare in modo definitivo gli elementi selezionati?', function(buttonIndex) {
            if(buttonIndex == 1) {
                //app.lockUI();
                $('#itemList li input[type="checkbox"]:checked').each(function() {
                    var itemId = $(this).attr("data-id");
                    var liElem = $(this).parents('li');
                    data.delete(itemId, function() {
                        liElem.remove();
                    });
                });
                //app.unlockUI();
                setTimeout(app.countItemToGuardrail, 100);
            }
        }, 'Conferma eliminazione', ['Si', 'No']);
    },
    
    validateStep: function(stepIndex, stepValidCallback, stepNotValidCallback) {
        var errors = [];
        if(stepIndex == app.STEP_0) {
            // Validate step 0
            if($.trim($('#qrCode').val()) == '') {
                errors.push('specificare il QR-code');
                stepNotValidCallback(errors);
            } else if($.trim($('#latLng').val()) == '') {
                helper.confirm('La posizione GPS non è stata specificata.\nVuoi procedere comunque?', function(buttonIndex) {
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
            stepValidCallback();
        } else if(stepIndex == app.STEP_3) {
            // Validate step 3 
           //stepValidCallback();}
           
            if ($( "#radio-choice-21" ).is(':checked')){
                if($.trim($('#nameIni').val()) == '') {
                    errors.push('specificare il nome');
                    $('#nameIni').focus();
                    stepNotValidCallback(errors);
                }
                else {
                    stepValidCallback();
                }
            }else {
                    stepValidCallback();
                    }
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
                //$.mobile.changePage('#guardrailStep1Page');
            //} else if(step == app.STEP_1) {
                $.mobile.changePage('#guardrailStep2Page');
            } else if(step == app.STEP_2) {
                $.mobile.changePage('#guardrailStep3Page');
            } else if(step == app.STEP_3) {
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
        
        if(step == app.STEP_0) {
            //$.mobile.changePage('index.html#censusTypePage');
            $.mobile.back();
        } else if(step == app.STEP_1) {
            $.mobile.changePage('#guardrailStep0Page');
        } else if(step == app.STEP_2) {
           // $.mobile.changePage('#guardrailStep1Page');
        //} else if(step == app.STEP_3) {
            $.mobile.changePage('#guardrailStep2Page');
        }
    },
    
   
        countItemToGuardrail: function() {
        var connectionAvailable = helper.isOnline();
        var allItems = $('#itemList li').length;
        var itemToGuardrail = $('#itemList li input[type="checkbox"]:checked').length;
        $logPanel = $('#log');
        $logPanel.html((allItems == 0) ? 'Nessun elemento.'
                                       : itemToGuardrail + ' ' + ' di ' + allItems + ' elementi ');
        if(itemToGuardrail == 1) {
            $('#closeButton').removeClass('ui-disabled');
            $('#deleteButton').removeClass('ui-disabled');
            $('#newButton').removeClass('ui-disabled');
            
            
        }else if(){
            $('#addButton').removeClass('ui-disabled');
        }
        } else if(itemToGuardrail > 1 ) {
            $('#closeButton').addClass('ui-disabled');
            $('#addButton').addClass('ui-disabled');
            $('#newButton').addClass('ui-disabled');
        }else if(itemToGuardrail == 0 ) {
            $('#closeButton').addClass('ui-disabled');
            $('#deleteButton').addClass('ui-disabled');
            $('#addButton').addClass('ui-disabled');
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
            //var inizio_point=1;
        }
        //app.census.position.latitude = '';    // Already set
        //app.census.position.longitude = '';   // Already set
        //app.census.position.accuracy = '';    // Already set
        app.census.fixedOnMap = $('#positionIsCorrect').val();
        
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
        
        // Pictures related to the city asset
        /* var imageKeys = ['front', 'back', 'perspective'];
        for(var i in imageKeys) {
            var k = imageKeys[i];
            var imageSrc = $('#guardrailStep1Page a[data-viewtype="' + k + '"][data-showview] img').attr('src');
            if(imageSrc != '') {
                // Remove this from src attribute:
                // data:image/jpeg;base64,
                app.census.pictures[k] = imageSrc.substr(23);
            }
        }*/
        
        var imageKeysGr = ['foto0','foto1', 'foto2', 'foto3','foto4','foto5','foto6'];
        for(var i in imageKeysGr) {
            var k = imageKeysGr[i];
            var imageSrcGr = $('#guardrailStep3Page a[data-viewtype="' + k + '"][data-showview] img').attr('src');
            if(imageSrcGr != '') {
                // Remove this from src attribute:
                //data:image/jpeg;base64,
                app.census.pictures[k] = imageSrcGr.substr(23);
            }
        }
        /*var imageGr=['fotogr'];
        var imageSrcGr=$('#guardrailStep3Page a[data-viewtype=fotogr][data-showview] img').attr('src');
        if(imageSrcGr != '') {
                // Remove this from src attribute:
                // data:image/jpeg;base64,
                app.census.pictures['fotogr'] = imageSrcGr.substr(23);
            }
        */
        // informazioni guardrail
        var guardrailInfo = new guardrail.guardrailInfo();
        guardrailInfo.classe = $('#classe').val();                                    
        guardrailInfo.spartitraffico = $('#spartitraffico').val();                                       
        guardrailInfo.pianoVariabile = $('#pianoVariabile').val();                       
        guardrailInfo.tipologia = $('#tipologia').val();                               
        guardrailInfo.fasce = $('#fasce').val(); 
        guardrailInfo.tipologiaPaletto = $('#tipologiaPaletto').val();
        guardrailInfo.sezione = $('#sezione').val();                                     
        guardrailInfo.interasse = $('#interasse').val();                           
        guardrailInfo.ancoraggio = $('#ancoraggio').val();                             
        guardrailInfo.classeElemento = $('#classeElemento').val(); 
        //guardrailInfo.parent = $('input[type="radio"].guardrail-mark:checked').val(); 
        //guardrailInfo.parent = $('#nomiInizio').val(); 
        //guardrailInfo.kmInizio = $('#kmInizio').val();
        guardrailInfo.parent = $('#parent').val();
        guardrailInfo.textAlberi=$('#nAlberi').val();
        guardrailInfo.textPali=$('#nPali').val();
        guardrailInfo.textPaliIlluminazione=$('#nPaliIlluminazione').val();
        guardrailInfo.textPortaliSegnaletici=$('nPortaliSegnaletici').val();
        guardrailInfo.textBarriereAntirumore=$('#nBarriereAntirumore').val();
        guardrailInfo.textAltro=$('#nAltro').val();
        guardrailInfo.radioGroup = $('input[type="radio"].guardrail-mark3:checked').val();
        guardrailInfo.classeChiuso=$('#classeChiuso').val();
        guardrailInfo.classeAttenuatore=$('#classeAttenuatore').val();
        //guardrailInfo.fine = $('input[type="radio"].guardrail-mark2:checked').val();
        //guardrailInfo.kmFine = $('#kmFine').val();
        //guardrailInfo.nomei = $('#nameIni').val();                                 // nome inizio
        //guardrailInfo.sequenzai = $('#SeqIni').val();                              // numero sequenza iniziale
        guardrailInfo.chiuso =0;

        guardrailInfo.nomei=$('#nomeIni').val();                              // nome inizio associato
        if(guardrailInfo.parent!=''){
        guardrailInfo.inizio=0;}else{ guardrailInfo.inizio=1;}
        app.census.guardrail.guardrailInfo = guardrailInfo;
        //console.log("RAILINFO APPS",guardrailInfo);
        
        // informazioni tratto
      /*
        var guardInfo = new guardrail.guardInfo();
        
r        console.log("GUARD APPS",guardInfo);
        
        app.census.guardrail.guards.push(guardInfo);
        // ...and save it
        // TODO Reenable
        //data.roadSign.updateSupportTables(supportTableData);
        */
        data.save(app.census);
        
        
        // Once saved the census, empty fields of all the steps
        var $page = $('#guardrailStep0Page');
        $('input[type="text"]', $page).val('');
        $('input[type="hidden"]', $page).val('');
        $('#geoStatusText', $page).html('Latitudine e longitudine');
        $('#geoStatusTitle', $page).html('Ottieni');
        $('#openMapPanel', $page).hide();
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
    
    
    
    
    
    
  