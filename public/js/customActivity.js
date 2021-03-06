define([
    'postmonger'
], function (
    Postmonger 
) {
    'use strict';

    var connection = new Postmonger.Session();
    var authTokens = {};
    var payload = {};
    $(window).ready(onRender);
$(window).ready(save);
    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);
	connection.on('onLoad', save);
   connection.on('clickedNext', save);
   
    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');

        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');
 
    }

    function initialize(data) {
        console.log(data);
        if (data) {
            payload = data;
        }
        
        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
        );

        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

        console.log(inArguments);

        $.each(inArguments, function (index, inArgument) {
            $.each(inArgument, function (key, val) {
                
              
            });
        });

        connection.trigger('updateButton', {
            button: 'next',
            text: 'done',
            visible: true
        });
    }

    function onGetTokens(tokens) {
        console.log(tokens);
        authTokens = tokens;
	    save();
    }

    function onGetEndpoints(endpoints) {
        console.log(endpoints);
    }

    function save() {
        debugger;
        payload['arguments'].execute.inArguments = [{
            "tokens": authTokens,
            "phoneNumber": "{{Contact.Attribute.SmsJourney.PhoneNumber}}",
             "emailAddress": "{{Contact.Attribute.SmsJourney.EmailAddress}}"
           
        }];
	    
	    console.log(payload["arguments"]["execute"]["inArguments"][0]["phoneNumber"]);
	  var phone=payload["arguments"]["execute"]["inArguments"][0]["phoneNumber"];
        var phonemsgdata={
				"strMobileNumber":"8452881510",
				"strTxtMsg":"journey builder sms"
				};
	  			debugger;
				var tokendata;
				$.ajax({

				url:"https://login.salesforce.com/services/oauth2/token?client_id=3MVG9sG9Z3Q1RlbeZ3x_5JrzSFxlATWV7amV.1PtetznXcMooCQBQHBf6YgcAQDJtSy317Zpo4kevq_65cbGI&client_secret=5906482776105122251&username=pavani.jidagam@opensms.com&password=Appshark7&grant_type=password ",
				method:"post",
				dataType:"json",
				cache:false,
				async:false,
				success:function(result){
				tokendata= result.access_token;
				},
				error:function(){
				console.log("error");
				} 

				});
				//Value of the text box 
				$.ajax({
				url: "https://appsharkopenmsg-developer-edition.na24.force.com/services/apexrest/OpenSMSPro/MarketingCloudSendSMS",
				method: "post",
				async: false,
				contentType: "application/json",	
				data: JSON.stringify(phonemsgdata),
				beforeSend : function( xhr ) {
				xhr.setRequestHeader('Authorization', 'Bearer ' + tokendata);
				},
				success:function(result,status){
				connection.trigger('ready');	 
				},
				error:function(res){
				console.log("Error");

				} 

				});
        payload['metaData'].isConfigured = true;
       console.log(payload);
	connection.trigger('updateActivity', payload);
	    connection.on('requestedSchema', function (data) {    //CONNECTION ON
    // save schema
    console.log('*** Schema ***', JSON.stringify(data['schema']));
    let schema = JSON.stringify(data['schema']);
});
    }


});
