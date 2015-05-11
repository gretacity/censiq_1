
// Extends Census class
Census.prototype.cityAsset = function() {};
Census.prototype.cityAsset.assetType = '';
Census.prototype.cityAsset.assetName = '';
Census.prototype.cityAsset.description = '';
Census.prototype.cityAsset.notes = '';



// Specific methods of the cityasset class
data.cityAsset = {    
    
    // Return the serialized entity string
    serialize: function(entity) {
        var data = {
            assetType: entity.cityAsset.assetType,
            assetName: entity.cityAsset.assetName,
            description: entity.cityAsset.description,
            notes: entity.cityAsset.notes
        };
        //console.log(entity);
        //console.log(".." + JSON.stringify(data));
        return JSON.stringify(data);
    },
    
    // Return entity from a record
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
        census.cityAsset.assetType = tmp.assetType;
        census.cityAsset.assetName = tmp.assetName;
        census.cityAsset.description = tmp.description;
        census.cityAsset.notes = tmp.notes;
        return census;
    },

    shortDescription: function(entity) {
        return entity.cityAsset.assetName;
    },
    
    // Prepare an entity to be formatted for sending on web server
    mapForService: function(entity) {
        var obj = {
            bn_censimento: {
                bn_bene_tipologia_id: entity.cityAsset.assetType,
                latitudine: entity.position.latitude,
                longitudine: entity.position.longitude,
                data_inserimento: entity.dateAdded,
                sys_user_id: 0,
                r_qr_code_id: entity.qrCode
            },
            bn_censimento_annotazioni: {
                annotazione: entity.cityAsset.notes
            },
            bn_censimento_info: {
                nome: entity.cityAsset.assetName,
                descrizione: entity.cityAsset.description
            },
            pictures: {
                front: entity.pictures['front'],
                back: entity.pictures['back'],
                perspective: entity.pictures['perspective']
            }
        };
        return obj;
    },
    
    
    createTypeTree: function(types) {
        var tree = [];
        // Get root types (lev 1)
        for(var i in types) {
            if(types[i].group == 0) {
                types[i].children = [];
                tree[types[i].id] = types[i];
            }
        }
        
        // Populate roots (lev 2)
        for(var i in types) {
            if(types[i].group in tree) {
                tree[types[i].group].children.push(types[i]);
            }
        }
        return tree;
    },
    
    
    
    // bn_bene_tipologia
    getTypes: function() {
        return [
            {id: 1,  group: 0, name: "Beni demaniali"}, 
            {id: 2,  group: 0, name: "Beni patrimoniali indisponibili"}, 
            {id: 3,  group: 0, name: "Beni patrimoniali disponibili"},
            {id: 4,  group: 2, name: "Edifici Comunali Adibiti ad Uffici"},
            {id: 5,  group: 2, name: "Edifici Comunali Adibiti a Scuole"},
            {id: 6,  group: 2, name: "Edifici e Impianti adibiti ad Attività Sportive"},
            {id: 7,  group: 2, name: "Edifici e Impianti adibiti ad Attività Culturali"},
            {id: 8,  group: 2, name: "Edifici e Impianti adibiti ad Attività Teatrali"},
            {id: 9,  group: 2, name: "Edifici e Impianti adibiti ad Attività Sociali"},
            {id: 10, group: 2, name: "Immobili, Impianti e Mezzi occ. funz. Servizi Comunali"},
            {id: 11, group: 2, name: "Parchi e Giardini"},
            {id: 12, group: 2, name: "Macelli Pubblici"},
            {id: 13, group: 2, name: "Mercati"},
            {id: 14, group: 2, name: "Bagni Pubblici"},
            {id: 15, group: 2, name: "Lavatoi Pubblici"},
            {id: 16, group: 2, name: "Impianti di Illuminazione Pubblica"},
            {id: 17, group: 2, name: "Impianti di Depurazione"},
            {id: 18, group: 2, name: "Alloggi Sovvenzionati E.R.P."},
            {id: 19, group: 2, name: "Aree Espropriate"},
            {id: 20, group: 2, name: "Aree Espropriate attuazione P.E.E.P."},
            {id: 21, group: 1, name: "Strade"},
            {id: 22, group: 1, name: "Piazze"},
            {id: 23, group: 1, name: "Acquedotti"},
            {id: 24, group: 1, name: "Immobili di Interesse Storico"},
            {id: 25, group: 1, name: "Immobili di Interesse Archeologico"},
            {id: 26, group: 1, name: "Immobili di Interesse Artistico"},
            {id: 27, group: 1, name: "Raccolte di Musei,Pinacoteche,Archivi,Biblioteche"},
            {id: 28, group: 1, name: "Cimiteri"},
            {id: 29, group: 1, name: "Pachine Pubbliche"},
            {id: 30, group: 1, name: "Pensilina"},
            //{id: 31, group: 1, name: "Bacheca Pubblica"}
        ];
    }
};
