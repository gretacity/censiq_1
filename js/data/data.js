var data = {
    

    _getEntityHandler: function(entityType) {
        var handler = null;
        switch(entityType) {
            
            case CensusTypes.cityAsset:
                handler = data.cityAsset;
                break;
            case CensusTypes.roadSign:
                handler = data.roadSign;
                break;
            case CensusTypes.guardrail:
                //console.log("Guardrail-data",data);
                handler = data.guardrail;
                //console.log("Guardrail-Handler",handler);
                break;
            default:
                throw 'Entity type not allowed';
                return;
        }
        return handler;
    },
    
    serialize: function(entity) {
        return data._getEntityHandler(entity.entityType).serialize(entity);
    },
    
    deserialize: function(serialized, entityType) {
        return data._getEntityHandler(entityType).deserialize(serialized);
    },
    
    shortDescription: function(entity) {
        return data._getEntityHandler(entity.entityType).shortDescription(entity);
    },
    
    
    
    DATA_FILMS: 1,      // Pellicole    ss_pellicola (id, nome, durata)
    DATA_ROADSIGN: 2,   // Segnali      ss_segnale (id, codice, figura, nome, descrizione, ss_pellicola_id,
                        //                          ss_supporto_id, dimensione_segnale, categoria, icona,
                        //                          icona_mappa, ss_segnaletica_tipologia_id)
    DATA_SHAPES: 3,     // Forme        ss_forma (id, nome, ss_dimensione_id)
    DATA_SUPPORTS: 4,   // Supporti     ss_supporto (id, nome)
    DATA_SIZES: 5,      // Dimensioni   ss_dimensione

    
   // DATA_GUARDRAIL:6,       //gr_censimento
    //DATA_GUARDRAIL_INFO:7, // gr_censimento_guardrail (numero_nastri,mumero_pali, gruppi_terminali etc etc)
    
    
    REC_STATUS_ADDED: 0,
    REC_STATUS_SYNCHRONIZING: 1,
    REC_STATUS_SYNCHRONIZED: 2,
    REC_STATUS_SYNCH_ERROR: 3,
    
    _db: null,
    
    
    open: function() {
        // data._db = window.openDatabaseSync
        try {
            data._db = window.openDatabase(config.DB_FILENAME,
                                           // In the initialize function check the current version of db
                                           // with the one defined in config.DB_SCHEMA
                                           '',
                                           config.DB_NAME,
                                           config.DB_SIZE);
        } catch(ex) {
            helper.alert(ex.code + ' ' + ex.message, null, 'Errore Accesso Database');
        }
    },
    
    
    emptyTables: function() {
        if(data._db == null) this.open();
        data._db.transaction(function(tx) {
            console.log('Dropping tables');
            tx.executeSql("drop table pictures");
            tx.executeSql("drop table census");
            tx.executeSql("drop table rs_films");
            tx.executeSql("drop table rs_roadsign");
            tx.executeSql("drop table rs_shapes");
            tx.executeSql("drop table rs_supports");
            tx.executeSql("drop table rs_sizes");
            tx.executeSql("drop table gr_censimento_guardrail");
            tx.executeSql("drop table gr_censimento_info");
            console.log('Table dropped');
        });
    },
    
    initialize: function(successCallback, errorCallback) {
        console.log("initialize table");
        // Ensure that the tables exist
        if(data._db == null) this.open();
        
        // Database versioning check
        var dbVer = data._db.version;
        var updateRequired = false;
        if(dbVer < config.DB_SCHEMA)  {
            // Upgranding database to version defined in config.DB_SCHEMA
            updateRequired = true;
            data._db.changeVersion(data._db.version, config.DB_SCHEMA, function() {
                data._db.transaction(function(tx) {
                    // Transactions
                    tx.executeSql("create table if not exists rs_films (id integer not null primary key, name text)");
                    tx.executeSql("create table if not exists rs_roadsign (id integer not null primary key, " +
                                                                          "code text, figure text, name text, " +
                                                                          "category text, icon text)");
                    tx.executeSql("create table if not exists rs_shapes (id integer not null primary key, name text)");
                    tx.executeSql("create table if not exists rs_supports (id integer not null primary key, name text)");
                    tx.executeSql("create table if not exists rs_sizes (id integer not null primary key, name text, size text)");
                    tx.executeSql("create table if not exists census (id integer not null primary key autoincrement, " +
                                                                        "date_added text, qr_code text, " +
                                                                        "lat real, lng real, accuracy integer, " +
                                                                        "fixed_on_map integer, " +
                                                                        "status integer, entity_type integer, " + 
                                                                        "entity_value blob, sync_error)");
                    tx.executeSql("create table if not exists pictures (id integer not null primary key autoincrement, " + 
                                                                        "census_id integer, picture_key text, " +
                                                                        "data blob)");
                    //tx.executeSql("create table if not exists gr_censimento_guardrail (id integer not null primary key autoincrement, " );
                    /*tx.executeSql("create table if not exists gr_censimento_guardrail (id integer not null primary key autoincrement, " +
                                                                                        "parent text, fine int, sequenza int, nome_inizio text"+
                                                                                        "numero_nastri_smontaggio int, numero_pali_smontaggio int,"+
                                                                                        "gruppi_terminali_smontaggio text, tipologia_barriera_smontaggio text,"+
                                                                                        "numero_nastri_montaggio int, numero_pali_montaggio int,"+
                                                                                        "gruppi_terminali_montaggio text, tipologia_barriera_montaggio text, id_inizio integer autoincrement)"); */
                    // Other support tables used by roadsign census
                    tx.executeSql("create table if not exists rs_manufacturers (name text primary key, auth_no text)");
                    tx.executeSql("create table if not exists rs_installers (name text primary key)");
                    tx.executeSql("create table if not exists rs_owners (name text primary key)");
                 }, 
                 function(error) {
                    if(errorCallback != null) errorCallback(error);
                 },
                 function() {
                    if(successCallback != null) successCallback(updateRequired ? config.DB_SCHEMA : null);
                 });
            });
        } else if(dbVer == config.DB_SCHEMA) {
            // Database is updated to the latest version
            if(successCallback != null) successCallback();
        }
    },
    
    loadPrefetched: function(completedCallback) {
        var prefetched = [
            {'key': data.DATA_FILMS, 'name': 'roadsign.films.txt'}, 
            {'key': data.DATA_SHAPES, 'name': 'roadsign.shapes.txt'},
            {'key': data.DATA_SIZES, 'name': 'roadsign.sizes.txt'},
            {'key': data.DATA_SUPPORTS, 'name': 'roadsign.supports.txt'},
            {'key': data.DATA_ROADSIGN, 'name': 'roadsign.roadsigns.txt'},
            //{'key': data.DATA_GUARDRAIL, 'name': 'guardrail.censimento.txt'},
            //{'key': data.DATA_GUARDRAIL_INFO, 'name': 'guardrail.info.txt'}
        ];
        for(var i in prefetched) {
            var filename = 'data/' + prefetched[i].name;
            $.ajax({
                url: filename,
                async: false,
                dataType: 'json'
            }).done(function(result) {
                //console.log('success', result);
                data.updateData(prefetched[i].key, result);
                if(prefetched[i].key == data.DATA_ROADSIGN) {
                    // For roadsigns also save images
                    data.updateRoadSignImages(result, app.fs);
                    // By convention here the task is completed :)
                    if(completedCallback) completedCallback();
                }
            }).fail(function(jqXHR, textStatus, errorThrown) {
                //console.log(jqXHR);
                console.log('error', textStatus);
            });
        }
    },
    
    updateData: function(key, downloadedData) {
        
        if(data._db == null) this.open();
        
        data._db.transaction(function(tx) {
            switch(key) {
                case data.DATA_FILMS:
                    // Truncate table
                    tx.executeSql("delete from rs_films");
                    var q = "insert into rs_films (id, name) values (?, ?)";
                    for(var i in downloadedData) {
                        var row = downloadedData[i];
                        tx.executeSql(q, [row.id, row.nome]);
                    };
                    break;
                    
                case data.DATA_ROADSIGN:
                    // Truncate table
                    tx.executeSql("delete from rs_roadsign");
                    var q = "insert into rs_roadsign (id, code, figure, name, category, icon) values (?, ?, ?, ?, ?, ?)";
                    var tots = downloadedData.length;
                    var success = 0, fail = 0;
                    var nativeBaseUrlSaved = false;
                    for(var i in downloadedData) {
                        var row = downloadedData[i];
                        tx.executeSql(q, [row.id, row.codice, row.figura, row.nome, row.categoria, row.icona],
                                     function(tx, result) {
                                         success++;
                                         if((success + fail) == tots) {
                                            console.log((new Date()).toTimeString() + " finished " + success + " " + fail);
                                         }
                                     }, function(tx, error) {
                                         console.error(error);
                                         fail++;
                                         if((success + fail) == tots) {
                                            console.log((new Date()).toTimeString() + " finished " + success + " " + fail);
                                         }
                                     });
                    }
                    break;
                    
                case data.DATA_SHAPES:
                    // Truncate table
                    tx.executeSql("delete from rs_shapes");
                    var q = "insert into rs_shapes (id, name) values (?, ?)";
                    for(var i in downloadedData) {
                        var row = downloadedData[i];
                        tx.executeSql(q, [row.id, row.nome]);
                    }
                    break;
                    
                case data.DATA_SIZES:
                    // Truncate table
                    tx.executeSql("delete from rs_sizes");
                    var q = "insert into rs_sizes (id, name, size) values (?, ?, ?)";
                    for(var i in downloadedData) {
                        var row = downloadedData[i];
                        tx.executeSql(q, [row.id, row.nome, (row.formato || '')]);
                    }
                    break;

                case data.DATA_SUPPORTS:
                    // Truncate table
                    tx.executeSql("delete from rs_supports");
                    var q = "insert into rs_supports (id, name) values (?, ?)";
                    for(var i in downloadedData) {
                        var row = downloadedData[i];
                        tx.executeSql(q, [row.id, row.nome]);
                    }
                    break;
               /* case data.DATA_GUARDRAIL:
                    // Truncate table
                    tx.executeSql("delete from gr_censimento_guardrail");
                    var q = "insert into gr_censimento_guardrail"+
                            "(id,parent,fine,sequenza, nome_inizio,numero_nastri_smontaggio, numero_pali_smontaggio, gruppi_terminali_smontaggio, tipologia_barriera_smontaggio,"+
                             "numero_nastri_montaggio, numero_pali_montaggio, gruppi_terminali_montaggio , tipologia_barriera_montaggio) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    
                    for(var i in downloadedData) {
                        var row = downloadedData[i];
                        tx.executeSql(q, [row.id, row.parent, row.fine, row.sequenza, row.nome_inizio, row.numero_nastri_smontaggio,row.numero_pali_smontaggio,row.gruppi_terminali_smontaggio,row.tipologia_barriera_smontaggio,
                                          row.numero_nastri_montaggio,row.numero_pali_montaggio,row.gruppi_terminali_montaggio,row.tipologia_barriera_montaggio]);           
                    }
                    break;
                                    */
                           }
                       },
                       function(error) {
                           console.error(error);
                       }, function() {
                           console.log((new Date()).toTimeString() + ' finished update ' + key);
                       });
                   },    
    
    // TODO Move in /data/census.roadsign.js
    updateRoadSignImages: function(downloadedData, fs) {
        if(typeof(fs) == 'undefined') return;
        
        var i = -1;
        var length = downloadedData.length;
        var nativeBaseUrlSaved = false;
        
        var getItemFromQueue = function() {
            if(++i < length) {
                // Process first item in the queue
                var item = downloadedData[i];
                updateRoadSignImageItem(item.id, item.svg, getItemFromQueue);
                //console.log('Retrieved row with ID ' + item.id);
            }
            // else completed
        };
        
        var updateRoadSignImageItem = function(id, content, completedCallback) {
            //console.log('Processing row with ID ' + id);
            if((content || '') == '') {
                //console.log('No content for row with ID ' + id);
                completedCallback();
                return;
            }
            
            var imageFilename = config.ROADSIGN_BASE_PATH_ICONS + id + '.svg';
            
            fs.root.getFile(
                imageFilename, 
                {create: true, exclusive: false},
                function(fe) {
                    // got fileEntry
                    fe.createWriter(
                        function(fw) {
                            //gotFileWriter
                            fw.write(content);
                            console.log('Completed ID ' + id + ': ' + fe.nativeURL);
                            
                            // Store the base path for future usage
                            if(!nativeBaseUrlSaved) {
                                nativeBaseUrlSaved = true;
                                var nativeBaseUrl = fe.nativeURL;
                                // Remove filename from url
                                var pos = nativeBaseUrl.indexOf(config.ROADSIGN_BASE_PATH_ICONS);
                                nativeBaseUrl = nativeBaseUrl.substr(0, pos);
                                config.setNativeBaseURL(nativeBaseUrl);
                            }
                            
                            completedCallback();
                        }, function(e) {
                            //fail
                            console.error('Error ID ' + id, e);
                            completedCallback();
                        }
                    );
                },
                function(e) {
                    console.error(e);
                    completedCallback();
                }
            );
        };
        
        // Start processing of queue
        getItemFromQueue();
    },    
    
    testUpdate: function() {
        
        if(data._db == null) this.open();
        
        data._db.transaction(function(tx) {
            
            var q = "select 'ss_forma' as table_name, count(*) as tot_rec from rs_shapes " +
                    "union " +
                    "select 'ss_pellicola' as table_name, count(*) as tot_rec from rs_films " +
                    "union " +
                    "select 'ss_segnale' as table_name, count(*) as tot_rec from rs_roadsign " +
                    "union " +
                    "select 'ss_supporto' as table_name, count(*) as tot_rec from rs_supports " +
                    "union " +
                    "select 'ss_dimensione' as table_name, count(*) as tot_rec from rs_sizes";
            tx.executeSql(q, [], function(tx, result) {
                // success 
                var itemCount = result.rows.length;
                for(var i = 0; i < itemCount; i++) {
                    var row = result.rows.item(i);
                    console.log(row.table_name + " has " + row.tot_rec + " records");
                }
            
            }, function(tx, error) {
                console.log(error);
            });
        });
    },
    
    // TODO Move in /data/census.roadsign.js
    // TODO Rename to roadSignLookupTable
    lookupTable: function(params, successCallback) {
        
        var key = params.key;
        
        var tableName = null;
        switch(key) {
            case data.DATA_FILMS:
                tableName = "rs_films";
                break;
            case data.DATA_ROADSIGN:
                tableName = "rs_roadsign";
                break;
            case data.DATA_SHAPES:
                tableName = "rs_shapes";
                break;
            case data.DATA_SIZES:
                tableName = "rs_sizes";
                break;
            case data.DATA_SUPPORTS:
                tableName = "rs_supports";
                break;
           /* case data.DATA_GUARDRAIL:
                tableName = "gr_censimento_guardrail";
                break;
           /* case data.DATA_GUARDRAIL_INFO:
                tableName = "gr_censimento_info";
                break;*/
            default:
                throw 'Argument exception';
        }
        
        var query = "select * from " + tableName;
        
        // Set filters if any
        if(params.filter) {
            if(typeof(params.filter) == 'string') {
                query += " where " + params.filter;
            }
            // TODO Other data typ for filters
        }
        
        if(data._db == null) data.open();
        
        data._db.transaction(function(tx) {
            
            tx.executeSql(query, [], function(tx, results) {
                successCallback(results.rows);
            }, null);
        });
        
    },
    
    
    
    /*
    // TODO Move in /data/census.roadsign.js
    addRoadSignManufacturer: function(name) {
        var q = "insert or ignore into roadsign_manufacturers (name) values (?) ";
        var params = [name];
        // TODO
    },
    addRoadSignInstaller: function(name) {
        var q = "insert or ignore into roadsign_installers (name) values (?) ";
        var params = [name];
        // TODO
    },
     */
    
    
    
    
    count: function(status, successCallback, errorCallback) {
        
        if(data._db == null) data.open();
        
        data._db.transaction(function(tx) {
            var query = "select count(*) as totRecs from census";
            
            var params = [];
            if(status != null) {
                if(Array.isArray(status)) {
                    query += ' where status in (' + status.join(', ') + ')';
                } else {
                    query += " where status = ?";
                    params.push(status);
                }
            }
            
            tx.executeSql(query, params, function(tx, results) {
                if(successCallback != null) successCallback(results.rows.item(0).totRecs);
            }, null);
        });
    },
    
    
    fetch: function(parameters, successCallback, errorCallback) {
        console.log ("Fetch");
        //console.log('fetch parameters',parameters);
        if(data._db == null) data.open();
        
        data._db.transaction(function(tx) {
            
            var query = "select * from census";
            
            var params = [];
            var filter = [];
            if(parameters != null) {
                if(parameters.id != null) {
                    params.push(parameters.id);
                    filter.push('id = ?');
                }
                if(parameters.status != null) {
                    if(Array.isArray(parameters.status)) {
                        filter.push('status in (' + parameters.status.join(', ') + ')');
                    } else {
                        params.push(parameters.status);
                        filter.push('status = ?');
                    }
                }
            }
            if(filter.length > 0) {
                query += " where " + filter.join(" and ");
            }
//console.log('fetch parameters query', query);
//console.log('fetch parameters filter', filter);
//console.log('fetch parameters params', params);
            
            tx.executeSql(query, params, function(tx, results) {

                if(successCallback != null) successCallback(results);
            }, function(error) {
                if(errorCallback != null) errorCallback(error);
            });
        });
    },
    
    
    fetchPictures: function(censusId, successCallback) {
        
        if(data._db == null) data.open();
        
        data._db.transaction(function(tx) {
            var query = "select * from pictures";
            var params = [];
            if(censusId > 0) {
                query += " where census_id = ?";
                params = [censusId];
            }
            tx.executeSql(query, params, function(tx, results) {
                if(successCallback != null) successCallback(results);
            }, function(error) {
                if(errorCallback != null) errorCallback(error);
            });
        });
    },
    
    
    save: function(entity) {
        console.log("DATA -> SAVE");
        entity.status = this.REC_STATUS_ADDED;
        var serialized = data.serialize(entity); // old code -> entity.serialize()
        
        if(data._db == null) data.open();
        
        data._db.transaction(function(tx) {
            
            var query = "insert into census (date_added, qr_code, lat, lng, accuracy, fixed_on_map, status, entity_type, entity_value) " +
                        "values (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            var params = [
                //(new Date()).toYMDHMS(),
                entity.dateAdded.toYMDHMS(),
                entity.qrCode,
                entity.position.latitude,
                entity.position.longitude,
                //entity.position.altitude,
                entity.position.accuracy,
                entity.fixedOnMap,
                entity.status, 
                entity.entityType,
                serialized
            ];
            //console.log("PARAMS-DATA_ALTITUDINE", entity.position.altitude);
            //console.log("PARAMS-DATA",params);
            //console.log("QUERY DATApre",query);
            
            tx.executeSql(query, params, function(tx2, resultSet) {
                //console.log("QUERY DATApost",query);
                console.log("Saved Census with id " + resultSet.insertId);
                var censusId = resultSet.insertId;
                // Update entity
                entity.id = censusId;
                for(var k in entity.pictures) {
                    console.log("saving picture with key " + k + " for census with id " + censusId);
                    var query2 = "insert into pictures (census_id, picture_key, data) values (?, ?, ?)";
                    var params2 = [
                        censusId,
                        k,
                        entity.pictures[k]
                    ];
                    
                    console.log(params2);
                    
                    tx.executeSql(query2, params2, function(tx3, resultSet3) {
                        // TODO ???
                        console.log("saved picture with id " + resultSet3.insertId);
                    }, function(tx, error3) {
                        console.log(error3);
                    });
                }
            });
        });        
    },
    
    delete: function(id, successCallback) {
        
        if(data._db == null) data.open();
        
        data._db.transaction(function(tx) {
            /*var query = "delete c, p from census c " +
                            "left join pictures p on p.census_id = c.id " +
                            "where c.id = ?";*/
            var params = [id];
            tx.executeSql("delete from pictures where census_id = ?", params);
            tx.executeSql("delete from census where id = ?", params, function(tx, resultSet) {
                if(successCallback) successCallback(resultSet);
            });
        });
       
    },
    
    close: function(entity) {
        console.log("DATA -> CLOSE");
        var stato;
        if(data._db == null) data.open();
        data._db.transaction(function(tx) {
            //var newStatus = 1;
            
             var query = "SELECT entity_value FROM census where id=?";
             var params = [entity];
            //console.log("PARAMS-DATA",params);
            //console.log("QUERY DATApre",query);
            
            tx.executeSql(query, params, function(tx2, resultSet) {
                //console.log("QUERY DATApost",query);
                //console.log(" Census id ", resultSet.rows);
                //console.log(" entity_value ", resultSet.rows.item(0));
                
                var entity_value = resultSet.rows.item(0); //console.log('NOME COMPLETO',entity_value);
                $.each(entity_value, function(key, entity_value) {
                var verifyB = entity_value.indexOf('inizio":'); 
                var subSTRB = entity_value.substring(verifyB+9,entity_value.length-14);
                //console.log('VALORE INIZIO',subSTRB);
                if(subSTRB==1){
                    helper.alert("Non puoi chiudere un punto iniziale");
                    return;
                }
                var verify = entity_value.indexOf('chiuso":'); //console.log('sub',verify);
                var subSTR = entity_value.substring(verify+8,entity_value.length-2);
                //console.log("Valore chiuso",subSTR);
                if(subSTR==0)stato="confermare";
                else stato="annullare";
                helper.confirm('Vuoi '+stato+' la chiusura del percorso?', function(buttonIndex) {
                     if(buttonIndex == 1) {
                if(subSTR==0){
                    var replace= entity_value.replace('chiuso":0','chiuso":1');
                    $('input#item'+entity+' + label').addClass('close');
                    stato="apertura";
                }else{
                    var replace= entity_value.replace('chiuso":1','chiuso":0');
                    $('input#item'+entity+' + label').removeClass('close');
                    stato="chiusura";
                }
                 
                console.log(replace);
                var query2 = "update census set entity_value = ? where id = ?";
                var params2 = [
                    replace,
                    entity
                ];
                    
                    //console.log(params2);
                    tx.executeSql(query2, params2, function(tx3,stato, resultSet3) {
                        // TODO ???
                       // console.log("id " + resultSet3.insertId);
                    }, function(tx, error3) {
                        console.log(error3);
                    });
                       }
        }, 'Conferma', ['Si', 'No']);
                 
            });
                // Update entity
                    //console.log("saving picture with key " + k + " for census with id " + censusId);

            });
         
        });
    },
    
    updateStatus: function(entityId, newStatus, errorMessage) {
        if(data._db == null) data.open();
        data._db.transaction(function(tx) {
            tx.executeSql("update from census set status = ?, sync_error = ? where id = ?", 
                          [newStatus, errorMessage, entityId]);
        });
    }
    
    
};