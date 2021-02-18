const express = require('express');
const fs = require('fs'); // read/write on files
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest; // for HTTP requests
const port = 3000; // running on this port
const app = express(); //creates app
const path = require('path');

app.use(express.json()); // load global middleware for JSON parsing

// endpoints
app.get('/info', (req, res) =>
    res.sendFile(path.join(__dirname + '/info.html'))
);
app.get('/info.js', (req, res) =>
    res.sendFile(path.join(__dirname + '/info.js'))
);

app.get('/videoData.json', (req, res) =>
    res.sendFile(path.join(__dirname + '/data/videoData.json'))
);
app.get('/playlistData.json', (req, res) =>
    res.sendFile(path.join(__dirname + '/data/playlistData.json'))
);

// Run app
app.listen(port, () => {
    console.log('Running on port ' + port);
});


let accessToken = ""; // Here goes your access token
// writeFile(); // Uncomment this line to re-write in files

function writeFile() {
    // Get all videos
    GETRequest("https://cms.api.brightcove.com/v1/accounts/6044537239001/videos",
        accessToken,
        (data) => {
            // Write data in videoData.json file
            fs.writeFile('./videoData.json', data, (err) => {
                if (err) {
                    console.log("Error writing in videoData.json");
                } else {
                    console.log("Data written in videoData.json");
                }
            });
        });

    // Get all videos
    GETRequest("https://cms.api.brightcove.com/v1/accounts/6044537239001/playlists",
        accessToken,
        (data) => {
            // Write data in playlistData.json file
            fs.writeFile('./playlistData.json', data, (err) => {
                if (err) {
                    console.log("Error writing in playlistData.json");
                } else {
                    console.log("Data written to playlistData.json");
                }
            });
        });
}

function GETRequest(url, accessToken, callbackSuccess) {
    // Create XMLHttpRequest object
    let request = new XMLHttpRequest();

    // Open GET request
    request.open('GET', url);

    // Add request headers
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    request.setRequestHeader('Authorization', 'Bearer ' + accessToken);

    // Send request
    request.send();

    // Server response
    request.onload = () => {
        if (request.status != 200) {
            // Error
            console.log("Error in GET request");
        } else {
            // Success
            let data = request.responseText;
            callbackSuccess(data);
        }
    };
}