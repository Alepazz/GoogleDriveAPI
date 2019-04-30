$(document).ready(function(){
    
    const urlParams = new URLSearchParams(window.location.search);
    console.log("Window location", window.location.search); //Window location: ?code=4/OQEvgjz6dGx6M3bV3nkVCl6wOsVlYjWGApz70P97eojsolaBwm4WnwhIxVtHxuvTvyhRwF4MFzxfOVbdAHbhB2w&scope=https://www.googleapis.com/auth/drive
    const code = urlParams.get('code');
    console.log("code", code);
    const redirect_uri = "http://localhost:8000/GoogleDriveAPI/GoogleDriveAPI/upload.html" // replace with your redirect_uri;
    const client_secret = "KWkF0C8b8s-E9dUdQRzH0DxD"; // replace with your client secret
    const scope = "https://www.googleapis.com/auth/drive";
    //var access_token= "";
    var client_id = "86585982831-phu06i802oadavv41ak0tgh8vd00jbpu.apps.googleusercontent.com"// replace it with your client id;

    /*
    * Sito per verificare i parametri da passare al campo "data": https://developers.google.com/identity/protocols/OpenIDConnect
    */
    $.ajax({
        type: 'POST',
        method: 'POST', //da testare
        url: "https://www.googleapis.com/oauth2/v4/token", //token endpoint..the target of the request
        data: {
        code:code, //The authorization code that is returned from the initial request.
        redirect_uri:redirect_uri, //The URI that you specify in the API Console
        client_secret:client_secret,
        client_id:client_id,
        scope:scope,
        grant_type:"authorization_code"},
        dataType: "json", //risposta
        success: function(resultData) { /*resultData is a Json Array with the following fields (search for line
            *"A successful response to this request contains the following fields in a JSON array" in this link: https://developers.google.com/identity/protocols/OpenIDConnect)
            */
            console.log(resultData);
            localStorage.setItem("accessToken",resultData.access_token); //A token that can be sent to a Google API.
            //localStorage.setItem("refreshToken",resultData.refresh_token); //This field is only present if access_type=offline is included in the authentication request. --> A refresh token provides your app continuous access to Google APIs while the user is not logged into your application. To request a refresh token, add access_type=offline to the authentication request.
            //console.log("token type", resultData.token_type);
            //localStorage.setItem("expires_in",resultData.expires_in); //The remaining lifetime of the access token.
            window.history.pushState({}, document.title, "upload.html"); //change the site bar name. Before the change it was: http://localhost:8000/GoogleDriveAPI/GoogleDriveAPI/upload.html?code=4/OQGsDWg4-sWTGfTdytrNlYOHvwEuy97kfUNvpaAUcTX0BrHjQANmH4eUs4ITwNB3T-XDaR7f_mBUwT2TlA3A6KQ&scope=https://www.googleapis.com/auth/drive         
        }
    });

    var Upload = function (file) {
        this.file = file;
    };

    //Upload.prototype.newProperty è utile per far ereditare newProperty ai figli (oggetti costruiti a partire dal costruttore Upload)
    Upload.prototype.getName = function() {
        return this.file.name;
    };
    
    Upload.prototype.doUpload = function () {
        var that = this;
        var formData = new FormData(); //key-value map
    
        // add assoc key values, this will be posts values
        formData.append("file", this.file, "prova.txt"); //insert in "file" all the metadata about the file
        //console.log(formData.get("file").name); print the file name
        //formData.append("upload_file", true);
        console.log(this.file.name);
        
        $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", "Bearer" + " " + localStorage.getItem("accessToken"));
                //request.setRequestHeader("Content-Type", "multipart/related; boundary=foo_bar_baz");
                
            },
            url: "https://www.googleapis.com/upload/drive/v2/files",
            data: formData,
            async: true,
            //data: formData,
            cache: false,
            contentType: false,
            processData: false,
            timeout: 60000,
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) {
                    myXhr.upload.addEventListener('progress', that.progressHandling, false);
                }
                return myXhr;
            },
            success: function (data) {
                console.log(data);
            },
            error: function (error) {
                console.log(error);
            }        
        });
    };

  /* function insertFile(fileData, callback) {
        const boundary = '-------314159265358979323846';
        const delimiter = "\r\n--" + boundary + "\r\n";
        const close_delim = "\r\n--" + boundary + "--";
        
        var reader = new FileReader();
        reader.readAsBinaryString(fileData);
        reader.onload = function(e) {
            var contentType = fileData.type || 'application/octet-stream';
            var metadata = {
            'title': fileData.fileName,
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
    }*/
    
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

    $("#upload").on("click", function (e) {
        var file = $("#files")[0].files[0];
        var upload = new Upload(file);

        //insertFile(file);
    
        // maby check size or type here with upload.getSize() and upload.getType()
    
        // execute upload
        upload.doUpload();
    });



    
});