// Specific classes used by road sign module
Sopralluoghi = function() {}
Sopralluoghi.SignInfo = function() {
    // Front
    this.roadSignId = 0;            // ID segnale
    this.size = '';                 // Dimensione
    this.roadSignType = '';         // Tipologia (monofacciale, bifacciale)
    this.support = '';              // Supporto (alluminio, ferro)
    this.film = '';
    this.rimozione=0;// Pellicola
    
    
}
Sopralluoghi.PoleInfo = function() {
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
    this.oldPole = 0                //0:riutilizzare; 1:rimuovere; 2:sostituire ;
    this.old_signs_number='';
}

// Extends Census class
Census.prototype.sopralluoghi = function() {}
Census.prototype.sopralluoghi.comune = '';
Census.prototype.sopralluoghi.provincia = '';
Census.prototype.sopralluoghi.street = '';
Census.prototype.sopralluoghi.streetNumber = '';
Census.prototype.sopralluoghi.note = '';

Census.prototype.sopralluoghi.signs = [];       // Array of RoadSign.SignInfo objects
Census.prototype.sopralluoghi.poleInfo = new Sopralluoghi.PoleInfo();




// Specific methods of the cityasset class
data.sopralluoghi = {

    // Return the serialized entity string
    serialize: function(entity) {
        var data = {
            comune: entity.roadSign.comune,
            provincia: entity.roadSign.provincia,
            street: entity.roadSign.street,
            streetNumber: entity.roadSign.streetNumber,
            note:entity.roadSign.note,
            signs: entity.roadSign.signs,
            poleInfo: entity.roadSign.poleInfo
        };
        return JSON.stringify(data);
    },
    
    // Return entity from string    
    deserialize: function(row) {
        var census = new Census();
        census.id = row.id;
        census.dateAdded = row.date_added;
        census.status = row.status;
        census.entityType = row.entity_type;
        census.position.latitude = row.lat;
        census.position.longitude = row.lng;
        census.position.accuracy = row.accuracy;
        var tmp = JSON.parse(row.entity_value);

        census.sopralluoghi.comune = tmp.comune;
        census.sopralluoghi.provincia = tmp.provincia;
        census.sopralluoghi.street = tmp.street;
        census.sopralluoghi.streetNumber = tmp.streetNumber;
        census.sopralluoghi.note = tmp.note;
        census.sopralluoghi.signs = tmp.signs;
        census.sopralluoghi.poleInfo = tmp.poleInfo;
//console.log(census);
        return census;
    },
    
    shortDescription: function(entity) {
        return '';
    },
    
    // Prepare an entity to be formatted for sending on web server
    mapForService: function(entity) {
        
        var obj = {
            sp_sopralluoghi_info: {
                latitudine: entity.position.latitude,
                longitudine: entity.position.longitude,
                // Pole info
                numero_pali: entity.sopralluoghi.poleInfo.numberOfPoles,
                diametro_pali: entity.sopralluoghi.poleInfo.poleDiameter,
                altezza_pali: entity.sopralluoghi.poleInfo.poleHeight,
                numero_staffe_monofacciali: entity.sopralluoghi.poleInfo.poleNumberOfSingleSidedBrackets,
                numero_staffe_bifacciali: entity.sopralluoghi.poleInfo.poleNumberOfDoubleSidedBrackets,
                // Upwind pole info
                numero_pali_controvento: entity.sopralluoghi.poleInfo.numberOfPolesUpwind,
                diametro_pali_controvento: entity.sopralluoghi.poleInfo.poleUpwindDiameter,
                altezza_pali_controvento: entity.sopralluoghi.poleInfo.poleUpwindHeight,
                numero_staffe_monofacciali_controvento: entity.sopralluoghi.poleInfo.poleUpwindNumberOfSingleSidedBrackets,
                numero_staffe_bifacciali_controvento: entity.sopralluoghi.poleInfo.poleUpwindNumberOfDoubleSidedBrackets,
                numero_staffe_controvento: entity.sopralluoghi.poleInfo.poleUpwindNumberOfUpwindBrackets,
                old_pole:entity.sopralluoghi.poleInfo.oldPole,
                old_signs_number:entity.sopralluoghi.poleInfo.old_signs_number,
                
                comune :entity.sopralluoghi.comune,
                provincia :entity.sopralluoghi.provincia,
                strada: entity.sopralluoghi.street,
                civico: entity.sopralluoghi.streetNumber,
                note :entity.sopralluoghi.note
                
            },
            sp_soparlluoghi_cartello: [],
            pictures: {
                front: entity.pictures['front'],
                back: entity.pictures['back'],
                perspective: entity.pictures['perspective']
            }
        };
        
        // Loop on roadsigns
        for(var i in entity.sopralluoghi.signs) {
            var sign = entity.sopralluoghi.signs[i];
            var roadSignType = (sign.roadSignType.toLowerCase() == 'monofacciale') ? 'M' : 'B';
         
            
            var entry = {
                ss_segnale_id: sign.roadSignId,
                ss_pellicola_id: sign.film,
                ss_supporto_id: sign.support,
                tipologia: roadSignType,      // Monofacciale / bifacciale
                dimensioni: sign.size,
                rimozione:sign.rimozione
                //ss_censimento_id: 0
            };
            obj.sp_sopralluighi_cartello.push(entry);
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
    

    // ss_dimensione (is empty on data server!)
    getRoadSignSizes: function(params,completeCallback) {
            /*var filterArray = [];
            filterArray.push( "id_segnale = " + params.search );
            var filter = filterArray.join(' and ');
            */
            var filter=" id_segnale = " + params.search;
            data.lookupTable({key: data.DATA_SIZES, filter: filter}, function(result) {
            completeCallback(result);
        });
    },
    
    getRoadSignType: function() {
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
    
    // ss_segnaletica_tipologia
    
    getRoadSignTypes: function(completedCallback) {
        data.lookupTable({key: data.DATA_TYPES}, function(result) {
        completedCallback(result);
        });
    },
    // ss_pellicola
    getRoadSignFilms: function(completedCallback) {
        data.lookupTable({key: data.DATA_FILMS}, function(result) {
            completedCallback(result);
        });
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
        if(params.type && params.type != '0') {
            // if it is a number perform the seach in the code field,
            // in the name otherwise
            filterArray.push( 
                            "category = " + params.type
                            );
        }
        
        if(params.id ) {
            // if it is a number perform the seach in the code field,
            // in the name otherwise
            filterArray.push( 
                            "id = " + params.id
                            );
        }
        
        var filter = filterArray.join(' and ');
        data.lookupTable({key: data.DATA_ROADSIGN, filter: filter}, function(result) {
            completedCallback(result);
        });
       
       
    },
    
    getRoadSignIntervento: function() {
        return [
            {id: 0, name: 'Nuovo'},
            {id: 1, name: 'Rimozione'}
            
        ];
    }
    
    
 
    
};