/* -------------------------- */

//API to sign in
function onSignIn(googleUser) {
    console.log("Sign-in successful"); 
  }
  
  //API to sign out
  function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }

  /* -------------------------- */
  //Alternativa
  gapi.load("client:auth2", function() {
    gapi.auth2.init({client_id: "86585982831-q7fl3eoq1qi7jng8bj2os0a1461laqko.apps.googleusercontent.com"}).then(function(){
      gapi.client.load("https://content.googleapis.com/discovery/v1/apis/drive/v2/rest")
      .then(function() { console.log("GAPI client loaded for API");},
          function(err) { console.error("Error loading GAPI client for API", err); });
    });
  });
  
  function authenticate(){
    return gapi.auth2.getAuthInstance()
        .signIn({scope: "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.apps.readonly https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata https://www.googleapis.com/auth/drive.scripts"})
        .then(function(succ) { 
            console.log("Sign-in successful\naccess_token:", succ.Zi.access_token);
            localStorage.setItem("accessToken", succ.Zi.access_token);
        },
            function(err) { console.error("Error signing in", err); });
  };
  
  /* -------------------------- */

/**
 * Insert new file.
 *
 * @param {File} fileData File object to read data from.
 * @param {Function} callback Function to call when the request is complete.
 */
function insertFile(fileData, callback) {
    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";
  
    var reader = new FileReader();
    reader.readAsBinaryString(fileData);
    reader.onload = function(e) {
      var contentType = fileData.type || 'application/octet-stream';
      var metadata = {
        'title': fileData.name,
        'mimeType': contentType
      };
  
      var base64Data = btoa(reader.result);
      var multipartRequestBody =
          delimiter +
          'Content-Type: application/json\r\n\r\n' +
          JSON.stringify(metadata) +
          delimiter +
          'Content-Type: ' + contentType + '\r\n' +
          'Content-Transfer-Encoding: base64\r\n' +
          '\r\n' +
          base64Data +
          close_delim;
  
      var request = gapi.client.request({
          'path': '/upload/drive/v2/files',
          'method': 'POST',
          'params': {'uploadType': 'multipart'},
          'headers': {
            'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
          },
          'body': multipartRequestBody});
      if (!callback) {
        callback = function(file) {
          console.log(file)
        };
      }
      request.execute(callback);
    }
  }

  function callbackFunction(){
      console.log("Richiesta completata");
  }

/* -------------------------- */
$(document).ready(function(){
    $("#upload").on("click", function (e) {
        var file = $("#files")[0].files[0];

        insertFile(file, callbackFunction());
    });

});

/* -------------------------- */