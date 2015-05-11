var page = {
    
    
    
    injector: {
        
        /***
         * Sample usage:
         * page.injector.inject('#summaryPage', 'summary');
         */
        injectPage: function(selector, key, params) {
            //
            switch(key) {
                case 'login':
                    page.injector.injectLoginPage(selector, params);
                    break;
                case 'localize':
                    page.injector.injectLocalizationPage(selector, params);
                    break;
                case '3pictures':
                    page.injector.inject3PicturesPage(selector, params);
                    break;
                case 'summary':
                    page.injector.injectSummaryPage(selector, params);
                    break;
                case 'dinamica':
                    page.injector.injectDinamic(selector, params);
                    break;
            }
        },
        
        
        injectLoginPage: function(selector, params) {
            var title = 'Login';
            var footerText = '';
            var content =   '<div data-role="header" data-position="fixed">' +
								'<a href="#" data-rel="back" class="ui-btn ui-btn-icon-left ui-btn-left ui-btn-icon-notext ui-icon-toolbar-button toolbar-button-back ui-alt-icon ui-nodisc-icon"></a>' +
                                '<a href="index.html" id="homeButton" rel="external" class="ui-btn ui-btn-icon-right ui-btn-right ui-btn-icon-notext ui-icon-toolbar-button toolbar-button-home ui-alt-icon ui-nodisc-icon">Home</a>' +
                                '<h1 class="title">' + title + '</h1>' +
                            '</div>' +
                            '<div data-role="main" class="ui-content">' +
                                
                                '<ul data-role="listview" data-inset="true">' +
                                    '<li data-role="list-divider">' +
                                        '<h2>' + title + '</h2>' +
                                    '</li>' +
                                    '<li>' +
                                        '<label for="username">Nome utente</label>' +
                                    '</li>' +
                                    '<li>' +
                                        '<input type="text" id="username" placeholder="Nome utente" />' +
                                    '</li>' +
                                    '<li>' +
                                        '<label for="password">Password</label>' +
                                    '</li>' +
                                    '<li>' +
                                        '<input type="password" id="password" placeholder="Password" />' +
                                    '</li>' +
                                    '<li>' +
                                        '<a href="#" class="ui-btn">Login</a>' +
                                    '</li>' +
                                '</ul>' +
                            '</div>' +
                            '<div data-role="footer" data-position="fixed">' +
                                '<h1>' + footerText + '</h1>' +
                            '</div>';
            $(selector).html(content).page();
        },
        
        injectLocalizationPage: function(selector, params) {
            var title = "";
            var dataStep = 0;
            var continueLink = "";
            var footerText = "";
            if(params != null) {
                title = (params.title) ? params.title : "Localizzazione";
                if(params.dataStep) dataStep = params.dataStep;
                if(params.continueLink) continueLink = params.continueLink;
                if(params.footerText) footerText = params.footerText;
            }
            
            var content =   '<div data-role="header" data-position="fixed">' +
				'<a href="#" data-rel="back" class="ui-btn ui-btn-icon-left ui-btn-left ui-btn-icon-notext ui-icon-toolbar-button toolbar-button-back ui-alt-icon ui-nodisc-icon"></a>' +
                                '<a href="index.html" id="homeButton" rel="external" class="ui-btn ui-btn-icon-right ui-btn-right ui-btn-icon-notext ui-icon-toolbar-button toolbar-button-home ui-alt-icon ui-nodisc-icon">Home</a>' +
                                '<h1 class="title">' + title + '</h1>' +
                            '</div>' +
                            
                            '<div data-role="main" class="ui-content">' +
                                
                                '<ul data-role="listview" data-inset="false" data-theme="b">' +
                                    '<li data-role="list-divider">' +
                                        '<div>' +
                                        '<img src="img/identificazione.png" class="ui-li-icon" style="width:2.5em; float:left;">' +
                                        '<h2 style="margin: .65em 0 !important; float:left;"> Identificazione</h2></div>' +
                                    '</li>' +
                                    '<li data-icon="camera">' +
                                        '<a href="#" id="acquireQrCodeButton">' +
                                            '<label>Aquisisci da fotocamera</label>' +
                                        '</a>' +
                                    '</li>' +
                                    '<li data-theme="b">' +
                                        '<input type="text" id="qrCode" placeholder="QR code" />' +
                                    '</li>' +
                                /*'</ul>' +
                                '<ul data-role="listview" data-inset="false" data-theme="b">' +*/
                                    '<li data-role="list-divider">' +
                                        '<div>'+
                                            '<img src="img/localizzazione.png" class="ui-li-icon" style="width:2.5em; float:left;">' +
                                            '<h2 style="margin: .65em 0 !important; float:left;"> Localizzazione</h2></div>' +
                                    '</li>' +
                                    '<li id="getCoordinatesPanel" data-icon="refresh">' +
                                        '<a href="#" id="getCoordinatesButton">' +
                                            '<label id="geoStatusTitle">Ottieni</label>' +
                                        '</a>' +
                                    '</li>' +
                                    '<li>' +
                                        '<input type="hidden" id="latLng" />' +
                                        '<label for="latLng">Latitudine, longitudine e altitudine</label>' +
                                        '<p id="geoStatusText" style="white-space:normal;"></p>' +
                                    '</li>' +
                                    
                                    // If device has an active connection to internet, user can adjust position of the marker on the map
                                    '<li id="openMapPanel" style="display:none;">' +
                                        '<input type="hidden" id="positionIsCorrect" />' +
                                        '<a href="#" id="openMapPageButton">' +
                                        '<div>'+
                                                '<img src="img/maps.png" class="ui-li-icon" style="width:2.5em; float:left;">' +
                                                '<label>Perfeziona sulla mappa</label>' +
                                                '<p id="correctPositionPanel" style="_font-size:1em;color:#d00;white-space: normal;">' +
                                                '</p>' +
                                        '</div>'+
                                        '</a>' +
                                    '</li>';
            if(params.additionalContent) {
                content += params.additionalContent;
            }
            content +=          '</ul>' +
                            '</div>' +
                            '<div data-role="footer" class="footer"  data-position="fixed" align="center" style="background:none !important; background-color: #f2f2f2 !important;">'+
                            '<div style="line-height:25px; color:#0086cc;">' + footerText + '</div>'+
                            '<a href="#" id="nextStep' + dataStep + 'Button" class="button-next next-step" data-step="' + dataStep + '">AVANTI</a>'+
                            '</div>'; 
            $(selector).html(content).page();
        },
        
        
        
        inject3PicturesPage: function(selector, params) {
            var title = "";
            var dataStep = 1;
            var continueLink = "";
            var footerText = "";
            if(params != null) {
                title = (params.title) ? params.title : "Immagini";
                if(params.dataStep) dataStep = params.dataStep;
                if(params.continueLink) continueLink = params.continueLink;
                if(params.footerText) footerText = params.footerText;
            }
            
            var content =   '<div data-role="header" data-position="fixed">' +
                                '<a href="#" data-rel="back" class="ui-btn ui-btn-icon-left ui-btn-left ui-btn-icon-notext ui-icon-toolbar-button toolbar-button-back ui-alt-icon ui-nodisc-icon"></a>' +
                                '<a href="index.html" id="homeButton" rel="external" class="ui-btn ui-btn-icon-right ui-btn-right ui-btn-icon-notext ui-icon-toolbar-button toolbar-button-home ui-alt-icon ui-nodisc-icon">Home</a>' +
                                '<h1 class="title">' + title + '</h1>' +
                            '</div>' +
                            '<div data-role="main" class="ui-content">' +
                                
                                '<ul data-role="listview" data-inset="false" data-theme="b">' +
                                    '<li data-role="list-divider">' +
                                        '<h4>Vista Frontale</h4>' +
                                    '</li>' +
                                    '<li>' +
                                        '<div style="text-align:center;padding:0;">' +
                                            '<a href="#" data-viewtype="front" data-showview style="display:none;">' +
                                                '<img src="" style="width:100%" />' +
                                            '</a>' +
                                            '<a href="#" data-viewtype="front" data-removeview class="ui-btn ui-icon-delete ui-btn-icon-left" style="display:none;">rimuovi</a>' +
                                            '<a href="#" data-viewtype="front" data-addview    class="ui-btn ui-icon-camera ui-btn-icon-left">acquisisci</a>' +
                                        '</div>' +
                                    '</li>' +
                                    '<li data-role="list-divider">' +
                                        '<h4>Vista Retro</h4>' +
                                    '</li>' +
                                    '<li>' +
                                        '<div style="text-align:center;">' +
                                            '<a href="#" data-viewtype="back" data-showview style="display:none;">' +
                                                '<img src="" style="width:100%" />' +
                                            '</a>' +
                                            '<a href="#" data-viewtype="back" data-removeview class="ui-btn ui-icon-delete ui-btn-icon-left" style="display:none;">rimuovi</a>' +
                                            '<a href="#" data-viewtype="back" data-addview    class="ui-btn ui-icon-camera ui-btn-icon-left">acquisisci</a>' +
                                        '</div>' +
                                    '</li>' +
                                    '<li data-role="list-divider">' +
                                        '<h4>Vista Prospettiva</h4>' +
                                    '</li>' +
                                    '<li>' +
                                        '<div style="text-align:center;">' +
                                            '<a href="#" data-viewtype="perspective" data-showview style="display:none;">' +
                                                '<img src="" style="width:100%" />' +
                                            '</a>' +
                                            '<a href="#" data-viewtype="perspective" data-removeview class="ui-btn ui-icon-delete ui-btn-icon-left" style="display:none;">rimuovi</a>' +
                                            '<a href="#" data-viewtype="perspective" data-addview    class="ui-btn ui-icon-camera ui-btn-icon-left">acquisisci</a>' +
                                        '</div>' +
                                    '</li>' +
                                '</ul>' +
                            '</div>' +
                            '<div data-role="footer" class="footer"  data-position="fixed" align="center" style="background:none !important; background-color: #f2f2f2 !important;">'+
                            '<div style="line-height:25px; color:#0086cc;">' + footerText + '</div>'+
                            '<a href="#" id="nextStep' + dataStep + 'Button" class="button-next next-step" data-step="' + dataStep + '">AVANTI</a>'+
                            '</div>'; 
                            
            $(selector).html(content).page();
        },
        
        
        
        injectSummaryPage: function(selector, params){
            var title = "Fine";
            var continueLink = "";
            if(params != null) {
                title = (params.title) ? params.title : "Fine";
                continueLink = (params.continueLink) ? params.continueLink : "";
            }
            var content =   '<div data-role="header" data-position="fixed">' +
                                    '<a href="#" data-rel="back" class="ui-btn ui-btn-icon-left ui-btn-left ui-btn-icon-notext ui-icon-toolbar-button toolbar-button-back ui-alt-icon ui-nodisc-icon"></a>' +
									'<a href="index.html" id="homeButton" rel="external" class="ui-btn ui-btn-icon-left ui-btn-right ui-btn-icon-notext ui-icon-toolbar-button toolbar-button-home ui-alt-icon ui-nodisc-icon">Home</a>' +
                                '<h1 class="title">' + title + '</h1>' +
                            '</div>' +
                            '<div data-role="main" class="ui-content">' +
                                '<ul data-role="listview" data-inset="true">' +
                                    '<li data-role="list-divider">' +
                                        '<h2>Il bene è stato censito</h2>' +
                                    '</li>';
            /*if(helper.isOnline()) {*/
                content +=          '<li>' +
                                        '<a href="javascript:app.syncNow();" id="syncNowButton">Sincronizza subito</a>' +
                                    '</li>';
            /*}*/
            if(continueLink != "") {
                content +=          '<li>' +
                                        '<a href="index.html#censusTypePage" rel="external">Censisci un altro bene</a>' +
                                    '</li>';
            }
            content +=              '<li>' +
                                        '<a href="index.html" rel="external">Torna al menu principale</a>' +
                                    '</li>' +
                                '</ul>' +
                            '</div>' +
                            '<div data-role="footer" data-position="fixed"></div>';
            $(selector).html(content).page();
        }, 
        
        injectDinamic: function (selector, params) {
            //var continueLink = "";
            //if(params != null) {
            //  title = (params.title) ? params.title : "Guardrail";
            // continueLink = (params.continueLink) ? params.continueLink : "";
            //}console.log('titolo',title);
            
            var content ='<div data-role="header" data-position="fixed">' +
				'<a href="#" data-rel="back" class="ui-btn ui-btn-icon-left ui-btn-left ui-btn-icon-notext ui-icon-toolbar-button toolbar-button-back ui-alt-icon ui-nodisc-icon"></a>' +
                                '<a href="index.html" id="homeButton" rel="external" class="ui-btn ui-btn-icon-right ui-btn-right ui-btn-icon-notext ui-icon-toolbar-button toolbar-button-home ui-alt-icon ui-nodisc-icon">Home</a>' +
                                '<h1 class="title">' + params.title + '</h1>' +
                            '</div>' +
                            '<div data-role="main" class="ui-content">';
            
            content += '<fieldset data-role="controlgroup1">'+
                    /* '<legend>Inizio tratto:</legend>'+
                    '<input type="radio" name="radio-choice-2" class="guardrail-mark" id="radio-choice-21" value="1" /> <label for="radio-choice-21">Si</label>'+
                    '<input type="radio"  name="radio-choice-2" class="guardrail-mark" id="radio-choice-22" value="0"  /> <label for="radio-choice-22">No</label>'+
                    //--- 
            */
                    '<div class="InizioSi">'+
                    '<label>Etichetta inizio tratta</label>'+
                    '<input type="text" id="nameIni" placeholder="Nome tratta" required/>'+
                    '<input type="hidden" id="inizio" value="1" />'+
                    //'<label>Prog. km inizio tratta</label>'+
                    //'<input type="text" id="kmInizio" placeholder="inserire nel senso crescente" required/>'+
                    '<legend>Cuspide o terminale barriera stradale</legend>'+
                    '<div data-role="collapsible-set" data-collapsed="true">'+
                    '<div data-role="collapsible" data-collapsed="true" data-collapsed-icon="carat-r" data-expanded-icon="carat-d">'+
                        '<h1>Foto generale ubicativa</h1>'+
                        '<ul data-role="listview" data-theme="b">'+
                            '<li>'+
                                '<h4>Foto</h4> '+
                                    '<div style="text-align:center;">' +
                                        '<a href="#" data-viewtype="foto0" data-showview style="display:none;">' +
                                            '<img src="" style="width:100%" />' +
                                        '</a>' +
                                        '<a href="#" data-viewtype="foto0" data-removeview class="ui-btn ui-icon-delete ui-btn-icon-left" style="display:none;">rimuovi</a>' +
                                        '<a href="#" data-viewtype="foto0" data-addview class="ui-btn ui-icon-camera ui-btn-icon-left">acquisisci</a>' +
                                    '</div>'+
                           '</li>'+
                        '</ul>'+
                    '</div>'+
                    '<div data-role="collapsible" data-collapsed="true" data-collapsed-icon="carat-r" data-expanded-icon="carat-d">'+
                        '<h1>Continuità strutturale con elemento precendente</h1>'+
                        '<ul data-role="listview" data-theme="b">'+
                            '<li>'+
                                '<h4>Foto</h4> '+
                                    '<div style="text-align:center;">' +
                                        '<a href="#" data-viewtype="foto1" data-showview style="display:none;">' +
                                            '<img src="" style="width:100%" />' +
                                        '</a>' +
                                        '<a href="#" data-viewtype="foto1" data-removeview class="ui-btn ui-icon-delete ui-btn-icon-left" style="display:none;">rimuovi</a>' +
                                        '<a href="#" data-viewtype="foto1" data-addview class="ui-btn ui-icon-camera ui-btn-icon-left">acquisisci</a>' +
                                    '</div>'+
                           '</li>'+
                        '</ul>'+
                    '</div>'+
                    '<div data-role="collapsible" data-collapsed="true" data-collapsed-icon="carat-r" data-expanded-icon="carat-d">'+
                        '<h1>Elemento terminale standard (manine)</h1>'+
                        '<ul data-role="listview" data-theme="b">'+
                            '<li>'+
                                '<h4>Foto</h4> '+
                                    '<div style="text-align:center;">' +
                                        '<a href="#" data-viewtype="foto2" data-showview style="display:none;">' +
                                            '<img src="" style="width:100%" />' +
                                        '</a>' +
                                        '<a href="#" data-viewtype="foto2" data-removeview class="ui-btn ui-icon-delete ui-btn-icon-left" style="display:none;">rimuovi</a>' +
                                        '<a href="#" data-viewtype="foto2" data-addview class="ui-btn ui-icon-camera ui-btn-icon-left">acquisisci</a>' +
                                    '</div>' +
                           '</li>'+
                        '</ul>'+
                    '</div>'+
                    '<div data-role="collapsible" data-collapsed="true" data-collapsed-icon="carat-r" data-expanded-icon="carat-d">'+
                        '<h1>Elemento terminale non standard</h1>'+
                        '<ul data-role="listview" data-theme="b">'+
                            '<li>'+
                                '<h4>Foto</h4> '+
                                    '<div style="text-align:center;">' +
                                        '<a href="#" data-viewtype="foto3" data-showview style="display:none;">' +
                                            '<img src="" style="width:100%" />' +
                                        '</a>' +
                                        '<a href="#" data-viewtype="foto3" data-removeview class="ui-btn ui-icon-delete ui-btn-icon-left" style="display:none;">rimuovi</a>' +
                                        '<a href="#" data-viewtype="foto3" data-addview class="ui-btn ui-icon-camera ui-btn-icon-left">acquisisci</a>' +
                                    '</div>' +
                           '</li>'+
                        '</ul>'+
                    '</div>'+
                    '<div data-role="collapsible" data-collapsed="true" data-collapsed-icon="carat-r" data-expanded-icon="carat-d">'+
                        '<h1>Variazione altimetrica nastro (ricurvo verso il basso)</h1>'+
                        '<ul data-role="listview" data-theme="b">'+
                            '<li>'+
                                '<h4>Foto</h4> '+
                                    '<div style="text-align:center;">' +
                                        '<a href="#" data-viewtype="foto4" data-showview style="display:none;">' +
                                            '<img src="" style="width:100%" />' +
                                        '</a>' +
                                        '<a href="#" data-viewtype="foto4" data-removeview class="ui-btn ui-icon-delete ui-btn-icon-left" style="display:none;">rimuovi</a>' +
                                        '<a href="#" data-viewtype="foto4" data-addview class="ui-btn ui-icon-camera ui-btn-icon-left">acquisisci</a>' +
                                    '</div>' +
                           '</li>'+
                        '</ul>'+
                    '</div>'+
                    '<div data-role="collapsible" data-collapsed="true" data-collapsed-icon="carat-r" data-expanded-icon="carat-d">'+
                        '<h1>Variazione planimetrica nastro (ricurvo posteriormente)</h1>'+
                        '<ul data-role="listview" data-theme="b">'+
                            '<li>'+
                                '<h4>Foto</h4> '+
                                    '<div style="text-align:center;">' +
                                        '<a href="#" data-viewtype="foto5" data-showview style="display:none;">' +
                                            '<img src="" style="width:100%" />' +
                                        '</a>' +
                                        '<a href="#" data-viewtype="foto5" data-removeview class="ui-btn ui-icon-delete ui-btn-icon-left" style="display:none;">rimuovi</a>' +
                                        '<a href="#" data-viewtype="foto5" data-addview class="ui-btn ui-icon-camera ui-btn-icon-left">acquisisci</a>' +
                                    '</div>' +
                           '</li>'+
                        '</ul>'+
                    '</div>'+
                    '<div data-role="collapsible" data-collapsed="true" data-collapsed-icon="carat-r" data-expanded-icon="carat-d">'+
                        '<h1>Elemento terminale speciale</h1>'+
                        '<ul data-role="listview" data-theme="b">'+
                            '<li>'+
                                '<label for="classeElemento">Classe Elemento</label>'+
                                '<select id="classeElemento" data-theme="b"></select>'+
                                '<h4>Foto</h4> '+
                                    '<div style="text-align:center;">' +
                                        '<a href="#" data-viewtype="foto6" data-showview style="display:none;">' +
                                            '<img src="" style="width:100%" />' +
                                        '</a>' +
                                        '<a href="#" data-viewtype="foto6" data-removeview class="ui-btn ui-icon-delete ui-btn-icon-left" style="display:none;">rimuovi</a>' +
                                        '<a href="#" data-viewtype="foto6" data-addview class="ui-btn ui-icon-camera ui-btn-icon-left">acquisisci</a>' +
                                    '</div>' +
                           '</li>'+
                        '</ul>'+
                    '</div>'+ //fine collapse
                    '</div>'+//fine collapse globale
                    '<legend>Presenza di ostacoli non cedevoli a tergo della carreggiata</legend>'+
                    '<input type="checkbox" id="alberi"/> <label for="alberi"> Alberi </label> '+
                    '<div id="textAlberi" class="textAlberi"><input type="text" id="nAlberi" placeholder="n°"/></div>'+
                    '<input type="checkbox" id="pali"/> <label for="pali"> Pali</label> '+
                    '<div id="textPali" class="textPali"><input type="text" id="nPali" placeholder="n°"/></div>'+
                    '<input type="checkbox" id="paliIlluminazione"/> <label for="paliIlluminazione"> Pali illuminazione</label> '+
                    '<div id="textPaliIlluminazione" class="textPaliIlluminazione"><input type="text" id="nPaliIlluminazione" placeholder="n°"/></div>'+
                    '<input type="checkbox" id="portaliSegnaletici"/> <label for="portaliSegnaletici"> Portali segnaletici</label>'+
                    '<div id="textPortaliSegnaletici" class="textPortaliSegnaletici"><input type="text" id="nPortaliSegnaletici" placeholder="n°"/></div>'+
                    '<input type="checkbox" id="barriereAntirumore"/> <label for="barriereAntirumore"> Barriere antirumore</label> '+
                    '<div id="textBarriereAntirumore" class="textBarriereAntirumore"><input type="text" id="nBarriereAntirumore" placeholder="n°"/></div>'+
                    '<input type="checkbox" id="altro"/> <label for="altro"> Altro</label>'+
                    '<div id="textAltro" class="textAltro"><input type="text" id="nAltro" placeholder="n°"/></div>'+
                    '<legend>Presenza di by-pass o apertura varchi (principalmente di tipo A e B)</legend>'+
                    '<input type="radio" name="radioGroup" class="guardrail-mark3" id="aperto" value="1" /> <label for="aperto">Aperto</label>'+
                    '<input type="radio" name="radioGroup" class="guardrail-mark3" id="chiuso" value="0" /> <label for="chiuso">Chiuso con dispositivo di protezione mobile</label>'+
                    '<div class="chiuso">'+
                        '<label for="classeChiuso">Classe</label>'+
                        '<select id="classeChiuso" data-theme="b"></select>'+
                    '</div>'+
                    '<input type="radio" name="radioGroup" class="guardrail-mark3" id="attenuatore" value="2" /> <label for="attenuatore">Presenza di attenuatori d urto di testata</label>'+
                    '<div class="attenuatore">'+
                        '<label for="classeAttenuatore">Classe</label>'+
                        '<select id="classeAttenuatore" data-theme="b"></select>'+
                    '</div>'+
                    '</div>';//fine div inizio SI 
                    /*'<div class="InizioNo">'+
                    '<label>Sequenza</label>'+
                    '<input type="number" id="SeqIni" placeholder="numero sequenza"/>'+
                    '<label>Scegli Guardrail</label>'+
                    //'<input type="text" id="nomiInizio" placeholder="Nome inizio"/>  </div>'+
                    '<select id="nomiInizio">'+
                    '<option value="0">Nome Inizio</option>';
                    var NameIniziali = data.guardrail.getNomi();
                    /*console.log("NOME INIZIO",NameIniziali);
                    for(var i in NameIniziali) {
                         content += '<option>' + NameIniziali[i].name + '</option>';
                    }***/
            //content+='</select>'+
                    //'</div>'+
                content+='</fieldset>';
                    /*'<fieldset data-role="controlgroup2">'+
                    //---
                    '<legend>Fine tratto:</legend>'+
                    '<input type="radio" name="radio-choice-21" class="guardrail-mark2" id="radio-choice-211" value="1" /> <label for="radio-choice-211">Si</label>'+
                    '<input type="radio" name="radio-choice-21" class="guardrail-mark2" id="radio-choice-221" value="0" /> <label for="radio-choice-221">No</label>'+
                    '<div class="FineSi">'+
                    '<label>Prog. km fine tratta</label>'+
                    '<input type="text" id="kmFine" placeholder="inserire nel senso crescente" required/>'+
                    '<h4>Foto Finale</h4> '+
                    //'<input type="hidden" id="chiuso" value="1"/>'+
                        '<div style="text-align:center;">' +
                            '<a href="#" data-viewtype="foto7" data-showview style="display:none;">' +
                                '<img src="" style="width:100%" />' +
                            '</a>' +
                            '<a href="#" data-viewtype="foto7" data-removeview class="ui-btn ui-icon-delete ui-btn-icon-left" style="display:none;">rimuovi</a>' +
                            '<a href="#" data-viewtype="foto7" data-addview class="ui-btn ui-icon-camera ui-btn-icon-left">acquisisci</a>' +
                        '</div>' +
                    '</div>'+
                    '</fieldset>';*/
            content += '</div>'+
            '<div data-role="footer" class="footer"  data-position="fixed" align="center" style="background:none !important; background-color: #f2f2f2 !important;">'+
            '<div style="line-height:25px; color:#0086cc;">3 di 3</div>'+
            '<a href="#" id="saveButton" class="button-confirm next-step" data-step="3">SALVA</a>'+
            '</div>';            
            $(selector).html(content).page();
            //inizio
            /*$("input[name$='radio-choice-2']").click(function(){
                var radio_value =$(this).val();
                if (radio_value=='1'){
                    $('.InizioSi').show();
                    $('.InizioNo').hide();
                }
                else{
                    $('.InizioSi').hide();
                    $('.InizioNo').show();
                }
            });
            $('.InizioNo').hide();
            $('.InizioSi').hide();
            //fine
            $("input[name$='radio-choice-21']").click(function(){
                var radio_value =$(this).val();
                if (radio_value=='1'){
                    $('.FineSi').show();
                                    }
                else{
                    $('.FineSi').hide();
                    
                }
            });
            $('.FineSi').hide();
            */
            //Radio Grop by-pass
                $("input[name$='radioGroup']").click(function(){
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
            
           $('#alberi').change(function(){
                if (this.checked){
                    $('#textAlberi').fadeIn('slow');
                }
                else{
                    $('#textAlberi').fadeOut('slow');
                }
            });
            $('#textAlberi').hide();
            
            $('#pali').change(function(){
                if (this.checked){
                    $('#textPali').fadeIn('slow');
                }
                else{
                    $('#textPali').fadeOut('slow');
                }
            });
            $('#textPali').hide();
            
            $('#portaliSegnaletici').change(function(){
                if (this.checked){
                    $('#textPortaliSegnaletici').fadeIn('slow');
                }
                else{
                    $('#textPortaliSegnaletici').fadeOut('slow');
                }
            });
            $('#textPortaliSegnaletici').hide();
            
            $('#paliIlluminazione').change(function(){
                if (this.checked){
                    $('#textPaliIlluminazione').fadeIn('slow');
                }
                else{
                    $('#textPaliIlluminazione').fadeOut('slow');
                }
            });
            $('#textPaliIlluminazione').hide();
            
            $('#barriereAntirumore').change(function(){
                if (this.checked){
                    $('#textBarriereAntirumore').fadeIn('slow');
                }
                else{
                    $('#textBarriereAntirumore').fadeOut('slow');
                }
            });
            $('#textBarriereAntirumore').hide();
            
            $('#altro').change(function(){
                if (this.checked){
                    $('#textAltro').fadeIn('slow');
                }
                else{
                    $('#textAltro').fadeOut('slow');
                }
            });
            $('#textAltro').hide();
        },
       
        GeoCoordinatesAcquired: function(pos) {
        var town;
        var city;
        var village;
        var latlng;
        
            geoLocation.reverseGeocoding(pos, function(result) {
                //console.log(result);
                if(result) {
                    $('#street', $.mobile.activePage).val(result.road);
                    $('#streetNumber', $.mobile.activePage).val(result.streetNumber);
                    $('#provincia', $.mobile.activePage).val(result.prov);
                    if (result.village != null ){                
                        $('#comune', $.mobile.activePage).val(result.village);
                    }
                    else if (result.town != null ){                
                        $('#comune', $.mobile.activePage).val(result.town);
                    }
                    else
                        $('#comune', $.mobile.activePage).val(result.city);
                    //console.log(result);
                }
            });
        },
    }
}
