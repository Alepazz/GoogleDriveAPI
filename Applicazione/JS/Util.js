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
 
var Upload = function (file) {
    this.file = file;
};

Upload.prototype.progressHandling = function (event) {
    var percent = 0;
    var position = event.loaded || event.position;
    var total = event.total;
    var progress_bar_id = "#progress-wrp";
    if (event.lengthComputable) {
        percent = Math.ceil(position / total * 100);
    }
    // update progressbars classes so it fits your code
    $(progress_bar_id + " .progress-bar").css("width", +percent + "%");
    $(progress_bar_id + " .status").text(percent + "%");
};

Upload.prototype.doInsert = function () {

    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";

    var that = this; //that.file is the file object

    var reader = new FileReader();
    reader.readAsBinaryString(this.file);

    //The onload handler is called when the file is successfully read
    reader.onload = function(e) {
        var contentType = that.file.type || 'application/octet-stream';

        var metadata = {
            'title': that.file.name,
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

    $.ajax({
        type: "POST",
        url: "https://www.googleapis.com/upload/drive/v2/files?uploadType=multipart",
        headers: {
            'Authorization': 'Bearer' + ' ' + localStorage.getItem("accessToken"),
            'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
        },
        dataType: contentType,
        data: multipartRequestBody,
        xhr: function () {
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {
                myXhr.upload.addEventListener('progress', that.progressHandling, false);
            }
            return myXhr;
        },
        success: function (data) {
            alert("File uploaded successfully\n" + data);
            console.log(data);
        },
        error: function (error) {
            console.log(error);
        }        
        });
    }
}; //Upload

/* -------------------------- */
$(document).ready(function(){
    $("#upload").on("click", function (e) {
        //var file = $("#files")[0].files[0];
        //var upload = new Upload(file);

        //console.log("file property", file);
        var i = 0;
        while(typeof($("#files")[0].files[i]) != "undefined"){
            console.log("file " + i, $("#files")[0].files[i]);
            var file = $("#files")[0].files[i];
            var upload = new Upload(file);
            i += 1;
            upload.doInsert();
        }
        
        //upload.doInsert();
    });

});

/* -------------------------- */