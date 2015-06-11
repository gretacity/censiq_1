// Specific classes used by road sign module
RoadSign = function() {}
RoadSign.SignInfo = function() {
    // Front
    this.roadSignId = 0;            // ID segnale
    this.size = '';                 // Dimensione
    this.roadSignType = '';         // Tipologia (monofacciale, bifacciale)
    this.support = '';              // Supporto (alluminio, ferro)
    this.film = '';                 // Pellicola
    this.maintenance = 0;           // Tipo intervento
    this.maintenanceNotes = '';     // Descrizione intervento (eventuali note)
    // Back
    this.marking = '';              // Marchio [CE], [OM]ologato, []Non Omologato
    this.manufacturer = '';         // Ditta produttrice
    this.manufacturerNo = '';       // Numero autorizzazione ditta produttrice
    this.manufacturingYear = null;  // Anno di produzione
    this.installer = '';            // Azienda installatrice
    this.installationDate = '';     // Data (o anno???) di installazione
    this.owner = '';                // Proprietario
    this.ordinanceNo = '';          // Ordinanza numero
    this.ordinanceDate = null;      // Data dell'ordinanza
    this.data_scadenza = null;      // Scadenza dell'ordinanza
    this.proprietario_1 = null;      // Agagrafica proprietario per i passi carrabili
    this.proprietario_2 = null;      // Agagrafica proprietario per i passi carrabili
    this.proprietario_3 = null;      // Agagrafica proprietario per i passi carrabili

    

}
RoadSign.PoleInfo = function() {
    this.numberOfPoles = 0;         // Numero di pali
    this.poleDiameter = 0;          // Diametro dei pali
    this.poleHeight = 0;            // Altezza dei pali
    this.poleNumberOfSingleSidedBrackets = 0;   // Numero staffe monofacciali usate per i pali
    this.poleNumberOfDoubleSidedBrackets = 0;   // Numero staffe bifacciali usate per i pali
    
    this.numberOfPolesUpwind = 0;   // Numero di pali controvento
    this.poleUpwindDiameter = 0;    // Diametro dei pali controvento
    this.poleUpwindHeight = 0;      // Altezza dei pali controvento
    this.poleUpwindNumberOfSingleSidedBrackets = 0; // Numero staffe monofacciali usate per i pali controvento
    this.poleUpwindNumberOfDoubleSidedBrackets = 0; // Numero staffe bifacciali usate per i pali controvento
    this.poleUpwindNumberOfUpwindBrackets = 0;      // Numero staffe controvento usate per i pali controvento
}

RoadSign.CE_MARK = "CE";
RoadSign.APPROVED_MARK = "OM";
RoadSign.NO_MARK = "";





// Extends Census class
Census.prototype.roadSign = function() {}
Census.prototype.roadSign.comune = '';
Census.prototype.roadSign.provincia = '';
Census.prototype.roadSign.street = '';
Census.prototype.roadSign.streetNumber = '';
Census.prototype.roadSign.itinerario_internazionale = '';
Census.prototype.roadSign.distanza = '';
Census.prototype.roadSign.denominazione_strada = '';
Census.prototype.roadSign.tipo_strada = '';

Census.prototype.roadSign.ditta_installatrice = '';
Census.prototype.roadSign.data_installazione = '';
Census.prototype.roadSign.installatore = '';
Census.prototype.roadSign.ditta_produttrice = '';
Census.prototype.roadSign.ordinanza_numero = '';
Census.prototype.roadSign.ordinanza_del = '';
Census.prototype.roadSign.ordinanza_dismissione = '';
Census.prototype.roadSign.dismissione_del = '';
Census.prototype.roadSign.note = '';
Census.prototype.roadSign.distanza_pos = '';
Census.prototype.roadSign.cippo = '';
Census.prototype.roadSign.tipo_impianto = '';
Census.prototype.roadSign.altro_tipo_impianto = '';
Census.prototype.roadSign.tipo_supporto = '';
Census.prototype.roadSign.altro_tipo_supporto = '';
Census.prototype.roadSign.materiale_supporto = '';
Census.prototype.roadSign.sezione = '';
Census.prototype.roadSign.altezza_supporto = '';
Census.prototype.roadSign.distanza_ciglio = '';
Census.prototype.roadSign.stato_conservazione = '';
Census.prototype.roadSign.disposizione_segnali = '';
Census.prototype.roadSign.id_supporto = '';

