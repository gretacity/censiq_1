var CensusTypes = {
    undefinedType: 0,
    cityAsset: 1,
    roadSign: 2,
    guardrail: 3
};

var CensusTypeNames = [];
CensusTypeNames[CensusTypes.undefinedType]  = "";
CensusTypeNames[CensusTypes.cityAsset]      = "Bene comunale";
CensusTypeNames[CensusTypes.roadSign]       = "Segnaletica stradale";
CensusTypeNames[CensusTypes.guardrail]      = "Guard Rail";


function Census(entityType) {
    this.id = 0;
    this.dateAdded = null;
    this.status = null;
    
    // Validate entityType parameter
    if((entityType != CensusTypes.undefinedType) && 
       (entityType != CensusTypes.cityAsset) &&
       (entityType != CensusTypes.roadSign) &&
       (entityType != CensusTypes.guardrail)) {
        // Throw an exception?
        
        
        entityType = CensusTypes.undefinedType;
    }
    this.entityType = (entityType == null ? CensusTypes.undefinedType : entityType);
    
    this.qrCode = '';
    
    this.position = {
        latitude: 0, 
        longitude: 0, 
        accuracy: 0, 
        toString: function() {
            return this.latitude + " " + this.longitude;
        }
    };
    
    this.fixedOnMap = false;
    
    this.pictures = [];
}

/*
Census.prototype.addPicture(key, base64EncodedString) {
    //
}*/

Census.prototype.serialize = function() {
    // Serialize this entity according to its type
    var serializedEntity = null;
    switch(this.entityType) {
        case CensusTypes.cityAsset:
            serializedEntity = data.cityAsset.serialize(this);
            break;
        case CensusTypes.roadSign:
            // TODO
        case CensusTypes.guardrail:
            // TODO
    }
    return serializedEntity;
}

Census.prototype.deserialize = function(entity) {
    // Deserizalize a string according to the entity type
    
}

