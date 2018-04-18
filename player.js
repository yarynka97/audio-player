var songsList;
var context = new window.AudioContext || window.webkitAudioContext;
var buffer, source, destination;
var songId = 0;
var playing = false;
var loadMessage = document.getElementById('loading');


function initialise() {
    loadSongsList();
    document.getElementById('prev').addEventListener('click', playPrev);
    document.getElementById('play').addEventListener('click', playCurr);
    document.getElementById('stop').addEventListener('click', stopSong);
    document.getElementById('next').addEventListener('click', playNext);
}

function formTable() {
    let songs = document.createDocumentFragment();
    let table = document.getElementById('list');
    songsList.forEach(function (song) {
        let tr = document.createElement('tr');
        let text = document.createTextNode(song.name);
        let songId = document.createAttribute('songId');
        songId.value = song.id;
        tr.appendChild(text);
        tr.setAttributeNode(songId);
        tr.addEventListener('click', function () {
            chooseSong(songId.value);
        });
        songs.appendChild(tr);
    });
    table.appendChild(songs);
}

function loadSongsList() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'songs.json', true);
    xhr.onload = function () {
        songsList = JSON.parse(xhr.responseText).audio;
        formTable();
    };
    xhr.send();
}

function playSong(song) {
    loadMessage.innerHTML = 'Loading';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', song.src, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function (e) {
        context.decodeAudioData(this.response,
            function (decodedArrayBuffer) {
                buffer = decodedArrayBuffer;
                loadMessage.innerHTML = song.name;
                start();
            }, function (e) {
                loadMessage.innerHTML='Error decoding file';
            });
    };
    xhr.send();

    function start() {
        source = context.createBufferSource();
        source.buffer = buffer;
        destination = context.destination;
        source.connect(destination);
        source.start(0);
        playing = true;
        toggleButtons();
    }
}

function chooseSong(id) {
    if (playing) {
        stopSong();
    }
    playSong(songsList[id]);
    songId = id;
}

function playPrev() {
    let id = songId === 0 ?
        4 :
        songId-1;
    chooseSong(id);
}

function stopSong() {
    source.stop(0);
    playing = false;
    toggleButtons();
}

function playCurr() {
    chooseSong(songId);
}

function playNext() {
    let id = (songId === 4)?
        0 :
        songId + 1;
    chooseSong(id);
}

function toggleButtons() {
    const play = document.getElementById('play');
    const pause = document.getElementById('stop');
    if (playing) {
        play.hidden = true;
        pause.hidden = false;
    } else {
        play.hidden = false;
        pause.hidden = true;
    }       
}





