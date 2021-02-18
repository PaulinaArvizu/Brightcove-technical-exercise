'use strict'

let playlistData, videoData;

function loadData(filePath, callbackSuccess) { // Read data from a file, given its path
    // Create XMLHttpRequest object
    let request = new XMLHttpRequest();

    // Make GET request to read file
    request.open("GET", filePath);

    // Response
    request.onload = () => {
        if (request.status != 200) {
            // Error
            console.log(request.response);
        } else {
            let data = JSON.parse(request.response);
            // Success
            callbackSuccess(data);
        }
    };

    // Send request
    request.send(null);
}

function getAllVideos() { // Retrieve video info
    loadData('videoData.json',
        (data) => {
            videoData = data;

            // Call function to display video info
            videoInfo();

            // Call function to retrieve playlists info
            getAllPlaylists();
        });
}

function getAllPlaylists() { // Retrieve playlists' info
    loadData('playlistData.json',
        (data) => {
            playlistData = data;

            // Call function to display playlists' info
            playlistInfo();
        });
}

function videoInfo() { // Display videos' info
    let filter = document.getElementById("tag").checked; // 'true' if checkbox is checked
    let totalDuration = 0;
    let avg = 0;

    // Sum total duration
    videoData.forEach(video => {
        if (filter) { // Filter checkbox is checked
            if (video.tags.find(tag => tag == "mexico") != undefined) {
                // Only add videos with "mexico" tag
                totalDuration += video.duration > 0 ? video.duration : 0;
            }
        } else { // Filter checkbox is not checked
            totalDuration += video.duration > 0 ? video.duration : 0;
        }
        avg += video.duration > 0 ? video.duration : 0;
    });

    // Convert data to HTML
    let tableData = `
        <p>
            <b>Total video duration (${filter ? 'only "mexico" tag' : "all videos"}):</b> ${msToTime(totalDuration)}
            <td></td>
        </p>`;

    document.getElementById('videosDuration').innerHTML = tableData;

    // Display video count
    document.getElementById('videoCount').innerHTML = `<p><b>Video count:</b> ${videoData.length} videos</p>`;

    // Display video average duration
    avg /= videoData.length;
    document.getElementById('videoAvg').innerHTML = `<p><b>Average video duration:</b> ${msToTime(avg)}</p>`;
}

function playlistInfo() { // Display playlists' info
    let playlistsArr = []; // This variable will have the name and total duration of each playlist. Easier for sorting later
    let avg = 0; // Variable for calculating the average duration

    playlistData.forEach(playlist => {
        // Initialize variable to calculate total duration of playlist
        let totalDuration = 0;

        if (playlist.video_ids != undefined) { // If playlist has videos, find videos by ID
            playlist.video_ids.forEach(
                video => {
                    let foundVideo = videoData.find(v => v.id == video) // Find with this ID

                    // If video was found, add video duration to total; if not found, add zero
                    totalDuration += foundVideo != undefined ? foundVideo.duration : 0;
                });
        }
        // Add playlist with total duration to array
        playlistsArr.push({
            "name": playlist.name,
            "duration": totalDuration
        });

        // Add duration to average
        avg += totalDuration;
    });

    // Order playlists by the sum of their videos' duration
    playlistsArr.sort((a, b) => b.duration - a.duration);

    // Convert data to HTML
    let tableData = `
    <table class="table table-hover text-center" style="width:50%"><thead>
        <th>Playlist Name</th>
        <th>Sum of Duration of the Videos</th>
    </thead>`;

    playlistsArr.forEach(playlist => tableData += `
                <tr>
                    <td>${playlist.name}</td>
                    <td>${msToTime(playlist.duration)}</td>
                </tr>`);

    tableData += "</table>";

    document.getElementById('playlistsTable').innerHTML = tableData;

    // Display playlist count
    document.getElementById('playlistCount').innerHTML = `<p><b>Playlist count:</b> ${playlistData.length} playlists</p>`;

    // Display playlists average duration
    avg /= playlistData.length;
    document.getElementById('playlistAvg').innerHTML = `<p><b>Average playlist duration:</b> ${msToTime(avg)}</p>`;
}

function msToTime(duration) {
    let minutes = Math.floor((duration / 60000)) % 60;
    let hours = Math.floor((duration / 3600000));

    if (hours == 0 && minutes == 0) return "0";

    let time = '';
    time += hours == 1 ?
        hours + ' hour ' :
        hours > 1 ? hours + ' hours ' : '';
    time += minutes == 1 ?
        minutes + ' minute ' :
        minutes > 1 ? minutes + ' minutes ' : '';

    return time;
}