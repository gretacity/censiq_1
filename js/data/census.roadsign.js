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
                civico: entity.roadSign.streetNumber
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
                dimensioni: sign.size
                //particolari_descrizione: ''
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