$(document).ready(function(){
     
    // client id of the project

    var clientId = "86585982831-phu06i802oadavv41ak0tgh8vd00jbpu.apps.googleusercontent.com";

    // redirect_uri of the project

    var redirect_uri = "http://localhost:8000/GoogleDriveAPI/GoogleDriveAPI/upload.html"; //same specified in Google Developer Console

    // scope of the project

    var scope = "https://www.googleapis.com/auth/drive"; //for Google Drive APIs

    // the url to which the user is redirected to

    var url = "";


    // this is event click listener for the button

    $("#login").click(function(){ //id login on the button

       // this is the method which will be invoked it takes four parameters

       signIn(clientId,redirect_uri,scope,url);

    });

    /*
    * How signin with Google works: https://developers.google.com/identity/sign-in/web/server-side-flow
    * How authentication with Google works: https://developers.google.com/identity/protocols/OpenIDConnect#sendauthrequest
    * You can check for this line ("Here is an example of a complete OpenID Connect authentication URI") to see how the url is composed
    */
    function signIn(clientId,redirect_uri,scope,url){
     
       // the actual url to which the user is redirected to 
       // the parameters of the request can be read here: https://developers.google.com/identity/protocols/OpenIDConnect#authenticationuriparameters

       url = "https://accounts.google.com/o/oauth2/v2/auth?redirect_uri="+redirect_uri
       +"&prompt=consent&response_type=code&client_id="+clientId+"&scope="+scope
       +"&access_type=offline";

       // this line makes the user redirected to the url
       //The Window.location read-only property returns a Location object with information about the current location of the document.
       window.location = url;




    }



});