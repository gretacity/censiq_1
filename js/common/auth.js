var auth = {
    
    lastLoginDate: null,
    sessionId: null,
    
    setSessionId: function(sessId) {
        if(sessId == '')
            window.localStorage.removeItem(config.SESSION_ID_KEY);
        else
            window.localStorage.setItem(config.SESSION_ID_KEY, sessId);
    },
    getSessionId: function() {
        return (window.localStorage.getItem(config.SESSION_ID_KEY) || '');
    },

    isSessionValid: function() {
        var sessionId = auth.getSessionId();
        if(sessionId == '') return false;
        var checkSessionValidityUrl = '';
        /*$.ajax({
            type:'get',
            async: false,
            url: checkSessionValidityUrl,
            data: 'session_id=' + sessionId,
            dataType: 'text',
            crossDomain: true
        }).done(function(data, textStatus, jqXHR) {
            return ???;
        }).fail(function() {
            // TODO
        });
        */
        return true;
    },
    
    ////////////////////////////////////////////////////////////
    // params {username: "", password : ""}
    login: function(params, successCallback, failCallback) {
        
        if((params == null) || (params.username == null) || (params.password == null)) {
            // Do nothing... or notify to the failCallback event handler?
            return;
        }
        
        var loginUrl = config.URL_BASE + config.URL_LOGIN;
        
        var data = 'username=' + params.username + '&password=' + params.password +
                    '&api=' + config.API_V + '&app=' + config.APP_NAME;
            
        if(typeof(device) != 'undefined') data += '&uuid=' + device.uuid;
        $.ajax({
			type : "GET",
            cache: false,
            async: false,
            url : loginUrl,
            data: data,
            dataType: "json",
            crossDomain: true,
		}).done(function(data, textStatus, jqXHR) {
			if(data != '') {
                auth.setSessionId(data.session.id);
                auth.lastLoginTime = new Date();
				if(successCallback) successCallback(data);
            } else {
				if(failCallback) failCallback("Login errato");
            }
		}).fail(function(jqXHR, textStatus, errorThrown) {
            auth.setSessionId('');
            if(failCallback) failCallback(textStatus);
        });
    },
    
    logout: function() {
        auth.setSessionId('');
    }
}