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
//console.log('bindEvents function');
        document.addEventListener('deviceready', this.onDeviceReady, false);
        // Force onDeviceReady if it's a browser
        if(config.EMULATE_ON_BROWSER) this.onDeviceReady();
        // For Android devices
        document.addEventListener("backbutton", function(e) {
            if($.mobile.activePage.is('#indexPage')){
                e.preventDefault();
                navigator.app.exitApp();
            } else {
                navigator.app.backHistory();
            }
        }, false);
        // IndexPage bindings
        $('#updateNowButton').on('click', app.updateNow);
        $('#useWifiOnly').on('change', app.useWifiOnly);

    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        
        $('#settingsPage').on('pagecreate', app.initFS);
        $logPanel = $('#log');
        $logPanel.html('Inizializzazione...');
        
        app.updateServerDataLastUpdate();
        $('#useWifiOnly').attr('checked', config.getUseWifiOnly()).checkboxradio().checkboxradio('refresh');
        
        app.initializeData();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        /*var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        
        console.log('Received Event: ' + id);*/
    },
    fs: null,
    initFS: function(completedCallback) {
        
//console.log('Entering initFS');
        
        // Chrome doesn't support this.
        // It has its own API: window.requestFileSystem -> window.webkitRequestFileSystem
        if(config.EMULATE_ON_BROWSER) return;
        
        // Already initialized
        if(app.fs != null) return;
        
        window.requestFileSystem(
            LocalFileSystem.PERSISTENT, 
            0, // size in bytes 
            function(fs) {
//console.log('FS: got it');
                // Keep the reference for future use
                app.fs = fs;
                // Create base directory for roadsign icons if doesn't exist
                var tmp = config.ROADSIGN_BASE_PATH_ICONS;
                if(tmp[tmp.length - 1] == '/') {
                    tmp = tmp.substr(0, tmp.length - 1);
                }
                var dirs = tmp.split('/');
                if(dirs.length > 1) {
                    // At this moment a subdirectory structure is not supported.
                    // Possibly they should be created one at a time.
                    helper.alert('Subdirectories currently are not allowed', function() {
                        return;
                    }, 'Debug');
                } else {
                    fs.root.getDirectory(
                        config.ROADSIGN_BASE_PATH_ICONS, 
                        {create: true, exclusive: false}, 
                        function(dir) {
                            // Success
console.log('Roadsign icons directory created successfully', dir);
                            if(completedCallback) completedCallback();
                        },
                        function(e) {
                            // Fail
console.log('Failed to create roadsign icons directory', e);
                        }
                    );
                }
            },
            function(e) {
                console.error('FS: fail', e);
            }
        );
    },
    initializeData: function() {
    
        // The return parameter is used to see if we need to load prefetched data
        data.initialize(function(updatedToSchemaVersion) {
            
            $logPanel.html("&nbsp;");
            
            //console.log('updated to schema version is ' + updatedToSchemaVersion);
            
            if(updatedToSchemaVersion == '1.0') {
                $logPanel.html("Aggiornamento archivi...");
                app.initFS(function() {
                    data.loadPrefetched(function() {
                        // completed
                        $logPanel.html("&nbsp;");
                        $('#censusButton').removeClass('ui-disabled');
                        $('#censusSideButton').removeClass('ui-disabled');
                    });
                });
            } else {
                $('#censusButton').removeClass('ui-disabled');
                $('#censusSideButton').removeClass('ui-disabled');
            }
            
            /*
            // Enable UI
            if(config.getServerDataLastUpdate() == null) {
                //if(!config.getFirstUpdateNotification()) {
                //    config.setFirstUpdateNotification(true);
                    helper.alert('Prima di procedere è necessario aggiornare i dati', function() {
                        $.mobile.changePage('#settingsPage');
                    }, 'Aggiornamento richiesto');
                //}
            } else {
                $('#censusButton').removeClass('ui-disabled');
                $('#censusSideButton').removeClass('ui-disabled');
            }*/
        }, 
        function(error) {
            $logPanel.html("Errore durante l'inizializzazione");
        });
        
        data.count(data.REC_STATE_ADDED, function(result) {
            if(result > 0) {
                $syncButton = $('#synchronizeButton');
                $syncButton.removeClass('ui-disabled');
				if (result == 1){
					$('p', $syncButton).html('C\'è ' + result + ' elemento da sincronizzare');
				} else{
				$('p', $syncButton).html('Ci sono ' + result + ' elementi da sincronizzare');
                $('#synchronizeSideButton').removeClass('ui-disabled');}
            }
        });
    },
    useWifiOnly: function() {
        config.setUseWifiOnly($('#useWifiOnly').is(':checked'));
    },
    updateServerDataLastUpdate: function() {
        var serverDataLastUpdate = config.getServerDataLastUpdate();
        $('#lastUpdateInfo').html(serverDataLastUpdate ? 
                                  'Ultimo aggiornamento: ' + serverDataLastUpdate.toDMYHMS() : 
                                  'Aggiornamento mai eseguito.');
    },
    queue: null,
    updateNow: function() {
        if(!helper.isOnline()) {
            helper.alert("Per l'aggiornamento è necessaria una connessione attiva", null, "Aggiorna");
            return;
        }
        var $page = $('#settingsPage');
        $('#homeButton', $page).addClass('ui-disabled');
        $('#updateNowButton', $page).addClass('ui-disabled').html('Aggiornamento...');
        // Prepare queue
        app.queue = [
            {key: data.DATA_SHAPES,     // Forme
             state: 0},
            {key: data.DATA_FILMS,      // Pellicole
             state: 0},
            {key: data.DATA_ROADSIGN,   // Segnali
             state: 0},
            {key: data.DATA_SUPPORTS,   // Supporti
             state: 0},
            {key: data.DATA_SIZES,      // Dimensioni
             state: 0}
        ];
        $.mobile.loading('show');
        setTimeout(app.updateNextItem, 100);
    },
    updateNextItem: function() {
        // Get element to sync from queue
        for(var i in app.queue) {
            if(app.queue[i].state == 0) {
                services.downloadDataFromServer(app.queue[i].key, app.downloadedSuccess, app.downloadedError);
// Simulate a request to the server
/*setTimeout(function() {
    app.updateSuccess(app.queue[i].key);
}, 1000);*/
                return;
            }
        }
        // Finished
        $.mobile.loading('hide');
        config.setServerDataLastUpdate(new Date());
        app.updateServerDataLastUpdate();
        var $page = $('#settingsPage');
        $('#homeButton', $page).removeClass('ui-disabled');
        $('#updateNowButton', $page).removeClass('ui-disabled').html('Aggiorna adesso');
        // In the indexPage
        $('#censusButton').removeClass('ui-disabled');
        $('#censusSideButton').removeClass('ui-disabled');
        helper.alert('Aggiornamento completato', function() {
//console.log((new Date()).toTimeString() + " ok");
            data.testUpdate();
        }, 'Aggiornamento dati');
    },
    downloadedSuccess: function(key, downloadedData) {
        // Update local table with received data
        data.updateData(key, downloadedData);
        if(key == data.DATA_ROADSIGN) {
            if(app.fs == null) {
                console.log('WARNING: the underlying system doesn\'t support file system feature');
            } else {
                // Update images
                data.updateRoadSignImages(downloadedData, app.fs);
            }
        }
        // Update state of the item in the queue
        for(var i in app.queue) {
            if(app.queue[i].key == key) {
                app.queue[i].state = 1;
                break;
            }
        }
        // Then proceed with the update of the next item
        app.updateNextItem();
    },
    downloadedError: function(key, loginRequired, textStatus, statusCode) {
        $.mobile.loading('hide');
        if(loginRequired) {
            //document.location.href="login.html?returnurl=" + encodeURIComponent(helper.getDocumentLocation());
            document.location.href="login.html?returnurl=index.html";
            return;
        }
        // Stop update
        helper.alert('Si sono verificati errori durante l\'aggiornamento.\nRiprova più tardi.', null, 'Aggiornamento dati');
        console.error(textStatus);
        var $page = $('#settingsPage');
        $('#homeButton', $page).removeClass('ui-disabled');
        $('#updateNowButton', $page).removeClass('ui-disabled').html('Aggiorna adesso');
    }
};
