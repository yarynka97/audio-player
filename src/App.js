function App() {
    this.songsList;
    this.songId = 0;
    this.playing = false;
    this.loadMessage = document.getElementById('current-song');

    this.initialise = function () {
        loadSongsList();
        document.getElementById('prev').addEventListener('click', playPrev);
        document.getElementById('play').addEventListener('click', playCurr);
        document.getElementById('stop').addEventListener('click', stopSong);
        document.getElementById('next').addEventListener('click', playNext);
    }

    const formTable = () => {
        let songs = document.createDocumentFragment();
        let table = document.getElementById('list');
        this.songsList.forEach(function (song) {
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

    const loadSongsList = () => {
        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'songs.json', true);
        xhr.onload = function () {
            self.songsList = JSON.parse(xhr.responseText).audio;
            formTable();
        };
        xhr.send();
    }

    const chooseSong = (id) => {
        if (this.playing) {
            stopSong();
        }
        this.player = new Player(this.songsList[id].src);
        this.player.playSong(this.songsList[id]);
        this.playing = true;
        toggleButtons();
        this.songId = id;
    }

    const playPrev = () => {
        let id = this.songId === 0 ?
            4 :
            Number.parseInt(this.songId) - 1;
        chooseSong(id);
    }

    const stopSong = () => {
        this.player.stopSong();
        this.playing = false;
        toggleButtons();
    }

    const playCurr = () => {
        chooseSong(this.songId);
    }

    const playNext = () => {
        let id = (this.songId === 4) ?
            0 :
            Number.parseInt(this.songId) + 1;
        console.log(id);
        chooseSong(id);

    }

    const toggleButtons = () => {
        const play = document.getElementById('play');
        const pause = document.getElementById('stop');
        if (this.playing) {
            play.hidden = true;
            pause.hidden = false;
        } else {
            play.hidden = false;
            pause.hidden = true;
        }
    }
}

let app = new App();