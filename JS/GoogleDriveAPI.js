//API to sign in
function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    return gapi.auth2.getAuthInstance()
        .signIn({scope: "https://www.googleapis.com/auth/calendar"})
        .then(function() { console.log("Sign-in successful"); },
            function(err) { console.error("Error signing in", err); });
  }
  
  //API to sign out
  function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }
  
  /* -------------------------- */
  
  gapi.load("client:auth2", function() {
    gapi.auth2.init({client_id: "86585982831-9f7am38m3pqpqvm5vg0tf0l3jemstksp.apps.googleusercontent.com"}).then(function(){
      gapi.client.load("https://content.googleapis.com/discovery/v1/apis/calendar/v3/rest")
      .then(function() { console.log("GAPI client loaded for API");},
          function(err) { console.error("Error loading GAPI client for API", err); });
    });
  });