Census.prototype.roadSign.signs = [];       // Array of RoadSign.SignInfo objects
Census.prototype.roadSign.poleInfo = new RoadSign.PoleInfo();




// Specific methods of the cityasset class
data.roadSign = {

    // Return the serialized entity string
    serialize: function(entity) {
        var data = {
            //assetType: entity.cityAsset.assetType,
            //assetName: entity.cityAsset.assetName,
            //description: entity.cityAsset.description,
            //notes: entity.cityAsset.notes
            comune: entity.roadSign.comune,
            provincia: entity.roadSign.provincia,
            street: entity.roadSign.street,
            streetNumber: entity.roadSign.streetNumber,
            itinerario_internazionale:entity.roadSign.itinerario_internazionale,
            denominazione_strada:entity.roadSign.denominazione_strada,
            tipo_strada:entity.roadSign.tipo_strada,
            distanza:entity.roadSign.distanza,
            ditta_installatrice:entity.roadSign.ditta_installatrice,
            data_installazione:entity.roadSign.data_installazione,
            installatore:entity.roadSign.installatore,
            ditta_produttrice:entity.roadSign.ditta_produttrice,
            ordinanza_numero:entity.roadSign.ordinanza_numero,
            ordinanza_del:entity.roadSign.ordinanza_del,
            ordinanza_disnmissione:entity.roadSign.ordinanza_disnmissione,
            disnmissione_del:entity.roadSign.disnmissione_del,
            note:entity.roadSign.note,
            posizione:entity.roadSign.posizione,
            distanza_pos:entity.roadSign.distanza_pos,
            cippo:entity.roadSign.cippo,
            tipo_impianto:entity.roadSign.tipo_impianto,
            altro_tipo_impianto:entity.roadSign.altro_tipo_impianto,
            tipo_supporto:entity.roadSign.tipo_supporto,
            altro_tipo_supporto:entity.roadSign.altro_tipo_supporto,
            materiale_supporto:entity.roadSign.materiale_supporto,
            sezione:entity.roadSign.sezione,
            altezza_supporto:entity.roadSign.altezza_supporto,
            distanza_ciglio:entity.roadSign.distanza_ciglio,
            stato_conservazione:entity.roadSign.stato_conservazione,
            disposizione_segnali:entity.roadSign.disposizione_segnali,
            id_segnali:entity.roadSign.id_segnali,
            signs: entity.roadSign.signs,
            poleInfo: entity.roadSign.poleInfo
        };
//console.log(entity);
//console.log(".." + JSON.stringify(data));
        return JSON.stringify(data);
    },
    
    // Return entity from string    
    deserialize: function(row) {
        var census = new Census();
        census.id = row.id;
        census.dateAdded = row.date_added;
        census.status = row.status;
        census.entityType = row.entity_type;
        census.qrCode = row.qr_code;
        census.position.latitude = row.lat;
        census.position.longitude = row.lng;
        census.position.accuracy = row.accuracy;
        census.fixedOnMap = row.fixed_on_map;
        var tmp = JSON.parse(row.entity_value);
//console.log(row);
//console.log(tmp);
        census.roadSign.comune = tmp.comune;
        census.roadSign.provincia = tmp.provincia;
        census.roadSign.street = tmp.street;
        census.roadSign.streetNumber = tmp.streetNumber;
        census.roadSign.itinerario_internazionale = tmp.itinerario_internazionale;
        census.roadSign.tipo_strada = tmp.tipo_strada;
        census.roadSign.distanza = tmp.distanza;
        census.roadSign.denominazione_strada = tmp.denominazione_strada;
        census.roadSign.ditta_installatrice = tmp.ditta_installatrice;
        census.roadSign.data_installazione = tmp.data_installazione;
        census.roadSign.installatore = tmp.installatore;
        census.roadSign.ditta_produttrice = tmp.ditta_produttrice;
        census.roadSign.ordinanza_numero = tmp.ordinanza_numero;
        census.roadSign.ordinanza_del = tmp.ordinanza_del;
        census.roadSign.ordinanza_dismissione = tmp.ordinanza_dismissione;
        census.roadSign.dismissione_del = tmp.dismissione_del;
        census.roadSign.note = tmp.note;
        census.roadSign.posizione = tmp.posizione;
        census.roadSign.distanza_pos = tmp.distanza_pos;
        census.roadSign.cippo = tmp.cippo;
        census.roadSign.tipo_impianto = tmp.tipo_impianto;
        census.roadSign.altro_tipo_impianto = tmp.altro_tipo_impianto;
        census.roadSign.tipo_supporto = tmp.tipo_supporto;
        census.roadSign.altro_tipo_supporto = tmp.altro_tipo_supporto;
        census.roadSign.materiale_supporto = tmp.materiale_supporto;
        census.roadSign.sezione = tmp.sezione;
        census.roadSign.altezza_supporto = tmp.altezza_supporto;
        census.roadSign.distanza_ciglio = tmp.distanza_ciglio;
        census.roadSign.stato_conservazione = tmp.stato_conservazione;
        census.roadSign.disposizione_segnali = tmp.disposizione_segnali;
        census.roadSign.id_supporto = tmp.id_supporto;
        
        
        census.roadSign.signs = tmp.signs;
        census.roadSign.poleInfo = tmp.poleInfo;
//console.log(census);
        return census;
    },
    
    shortDescription: function(entity) {
        return '';
    },
    
    // Prepare an entity to be formatted for sending on web server
    mapForService: function(entity) {
        
        var obj = {
            ss_censimento: {
                latitudine: entity.position.latitude,
                longitudine: entity.position.longitude,
                // Pole info
                numero_pali: entity.roadSign.poleInfo.numberOfPoles,
                diametro_pali: entity.roadSign.poleInfo.poleDiameter,
                altezza_pali: entity.roadSign.poleInfo.poleHeight,
                numero_staffe_monofacciali: entity.roadSign.poleInfo.poleNumberOfSingleSidedBrackets,
                numero_staffe_bifacciali: entity.roadSign.poleInfo.poleNumberOfDoubleSidedBrackets,
                // Upwind pole info
                numero_pali_controvento: entity.roadSign.poleInfo.numberOfPolesUpwind,
                diametro_pali_controvento: entity.roadSign.poleInfo.poleUpwindDiameter,
                altezza_pali_controvento: entity.roadSign.poleInfo.poleUpwindHeight,
                numero_staffe_monofacciali_controvento: entity.roadSign.poleInfo.poleUpwindNumberOfSingleSidedBrackets,
                numero_staffe_bifacciali_controvento: entity.roadSign.poleInfo.poleUpwindNumberOfDoubleSidedBrackets,
                numero_staffe_controvento: entity.roadSign.poleInfo.poleUpwindNumberOfUpwindBrackets,
                data_inserimento: entity.dateAdded,
                //sys_user_id: 0,
                r_qr_code_id: entity.qrCode,
                comune :entity.roadSign.comune,
                provincia :entity.roadSign.provincia,
                strada: entity.roadSign.street,
                tipo_strada:entity.roadSign.tipo_strada,
                itinerario_internazionale:entity.roadSign.itinerario_internazionale,
                denominazione_strada:entity.roadSign.denominazione_strada,
                civico: entity.roadSign.streetNumber,
                distanza :entity.roadSign.distanza,
                ditta_installatrice :entity.roadSign.ditta_installatrice,
                data_installazione :entity.roadSign.data_installazione,
                installatore :entity.roadSign.installatore,
                ditta_produttrice :entity.roadSign.ditta_produttrice,
                ordinanza_numero :entity.roadSign.ordinanza_numero,
                ordinanza_del :entity.roadSign.ordinanza_del,
                ordinanza_dismissione :entity.roadSign.ordinanza_dismissione,
                dismissione_del :entity.roadSign.dismissione_del,
                note :entity.roadSign.note,
                posizione :entity.roadSign.posizione,
                distanza_pos :entity.roadSign.distanza_pos,
                cippo :entity.roadSign.cippo,
                tipo_impianto :entity.roadSign.tipo_impianto,
                altro_tipo_impianto :entity.roadSign.altro_tipo_impianto,
                tipo_supporto :entity.roadSign.tipo_supporto,
                altro_tipo_supporto :entity.roadSign.altro_tipo_supporto,
                materiale_supporto :entity.roadSign.materiale_supporto,
                sezione :entity.roadSign.sezione,
                altezza_supporto :entity.roadSign.altezza_supporto,
                distanza_ciglio :entity.roadSign.distanza_ciglio,
                stato_conservazione :entity.roadSign.stato_conservazione,
                disposizione_segnali :entity.roadSign.disposizione_segnali,
                id_supporto :entity.roadSign.id_supporto
            },
            ss_censimento_cartello: [],
            pictures: {
                front: entity.pictures['front'],
                back: entity.pictures['back'],
                perspective: entity.pictures['perspective']
            }
        };
        
        // Loop on roadsigns
        for(var i in entity.roadSign.signs) {
            var sign = entity.roadSign.signs[i];
            var roadSignType = (sign.roadSignType.toLowerCase() == 'monofacciale') ? 'M' : 'B';
            var roadSignMarking = '';
            switch(sign.marking) {
                case RoadSign.CE_MARK:
                    roadSignMarking = 'C';
                    break;
                case RoadSign.APPROVED_MARK:
                    roadSignMarking = 'O';
                    break;
                default:    //RoadSign.NO_MARK = "";
                    break;
            }
            var entry = {
                ss_segnale_id: sign.roadSignId,
                ss_pellicola_id: sign.film,
                ss_supporto_id: sign.support,
                tipologia: roadSignType,      // Monofacciale / bifacciale
                marcatura: roadSignMarking,      // [C]E, [O]mologato, {vuoto} non omologato
                ditta_produttrice: sign.manufacturer,
                num_aut_ditta_produttrice: sign.manufacturerNo,
                anno_produzione: sign.manufacturingYear,
                ditta_installatrice: sign.installer,
                data_installazione: sign.installationDate,
                proprietario: sign.owner,
                ordinanza_numero: sign.ordinanceNo,
                ordinanza_del: sign.ordinanceDate,
                necessario_intervento_tipo: sign.maintenance,
                necessario_intervento_descrizione: sign.maintenanceNotes,
                dimensioni: sign.size,
                particolari_descrizione: sign.particolari_descrizione,
                data_scadenza:sign.data_scadenza,
                proprietario_1:sign.proprietario_1,
                proprietario_2:sign.proprietario_2,
                proprietario_3:sign.proprietario_3
                //ss_censimento_id: 0
            };
            obj.ss_censimento_cartello.push(entry);
        }
        
        return obj;
    },
    
    /***
     *  Insert or replace data in the support tables
     *  params: {
     *      manufacturers: [{name: '', authNo: ''}],
     *      installers: [{name: ''}],
     *      owners: [{name: ''}],
     *  }
     */
    updateSupportTables: function(params) {
        
        if(data._db == null) this.open();
        
        data._db.transaction(function(t) {
            
            if(params.manufacturers) {
                // Update manufacturers
                for(var i in params.manufacturers) {
                    var row = params.manufacturers[i];
                    var q = "insert or replace into rs_manufacturers (name, auth_no) values (?, ?)";
                    t.executeSql(q, [row.name, row.authNo]);
                }
            }
            
            if(params.installers) {
                // Update installers
                for(var i in params.installers) {
                    var row = params.installers[i];
                    var q = "insert or replace into rs_installers (name) values (?)";
                    t.executeSql(q, [row.name]);
                }
            }
            
            if(params.owners) {
                // Update owners
                for(var i in params.owners) {
                    var row = params.owners[i];
                    var q = "insert or replace into rs_owners (name) values (?)";
                    t.executeSql(q, [row.name]);
                }
            }
        });
    },

    
    getManufacturers: function() {
        // Get a list of manufacturer previously entered
        // TODO
    },
    
    getInstallers: function() {
        // Get a list of installers previously entered
        // TODO
    },
    
    
    // ss_forma (is empty on data server!)
    getRoadSignShapes: function() {
        return [
            {name: 'Quadrato'},
            {name: 'Rombo'},
            {name: 'Rettangolo'},
            {name: 'Triangolo'},
            {name: 'Cerchio'},
            {name: 'Ottagono'}
        ];
    },
    
    // ss_dimensione (is empty on data server!)
    getRoadSignSizes: function(completeCallback) {
        // cm
        /*return [
            {size: '40'},
            {size: '60'},
            {size: '90'},
            {size: '120'},
            {size: '40x60'},
            {size: '60x90'},
            {size: '90x135'}
        ];*/
        data.lookupTable({key: data.DATA_SIZES}, function(result) {
            completeCallback(result);
        });
    },
    
    getRoadSignTypes: function() {
        return [
            "Monofacciale",
            "Bifacciale"
        ];
    },
    
    // ss_supporto
    getRoadSignSupports: function(completedCallback) {
        data.lookupTable({key: data.DATA_SUPPORTS}, function(result) {
            completedCallback(result);
        });
    },
    
    // ss_pellicola
    getRoadSignFilms: function(completedCallback) {
        data.lookupTable({key: data.DATA_FILMS}, function(result) {
            completedCallback(result);
        });
    },
    
    // 
    getRoadSignMaintenances: function() {
        return [
            {id: 0, name: 'Non necessario'},
            {id: 1, name: 'Sostituzione parziale'},
            {id: 2, name: 'Sostituzione totale'},
            {id: 3, name: 'Soggetto e manutenzione'}
        ];
    },
    
        
    // Not used and not in the database
    /*getRoadSignCategories: function() {
        return [
            "divieto",
            "indicazione",
            "obbligo",
            "pannello integrativo",
            "pericolo",
            "precedenza",
            "precendeza",
            "segnale"
        ];
    },*/
    
    
    
    getBracketDiameters: function() {
        return [
            '48 mm',
            '60 mm',
            '90 mm'
        ];
    },
    
    
    // ss_segnale
    getRoadSigns: function(params, completedCallback) {
        // roadsign (id, code, figure, name, category, icon)
        // TODO add roadsign.shape
        var filterArray = [];
        if((params.shape || '') != '') {
            // TODO
            //filterArray.push('shape = ...');
        }
        if((params.search || '') != '') {
            // if it is a number perform the seach in the code field,
            // in the name otherwise
            var isNumeric = (!isNaN(params.search)) && isFinite(params.search);
            filterArray.push(isNumeric ? 
                            "code = " + params.search : 
                            "name like '%" + params.search.replace(/'/g, "''") + "%'");
        }
        var filter = filterArray.join(' and ');
        data.lookupTable({key: data.DATA_ROADSIGN, filter: filter}, function(result) {
            completedCallback(result);
        });
    }
};