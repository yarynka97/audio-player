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
        document.getElementById('current-song').innerHTML = this.songsList[this.songId].name;
        let songs = document.createDocumentFragment();
        let list = document.getElementById('list');
        this.songsList.forEach(function (song) {
            let li = document.createElement('li');
            let text = document.createTextNode(song.name);
            let songId = document.createAttribute('songId');
            songId.value = song.id;
            li.appendChild(text);
            li.setAttributeNode(songId); li.classList.add('unchosen');
            li.addEventListener('click', function () {
                chooseSong(songId.value);
            });
            songs.appendChild(li);
        });
        list.appendChild(songs);
        setChosenSong(0);
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
        setChosenSong(id);
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
        chooseSong(id);
    }

    const toggleButtons = () => {
        const play = document.getElementById('play');
        const stop = document.getElementById('stop');
        if (this.playing) {
            stop.style.display = "inline-block";
            play.style.display = "none";
        } else {
            play.style.display = "inline-block";
            stop.style.display = "none";
        }
    }

    const setChosenSong = (nextSongId) => {
        const self = this;
        document.getElementById('current-song').innerHTML = this.songsList[nextSongId].name;
        const songsList = document.getElementsByTagName('li');
        Array.prototype.map.call(songsList, function (el) {
            let id = el.getAttributeNode('songid').value;
            if (id == self.songId) {
                el.classList.remove('chosen');
                el.classList.add('unchosen');
            }
            if (id == nextSongId) {
                el.classList.add('chosen');
                el.classList.remove('unchosen');
            }
        });
    };
}

let app = new App();