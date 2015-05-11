// Specific classes used by guardrail
guardrail = function() {},
guardrail.guardrailInfo = function() {
    // Front
    this.classe = '';                                 
    this.spartitraffico = '';                                   
    this.pianoVariabile = 0;                            
    this.tipologia = '';                              
    this.fasce = '';
    this.tipologiaPaletto = '';
    this.sezione = 0;
    this.interasse = 0;                           
    this.ancoraggio = '';     
    this.classeElemento='';
    this.parent =''; // Inizio Tratto
    //this.kmInizio='';
    this.textAlberi='';
    this.textPali='';
    this.textPaliIlluminazione='';
    this.textPortaliSegnaletici='';
    this.textBarriereAntirumore='';
    this.textAltro='';
    this.kmFine='';
    this.radioGroup='';
    this.classeAttenuatore='';
    this.classeChiuso='';
    this.inizio=0;
    this.chiuso=0;
    //this.fine = '';                                 // Fine Tratto
    this.nomei='';                                  //nome inizio
    //this.sequenzai='';                              //numero sequenza

    //this.nomea='';                                 //nome associato inizio
};
/*guardrail.guardInfo = function() {
    this.marking ='';                               // Inizio Tratto
    this.marking2 = '';                             // Fine Tratto
    this.nomei='';                                  //nome inizio
    this.sequenzai='';                              //numero sequenza
    this.nomea='';                                 //nome associato inizio
};*/

// Extends Census class
Census.prototype.guardrail = function() {},
Census.prototype.guardrail.comune = '';
Census.prototype.guardrail.provincia = '';
Census.prototype.guardrail.street = '';
Census.prototype.guardrail.streetNumber = '';
Census.prototype.guardrail.guardrailInfo = new guardrail.guardrailInfo();
//Census.prototype.guardrail.guards = [];       // Array of guardrail.guardInfo objects



