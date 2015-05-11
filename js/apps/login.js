var app = {
    
    returnUrl: null,
    
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
        // Force onDeviceReady if it's a browser
        if(config.EMULATE_ON_BROWSER) this.onDeviceReady();
        $('#loginButton').on('click', app.login);
    },
    
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        $('#username').val(config.LOGIN_DEFAULT_USERNAME);
        $('#password').val(config.LOGIN_DEFAULT_PASSWORD);
        var returnUrl = helper.getParamValue('returnurl');
        if(returnUrl) app.returnUrl = decodeURIComponent(returnUrl);
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
    
    login: function() {
        var username = $('#username').val();
        if(username == '') {
            $('#username').focus();
            helper.alert('Inserisci il nome utente', null, 'Login');
            return;
        }
        var password = $('#password').val();
        if(password == '') {
            $('#password').focus();
            helper.alert('Inserisci la password', null, 'Login');
            return;
        }
        $('#loginButton').addClass('ui-disabled');
        auth.login({username: username, password: password}, function(data) {
            $('#loginButton').removeClass('ui-disabled');
            //document.location = ((app.returnUrl || '') != '') ? app.returnUrl : 'index.html';
            if((app.returnUrl || '') != '') {
                document.location = app.returnUrl;
            } else {
                $.mobile.back();
            }
        }, function(error) {
            console.log(error);
            $('#loginButton').removeClass('ui-disabled');
            helper.alert('Login non valido', null, 'Login');
        });
    }
};
