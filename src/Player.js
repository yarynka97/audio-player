function Player(url) {
    this.context = new window.AudioContext || window.webkitAudioContext;
    this.url = url;
    this.buffer;
    this.source;
    this.destination;
    var self = this;

    this.playSong = function () {
        let tittle = document.getElementById('process');
        tittle.innerHTML = "Loading...";
        var xhr = new XMLHttpRequest();
        xhr.open('GET', self.url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function (e) {
            self.context.decodeAudioData(this.response,
                function (decodedArrayBuffer) {
                    self.buffer = decodedArrayBuffer;
                    start();
                    tittle.innerHTML = "";
                }, function (e) {
                    tittle.innerHTML = 'Error decoding file';
                });
        };
        xhr.send();

        function start() {
            self.source = self.context.createBufferSource();
            self.source.buffer = self.buffer;
            self.destination = self.context.destination;
            self.source.connect(self.destination);
            self.source.start(0);
        }
    }

    this.stopSong = function () {
        this.source.stop(0);
    }
}