data.guardrail = {       
    // Return the serialized entity string
    serialize: function(entity) {
        //console.log("SERIALIZE GUARDRAIL",entity);
        var data = {
            comune: entity.guardrail.comune,
            provincia: entity.guardrail.provincia,
            street: entity.guardrail.street,
            streetNumber: entity.guardrail.streetNumber,
            guardrailInfo: entity.guardrail.guardrailInfo
            //guards: entity.guardrail.guardInfo,
        };
        //console.log(".." + JSON.stringify(data));
        //console.log("FINE SERIALIZE GUARDRAIL",data);
        console.log(".." + JSON.stringify(data));
        return JSON.stringify(data);
    },
    
    // Return entity from a record
    deserialize: function(row) {
        //console.log("DESERIALIZE GUARDRAIL",row);
        var census = new Census();
        census.id = row.id;
        census.dateAdded = row.date_added;
        census.status = row.status;
        census.entityType = row.entity_type;
        if(row.qr_code!='')
        {
            census.qrCode = row.qr_code;
        }
    else{
            census.qrCode= row.qr_code_point;
        }
        census.position.latitude = row.lat;
        census.position.longitude = row.lng;
        census.position.accuracy = row.accuracy;
        census.fixedOnMap = row.fixed_on_map;
        var tmp = JSON.parse(row.entity_value);
        census.guardrail.comune = tmp.comune;
        census.guardrail.provincia= tmp.provincia;
        census.guardrail.street = tmp.street;
        census.guardrail.streetNumber= tmp.streetNumber;
        census.guardrail.guardrailInfo= tmp.guardrailInfo;
        //console.log("TMP",tmp.guardrailInfo);
        //console.log("FINE DESERIALIZE GUARDRAIL",census);
        return census;
    },

    shortDescription: function(entity) {
        return '';
    },
    
    // Prepare an entity to be formatted for sending on web server
    mapForService: function(entity) {
        //console.log("ENTITY",entity);
        var obj = {
            gr_censimento: {
                //questo arriva sul db, tabella gr_censimento
                comune: entity.guardrail.comune,
                provincia: entity.guardrail.provincia,
                strada: entity.guardrail.street,
                civico: entity.guardrail.streetNumber,
                latitudine: entity.position.latitude,
                longitudine: entity.position.longitude,
                data_inserimento: entity.dateAdded,
                //sys_user_id: 0,
                r_qr_code_id: entity.qrCode,
                classificazione_tipo: entity.guardrail.guardrailInfo.classe,
                spartitraffico: entity.guardrail.guardrailInfo.spartitraffico,
                altezza_piano_viabile: entity.guardrail.guardrailInfo.pianoVariabile,
                tipologia_barriera: entity.guardrail.guardrailInfo.tipologia,
                fasce_orizzontali: entity.guardrail.guardrailInfo.fasce,
                sezione_paletto: entity.guardrail.guardrailInfo.sezione,
                tipologia_paletto: entity.guardrail.guardrailInfo.tipologiaPaletto,
                interasse_paletto: entity.guardrail.guardrailInfo.interasse,
                ancoraggio: entity.guardrail.guardrailInfo.ancoraggio,
                classe_cuspide:entity.guardrail.guardrailInfo.classeElemento,
                alberi:entity.guardrail.guardrailInfo.textAlberi,
                pali:entity.guardrail.guardrailInfo.textPali,
                pali_illuminazione:entity.guardrail.guardrailInfo.textPaliIlluminazione,
                portali_segnaletici:entity.guardrail.guardrailInfo.textPortaliSegnaletici,
                barriere_antirumore:entity.guardrail.guardrailInfo.textBarriereAntirumore,
                altro:entity.guardrail.guardrailInfo.textAltro,
                varchi:entity.guardrail.guardrailInfo.radioGroup,
                classe_varchi:entity.guardrail.guardrailInfo.classeChiuso,
                classe_attenuatori:entity.guardrail.guardrailInfo.classeAttenuatore,
                parent: entity.guardrail.guardrailInfo.parent,
                civico_fine:entity.guardrail.guardrailInfo.kmFine,
                fine: entity.guardrail.guardrailInfo.fine,
                sequenza: entity.guardrail.guardrailInfo.sequenzai,
                nome_inizio: entity.guardrail.guardrailInfo.nomei,
                inizio:entity.guardrail.guardrailInfo.inizio,
                chiuso: entity.guardrail.guardrailInfo.chiuso
            },
            //gr_censimento_info: [],
            pictures: {
                front: entity.pictures['front'],
                back: entity.pictures['back'],
                perspective: entity.pictures['perspective'],
                foto0: entity.pictures['foto0'],
                foto1: entity.pictures['foto1'],
                foto2: entity.pictures['foto2'],
                foto3: entity.pictures['foto3'],
                foto4: entity.pictures['foto4'],
                foto5: entity.pictures['foto5'],
                foto6: entity.pictures['foto6'],
                //foto7: entity.pictures['foto7']
            }
            
        };
        console.log("OGGETTO GUARDRAIL",obj);
        return obj;
    },
    
    /***
     *  Insert or replace data in the support tables
     *  params: {
     *      manufacturers: [{name: '', authNo: ''}],
     *      installers: [{name: ''}],
     *      owners: [{name: ''}], *
     *  }
     */
    updateSupportTables: function(params) {
        //console.log("TABLES");
        if(data._db == null) this.open();
        data._db.transaction(function(t) {
            if(params.grcen) {
                //console.log("ROW",row);
                // Update 
                for(var i in params.manufacturers) {
                    var row = params.manufacturers[i];
                    var q = "insert or replace into gr_censimento_guardrail (numero_nastri_smontaggio, numero_pali_smontaggio, gruppi_terminali_smontaggio, tipologia_barriera_smontaggio, numero_nastri_montaggio, numero_pali_montaggio, gruppi_terminali_montaggio, tipologia_barriera_montaggio,parent, fine, sequenza) values (?, ?,?, ?,?, ?,?,?, ?, ?, ?,?, ?,?, ?)";
                    t.executeSql(q, [row.guardrailInfo.nastri, row.guardrailInfo.pali, row.guardrailInfo.terminali,row.guardrailInfo.barriera, row.guardrailInfo.Mnastri,row.guardrailInfo.Mpali, row.guardrailInfo.Mterminali, row.guardrailInfo.Mbarriera,row.guardrailInfo.parent, row.guardrailInfo.fine, row.guardrailInfo.sequenzai ]);
                }
            }
        });
    },

    getGuardrailClasse: function() {
        return [
            {name: 'N1'},
            {name: 'N2'},
            {name: 'H1'},
            {name: 'H2'},
            {name: 'H3'},
            {name: 'H4'},
            {name: 'Non Classificabile'},
            {name: 'Altro'}
        ];
    },

    getGuardrailSpartitraffico: function() {
        return [
            {name: 'Centrale'},
            {name: 'Laterale rilevato'},
            {name: 'Bordo ponte su opera d\'\'arte'},
        ];
    },
    
        getGuardrailTipologia: function() {
        return [
            {name: 'Metallica (alluminio,acciaio)'},
            {name: 'Misto (legno-metallo)'},
            {name: 'New Jersy'},
            {name: 'Altro'},
            ];
    },
    
    getGuardrailFasce: function() {
        return [
            {name: 'A doppia onda'},
            {name: 'A tripla onda'},
            {name: 'Scatolare'},
            ];
    },
    
    getGuardrailTipologiaPaletto: function() {
        return [
            {name: 'Scatolare'},
            {name: 'Sez. a C'},
            {name: 'IPE o doppia C'},
            ];
    },
    
    getGuardrailAncoraggio: function() {
        return [
            {name: 'Al terreno'},
            {name: 'Con piatra o imbullonati'},
            {name: 'Affogato nel cls'},
            ];
    },
    
    getGuardrailClasseElemento: function() {
        return [
            {name: 'P1'},
            {name: 'P2'},
            {name: 'P3'},
            {name: 'Altro'},
            ];
    },
    
    getGuardrailClasseChiuso: function() {
        return [
            {name: 'H2 (B1)'},
            {name: 'H3 (B2)'},
            {name: 'H4 (B3)'},
            {name: 'Non classificabile'},
            ];
    },
    
    getGuardrailClasseAttenuatore: function() {
        return [
            {name: '100'},
            {name: '80'},
            {name: '50'},
            {name: 'Non classificabile'},
            ];
    },
    
    getNomi: function () {
      this.returnSQLArray('select * from census ', this.processPersonsResponse); 
    },
    
    returnSQLArray: function (str,callback) {
        if(data._db == null) data.open();
        var result = [];
        data._db.transaction(
                function (tx, results) {
                    tx.executeSql(str, [], function(tx, rs) { 
                        for(var i=0; i<rs.rows.length; i++) {
                            var row = rs.rows.item(i);
                            console.log("ROW",row);
                            result[i] = {
                                //id: row['id'],
                                qr: row['qr_code'],
                                nomei : row['entity_value']
                            }
                        }callback(result); });                   
                });   
            },
    
    processPersonsResponse: function (response) {
      //console.log ("RESPONSE",response.length);
      $.each(response, function(key, value) {
        var name = value.nomei; //console.log('name',name);
        var sub = name.indexOf('nomei'); //console.log('sub',sub);
        var subSTR = name.substring(sub+8,value.nomei.length);
        var finale = subSTR.indexOf('","s'); //console.log ('finale',finale);
        var fine = subSTR.substring(0,finale); //console.log ('fine',fine);
        if (fine.length >0) {
            $('#nomiInizio')
                    .append($("<option></option>")
                    .attr("value",value.qr)
                    .text(fine)); }
      });}  
};