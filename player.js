(function (window, document) {
    const video = document.getElementById('video');
    const play = document.getElementById('play');
    const controls = document.getElementById('controls');

    const progressHolder = document.getElementById("progress");
    const playProgressBar = document.getElementById("play_progress");

    let videoPlayer = {
        initControls: function () {
            videoPlayer.showHideControls();
        },
        init: function () {
            var that = this;
            video.removeAttribute('controls');
            video.addEventListener('loadedmetadata', this.initControls, false)
            this.handleButtonPresses();
            this.videoScrubbing();

            // this.bindTouching();
        },
        showHideControls: function () {
            video.addEventListener('mousemove', () => {
                controls.style.opacity = 1;
            });
            controls.addEventListener('mouseover', () => {
                controls.style.opacity = 1;
            });
            video.addEventListener('mouseout', () => {
                if (!video.paused) {
                    controls.style.opacity = 0;
                }
            });
            controls.addEventListener('mouseout', () => {
                if (!video.paused) {
                    controls.style.opacity = 0;
                }
            });
        },

        handleButtonPresses: function () {
            video.addEventListener('click', this.playPause, false);
            play.addEventListener('click', this.playPause, false);

            video.addEventListener('play', () => {
                play.title = "暂停";
                play.classList.remove('play-btn')
                play.classList.add('pause-btn')
                videoPlayer.trackPlayProgress();
            }, false);
            video.addEventListener('pause', () => {
                play.title = "播放";

                play.classList.remove('pause-btn')
                play.classList.add('play-btn')
                videoPlayer.stopTrackingPlayProgress();
            }, false);
            video.addEventListener('ended', function () {
                this.currentTime = 0;
                this.pause();
            }, false);
        },
        playPause: () => {
            if (video.paused || video.ended) {
                if (video.ended) {
                    video.currentTime = 0;
                }
                video.play();
            } else {
                video.pause();
            }
        },
        trackPlayProgress() {
            (function progressTrack() {
                videoPlayer.updatePlayProgress();
                window.playProgressInterval = setTimeout(progressTrack, 50);
            })();
        },
        updatePlayProgress : function(){
            // playProgressBar.style.width = ( (video.currentTime / video.duration) * (progressHolder.offsetWidth) ) + "px";
        },
        stopTrackingPlayProgress: function () {
            clearTimeout(playProgressInterval);
        },
        videoScrubbing: function() {
            progressHolder.addEventListener("mousedown", function(){
                videoPlayer.stopTrackingPlayProgress();

                videoPlayer.playPause();

                document.onmousemove = function(e) {
                    videoPlayer.setPlayProgress( e.pageX );
                }

                progressHolder.onmouseup = function(e) {
                    document.onmouseup = null;
                    document.onmousemove = null;

                    video.play();
                    videoPlayer.setPlayProgress( e.pageX );
                    videoPlayer.trackPlayProgress();
                }
            }, true);
        },

        setPlayProgress : function( clickX ) {
            var newPercent = Math.max( 0, Math.min(1, (clickX - this.findPosX(progressHolder)) / progressHolder.offsetWidth) );
            video.currentTime = newPercent * video.duration;
            playProgressBar.style.left = newPercent * (progressHolder.offsetWidth)  + "px";
        },

        findPosX : function(progressHolder) {
            var curleft = progressHolder.offsetLeft;
            while( progressHolder = progressHolder.offsetParent ) {
                curleft += progressHolder.offsetLeft;
            }
            return curleft;
        },
        bindTouching() {
            // let _touch = touch;
            // if (typeof _touch === "object") {
            //     console.log('touch.js loaded');
            // }
            // _touch.on('#video', 'touchstart', e => {
            //     e.preventDefault();
            // });
            //
            // _touch.on('#video', 'swipedown', e => {
            //     console.log('音量 down');
            // });
            // _touch.on('#video', 'swipeup', e => {
            //     console.log('音量 up');
            // });
        }
    };

    videoPlayer.init();
}(window, document));