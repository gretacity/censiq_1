var app = {
    
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        /*document.addEventListener('online', function() {
            alert('online');
        }, false);
        document.addEventListener('offline', function() {
            alert('offline');
        }, false);*/
        
        // Force onDeviceReady if it's a browser
        if(config.EMULATE_ON_BROWSER) this.onDeviceReady();
        
        $('#deleteButton').on('click', app.deleteItems);
        $('#syncButton').on('click', app.startSync2);
    },
    
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        
        // For Android devices
        //document.addEventListener("backbutton", function(e) {e.preventDefault();}, false);
        
        $logPanel = $('#log');
        $logPanel.html('Recupero elementi da sincronizzare...');
        //console.log("DATA FETCH",this);
        data.fetch({status: [data.REC_STATUS_ADDED, data.REC_STATUS_SYNCH_ERROR]}, function(result) {
            //console.log("RESULT SYNC FETCH",result);
            var itemCount = result.rows.length;
            var html = '';
            for(var i = 0; i < itemCount; i++) {
                console.log('itemcout',itemCount);
                var row = result.rows.item(i);
                //var obj = data.cityAsset.deserialize(row);
                //console.log("OGGETTO Synch ",row); //row ha latitudine e longitudine
                //console.log("TIPO=",row.entity_type);
                var obj = data.deserialize(row, row.entity_type);
                var itemId = 'item' + obj.id;
                var name = data.shortDescription(obj);
                var qrCode = obj.qrCode;
                var dateAdded = Date.parseFromYMDHMS(row.date_added).toDMYHMS();
                html += '<li style="padding:0;' + (false ? 'background-color:#f00;' : '') + '">' + 
                        '<input type="checkbox" id="' + itemId + '" data-id="' + obj.id + '" checked onchange="app.countItemToSync()" />' + 
                        '<label for="' + itemId +'">' + CensusTypeNames[obj.entityType];
                if(name != '') {
                    html += '<br />' + name;
                }
                html += '<br /> codice ' + qrCode +
                        '<br /> aggiunto il ' + dateAdded + '</label>' +
                        '</li>';
            }
            $('#itemList').html(html);
            $('#itemList').listview("refresh");
            $('#synchronizePage').trigger('create');
            
            app.countItemToSync();
            app.checkConnection();
        });
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
    
    checkConnection: function() {
        if(helper.isOnline()) {
            $('#syncButton').removeClass('ui-disabled');
            return true;
        }
        $('#syncButton').addClass('ui-disabled');
        helper.alert('Per procedere con la sincronizzazione è necessario disporre di una connessione WI-FI attiva', null, 'Connessione non disponibile');
        return false;
    },    
    
    countItemToSync: function() {
        var connectionAvailable = helper.isOnline();
        var allItems = $('#itemList li').length;
        var itemToSync = $('#itemList li input[type="checkbox"]:checked').length;
        $logPanel = $('#log');
        $logPanel.html((allItems == 0) ? 'Non ci sono elementi da sincronizzare'
                                       : itemToSync + ' ' + ' di ' + allItems + ' elementi selezionati');
        if((itemToSync > 0) && connectionAvailable) {
            $('#syncButton').removeClass('ui-disabled');
            $('#deleteButton').show();
        } else {
            $('#syncButton').addClass('ui-disabled');
            $('#deleteButton').hide();
        }
    },
    
    lockUI: function() {
        $('#homeButton').addClass('ui-disabled');
        //$('#syncButton').addClass('ui-disabled');
        $('#syncButton').html('INTERROMPI');
        $('#deleteButton').addClass('ui-disabled');
    },
    
    unlockUI: function() {
        $('#homeButton').removeClass('ui-disabled');
        $('#syncButton').html('SINCRONIZZA').removeClass('ui-disabled');
        //$('#syncButton').html('').removeClass('ui-disabled');
        $('#deleteButton').removeClass('ui-disabled');
    },
    
    deleteItems: function() {
        helper.confirm('Eliminare in modo definitivo gli elementi selezionati?', function(buttonIndex) {
            if(buttonIndex == 1) {
                app.lockUI();
                $('#itemList li input[type="checkbox"]:checked').each(function() {
                    var itemId = $(this).attr("data-id");
                    var liElem = $(this).parents('li');
                    data.delete(itemId, function() {
                        liElem.remove();
                    });
                });
                app.unlockUI();
                setTimeout(app.countItemToSync, 100);
            }
        }, 'Conferma eliminazione', ['Si', 'No']);
    },
    
    updateSyncProgress: function() {
        var done = app.synchronization.totSynchronized();
        var totItems = app.synchronization.totItems();
        // Update percentage info panel
        var perc = (totItems == 0) ? 0 : Math.round(done * 100 / totItems);
        $('#progressPercentage').html(perc + '% completo');
        $('#progressIndicator').css('width', perc+'%');
        $('#log').html('Sincronizzato ' + done + " di " + totItems + "...");
    },
    
    _synchronizing: false,
    
    synchronization: {
        queue: [],
        currentItem: 0,
        synchronizedSuccess: 0,
        synchronizedErrors: 0,
        totSynchronized: function() {
            return app.synchronization.synchronizedSuccess +
                    app.synchronization.synchronizedErrors;
        },
        totItems: function() {
            return app.synchronization.queue.length + 
                    app.synchronization.synchronizedSuccess +
                    app.synchronization.synchronizedErrors;
        }
    },
    
    startSync2: function() {
        
        // Stop synchronization if already started
        if(app._synchronizing) {
            $('#syncButton').html("INTERRUZIONE...").addClass('ui-disabled');
            app._synchronizing = false;
            return;
        }
        
        // Check network connection before starting synchronizing
        if(!app.checkConnection()) {
            return;
        }
        
        // Redirect to the login page if the session is missing or is not valid
        if((auth.getSessionId() == '') || (!auth.isSessionValid())) {
            document.location.href="login.html?returnurl=" + encodeURIComponent(helper.getDocumentLocation());
            return;
        }
        
        // Lock all buttons (home, delete, sync)
        app.lockUI();
        app._synchronizing = true;
        
        $('#itemList').addClass('ui-disabled');
        $('#progressContainer').show();
        
        // Prepare queue of items to be synchronized
        app.synchronization.queue = [];
        app.synchronization.currentItem = 0;
        app.synchronization.synchronizedSuccess = 0;
        app.synchronization.synchronizedErrors = 0;
        
        // Number of items to be synchronized
        $('#itemList li input[type="checkbox"]:checked').each(function() {
            var itemId = $(this).attr("data-id");
            app.synchronization.queue.push(itemId);
        });
        
        $('#progressContainer').show();
        app.updateSyncProgress();
        // Start synchronization
        app.syncNextItem();
    },
    
    syncNextItem: function() {
        
        if((app.synchronization.queue.length == 0) || (!app._synchronizing)) {
            $('#progressContainer').hide();
            app.syncFinished();
            return;
        }
        
        // Synchronize first item available in the queue
        var itemId = app.synchronization.queue[0];
        
        console.log('syncronizing item ' + itemId);
        
// Simulate Synchronization: duration 5 secs
/*setTimeout(function() {
    app.syncSuccess(itemId);
    //alert('Synchronizing item with id ' + itemId);
}, 5000);*/
        
        services.uploadEntity(itemId, app.syncSuccess, app.syncError);
    },
    
    syncSuccess: function(itemId, responseText) {

        console.log('synchronized item ' + itemId);
        
        // Remove item from local storage
        data.delete(itemId, null);
        
        // Update UI
        var elem = $('#itemList li div input[type="checkbox"][data-id="' + itemId + '"]').parents('li');
        elem.remove();
        
        // Remove first item from queue...
        app.synchronization.queue.shift();
        
        // Update synchronization information
        app.synchronization.synchronizedSuccess++;
        app.updateSyncProgress();
        
        // ...and continue with synchronization
        app.syncNextItem();
    },
    
    syncError: function(itemId, loginRequired, errorMessage, errorCode) {
        
        console.log('synchronized failed item ' + itemId + ', login required ' + loginRequired + ', ' + errorMessage);
        
        if(loginRequired) {
            //return;
            document.location.href="login.html?returnurl=" + encodeURIComponent(helper.getDocumentLocation());
            return;
        }
        
// DEBUGGING PURPOSES
helper.alert('Item with ID ' + itemId + "\ncode " + errorCode + ", " + errorMessage, null, "Error while synchronizing item"); 
        
        // Remove first item from queue...
        app.synchronization.queue.shift();
        
        // Update synchronization information
        app.synchronization.synchronizedErrors++;
        app.updateSyncProgress();
        
        // ...and continue with synchronization
        app.syncNextItem();
    },
    
    syncFinished: function() {
        // Reached end of queue
        $('#progressContainer').hide();
        app.unlockUI();
        app.countItemToSync();
        $('#itemList').removeClass('ui-disabled');
        $('#progressContainer').hide();
var message = app.synchronization.synchronizedSuccess + " elementi sincronizzati";
        if(app.synchronization.synchronizedErrors > 0) {
            message += " e " + app.synchronization.synchronizedErrors + " errori";
        }
        helper.alert(message, null, "Sincronizzazione terminata");
    }    
};
