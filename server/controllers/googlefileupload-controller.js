var connectDb = require("./db-connect.js");
var axios = require("axios");
var fs = require('fs');
var mime = require('mime-types')
const {google} = require('googleapis');
const oauth2Client = new google.auth.OAuth2(
  "601970742952-u25d9jicjkdp4qg7ifkedu15nl9gbmrs.apps.googleusercontent.com",
  "3KujiwmrQJxgHir1ia69I76l",
  "http://localhost:8080/auth/google/callback"
);
const SCOPES = ['https://www.googleapis.com/auth/drive',
'https://www.googleapis.com/auth/drive.file',
'https://www.googleapis.com/auth/drive.appdata'];


exports.googleuploadfile = function(user_token, file_path) {
    var refDb = connectDb.getConnection();
    var filedata = fs.readFileSync(file_path, (err, data) => {
        if (err) throw err;
        console.log(data);
    });
    console.log(filedata);
    var contentType = mime.lookup(file_path);
    if (!contentType) {
        contentType = "application/octet-stream";
    }
    refDb.query('SELECT * FROM users WHERE token = ?', [user_token], function(error, results, fields) {
        if (error) {
            console.log('\x1b[31m', "[MySQL] Error ocurred (SELECT):", error);
        }
        else {
            console.log(results[0]);
            oauth2Client.setCredentials({access_token: results[0].google_access_token});
            const drive = google.drive({version: 'v3', auth: oauth2Client});
            var fileMetadata = {
                'name': file_path
            };
            var media = {
                mimeType: contentType,
                body: fs.createReadStream(file_path)
            };
            drive.files.create({
                resource: fileMetadata,
                media: media,
                fields: 'id'
            }, function (err, file) {
                if (err) {
                    // Handle error
                    console.error(err);
                } else {
                    console.log('File Id: ', file.id);
                }
            });
            // axios({
            //     method: 'post',
            //     url: 'https://www.googleapis.com/upload/drive/v3/files?uploadType=media',
            //     data: filedata,
            //     headers: {'Authorization' : 'Bearer '+results[0].google_token+'','Content-Type': contentType}
            // });
        }
    });
}
