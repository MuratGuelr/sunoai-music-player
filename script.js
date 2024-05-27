$(function () {
  var playerTrack = $("#player-track"),
    bgArtwork = $("#bg-artwork"),
    bgArtworkUrl,
    albumName = $("#album-name"),
    trackName = $("#track-name"),
    albumArt = $("#album-art"),
    sArea = $("#s-area"),
    seekBar = $("#seek-bar"),
    trackTime = $("#track-time"),
    insTime = $("#ins-time"),
    sHover = $("#s-hover"),
    playPauseButton = $("#play-pause-button"),
    i = playPauseButton.find("i"),
    tProgress = $("#current-time"),
    tTime = $("#track-length"),
    seekT,
    seekLoc,
    seekBarPos,
    cM,
    ctMinutes,
    ctSeconds,
    curMinutes,
    curSeconds,
    durMinutes,
    durSeconds,
    playProgress,
    bTime,
    nTime = 0,
    buffInterval = null,
    tFlag = false,
    albums = [
      "ConsolAktif",
      "ConsolAktif",
      "ConsolAktif",
      "ConsolAktif",
      "ConsolAktif",
      "ConsolAktif",
      "ConsolAktif",
      "ConsolAktif",
      "ConsolAktif",
      "ConsolAktif",
      "ConsolAktif",
      "ConsolAktif",
      "ConsolAktif",
      "ConsolAktif",
      "ConsolAktif",
    ],
    trackNames = [
      "Celestial Echoes",
      "Chotic",
      "Holographic-Oasis",
      "Night Shift",
      "Neon Dreamscape",
      "Midnight Horizon",
      "Stellar Odyssey",
      "Solaris-Reverie",
      "Cybernetic-Serenity",
      "Blinding-Galaxy",
      "Blinding-Neon",
      "Blinding-Pulse",
      "Midnight",
      "Shadows-of-the-blade",
      "Solar-Flare",
    ],
    albumArtworks = [
      "_1",
      "_2",
      "_3",
      "_4",
      "_5",
      "_6",
      "_7",
      "_8",
      "_9",
      "_10",
      "_11",
      "_12",
      "_13",
      "_14",
      "_15",
    ],
    trackUrl = [
      "../songs/Celestial-Echoes.mp3",
      "../songs/Chotic.mp3",
      "../songs/Holographic-Oasis.mp3",
      "../songs/Night-Shift.mp3",
      "../songs/NeonDreamscape.mp3",
      "../songs/Midnight-Horizon.mp3",
      "../songs/Stellar-Odyssey.mp3",
      "../songs/Solaris-Reverie.mp3",
      "../songs/Cybernetic-Serenity.mp3",
      "../songs/Blinding-Galaxy.mp3",
      "../songs/Blinding-Neon.mp3",
      "../songs/Blinding-Pulse.mp3",
      "../songs/Midnight.mp3",
      "../songs/Shadows-of-the-blade.mp3",
      "../songs/Solar-Flare.mp3",
    ],
    playPreviousTrackButton = $("#play-previous"),
    playNextTrackButton = $("#play-next"),
    currIndex = -1;

  const albumArtUrls = [
    "../album-cover/celestial-echoes.jpg",
    "../album-cover/Chotic.jpg",
    "../album-cover/Holographic-Oasis.jpg",
    "../album-cover/Night-Shift.jpg",
    "../album-cover/NeonDreamscape.jpg",
    "../album-cover/Midnight-Horizon.jpg",
    "../album-cover/Stellar-Odyssey.jpg",
    "../album-cover/Solaris-Reverie.jpg",
    "../album-cover/Cybernetic-Serenity.jpg",
    "../album-cover/Blinding-Galaxy.jpg",
    "../album-cover/Blinding-Neon.jpg",
    "../album-cover/Blinding-Pulse.jpg",
    "../album-cover/Midnight.jpg",
    "../album-cover/Shadows-of-the-blade.jpg",
    "../album-cover/Solar-Flare.jpg",
  ];

  const volumeSlider = document.getElementById("volume-slider");
  const volumeText = document.getElementById("volume-text");

  volumeSlider.addEventListener("input", function () {
    volumeText.textContent = `${Math.floor(volumeSlider.value * 100)}%`;
    100;
    audio.volume = this.value;
  });

  function generateSongList() {
    const songList = document.getElementById("song-list");
    songList.innerHTML = "";

    function selectTrack(clickedIndex) {
      const selectedIndex = parseInt(clickedIndex);

      if (selectedIndex >= 0 && selectedIndex < albums.length) {
        currIndex = selectedIndex;

        audio.src = trackUrl[currIndex];
        audio.play();
        playerTrack.addClass("active");
        albumArt.addClass("active");

        albumName.text(albums[currIndex]);
        trackName.text(trackNames[currIndex]);

        albumArt.find("img.active").removeClass("active");
        $("#" + albumArtworks[currIndex]).addClass("active");

        bgArtworkUrl = $("#" + albumArtworks[currIndex]).attr("src");
        bgArtwork.css({ "background-image": "url(" + bgArtworkUrl + ")" });

        i.attr("class", "fas fa-pause");
      } else {
        console.error("Geçersiz şarkı indeksi");
      }
    }

    for (let i = 0; i < albums.length; i++) {
      const songItem = document.createElement("li");
      songItem.dataset.index = i;

      const songImage = document.createElement("img");
      songImage.src = albumArtUrls[i];
      songImage.alt = trackNames[i];
      songImage.classList.add("song-image");

      const songTitle = document.createElement("span");
      songTitle.textContent = trackNames[i];

      const songArtist = document.createElement("span");
      songArtist.textContent = albums[i];

      songItem.appendChild(songImage);
      songItem.appendChild(songTitle);
      songItem.appendChild(songArtist);

      songItem.addEventListener("click", function (event) {
        const clickedIndex = event.currentTarget.dataset.index;
        selectTrack(clickedIndex);

        audio.volume = volumeSlider.value;
        volumeSlider.classList.remove("display-none");
        volumeText.classList.remove("display-none");
        playerTrack.addClass("active");
        albumArt.addClass("active");
        audio.play();
      });

      songList.appendChild(songItem);
    }
  }

  function playPause() {
    setTimeout(function () {
      if (audio.paused) {
        playerTrack.addClass("active");
        albumArt.addClass("active");
        checkBuffering();
        i.attr("class", "fas fa-pause");
        audio.volume = volumeSlider.value;
        volumeSlider.classList.remove("display-none");
        volumeText.classList.remove("display-none");
        audio.play();
      } else {
        playerTrack.removeClass("active");
        albumArt.removeClass("active");
        clearInterval(buffInterval);
        albumArt.removeClass("buffering");
        i.attr("class", "fas fa-play");
        volumeSlider.classList.add("display-none");
        volumeText.classList.add("display-none");
        audio.pause();
      }
    }, 300);
  }

  function showHover(event) {
    seekBarPos = sArea.offset();
    seekT = event.clientX - seekBarPos.left;
    seekLoc = audio.duration * (seekT / sArea.outerWidth());

    sHover.width(seekT);

    cM = seekLoc / 60;

    ctMinutes = Math.floor(cM);
    ctSeconds = Math.floor(seekLoc - ctMinutes * 60);

    if (ctMinutes < 0 || ctSeconds < 0) return;

    if (ctMinutes < 0 || ctSeconds < 0) return;

    if (ctMinutes < 10) ctMinutes = "0" + ctMinutes;
    if (ctSeconds < 10) ctSeconds = "0" + ctSeconds;

    if (isNaN(ctMinutes) || isNaN(ctSeconds)) insTime.text("--:--");
    else insTime.text(ctMinutes + ":" + ctSeconds);

    insTime.css({ left: seekT, "margin-left": "-21px" }).fadeIn(0);
  }

  function hideHover() {
    sHover.width(0);
    insTime.text("00:00").css({ left: "0px", "margin-left": "0px" }).fadeOut(0);
  }

  function playFromClickedPos() {
    audio.currentTime = seekLoc;
    seekBar.width(seekT);
    hideHover();
  }

  function updateCurrTime() {
    nTime = new Date();
    nTime = nTime.getTime();

    if (!tFlag) {
      tFlag = true;
      trackTime.addClass("active");
    }

    curMinutes = Math.floor(audio.currentTime / 60);
    curSeconds = Math.floor(audio.currentTime - curMinutes * 60);

    durMinutes = Math.floor(audio.duration / 60);
    durSeconds = Math.floor(audio.duration - durMinutes * 60);

    playProgress = (audio.currentTime / audio.duration) * 100;

    if (curMinutes < 10) curMinutes = "0" + curMinutes;
    if (curSeconds < 10) curSeconds = "0" + curSeconds;

    if (durMinutes < 10) durMinutes = "0" + durMinutes;
    if (durSeconds < 10) durSeconds = "0" + durSeconds;

    if (isNaN(curMinutes) || isNaN(curSeconds)) tProgress.text("00:00");
    else tProgress.text(curMinutes + ":" + curSeconds);

    if (isNaN(durMinutes) || isNaN(durSeconds)) tTime.text("00:00");
    else tTime.text(durMinutes + ":" + durSeconds);

    if (
      isNaN(curMinutes) ||
      isNaN(curSeconds) ||
      isNaN(durMinutes) ||
      isNaN(durSeconds)
    )
      trackTime.removeClass("active");
    else trackTime.addClass("active");

    seekBar.width(playProgress + "%");

    if (playProgress == 100) {
      i.attr("class", "fa fa-play");
      seekBar.width(0);
      tProgress.text("00:00");
      albumArt.removeClass("buffering").removeClass("active");
      clearInterval(buffInterval);

      if (currIndex >= albumArtworks.length) {
        currIndex = 0;
      }
      selectTrack(1);
    }
  }

  function checkBuffering() {
    clearInterval(buffInterval);
    buffInterval = setInterval(function () {
      if (nTime == 0 || bTime - nTime > 1000) albumArt.addClass("buffering");
      else albumArt.removeClass("buffering");

      bTime = new Date();
      bTime = bTime.getTime();
    }, 100);
  }

  function selectTrack(flag) {
    if (flag == 0 || flag == 1) ++currIndex;
    else --currIndex;

    if (currIndex > -1 && currIndex < albumArtworks.length) {
      if (flag == 0) i.attr("class", "fa fa-play");
      else {
        albumArt.removeClass("buffering");
        i.attr("class", "fa fa-pause");
      }

      seekBar.width(0);
      trackTime.removeClass("active");
      tProgress.text("00:00");
      tTime.text("00:00");

      currAlbum = albums[currIndex];
      currTrackName = trackNames[currIndex];
      currArtwork = albumArtworks[currIndex];

      audio.src = trackUrl[currIndex];

      nTime = 0;
      bTime = new Date();
      bTime = bTime.getTime();

      if (flag != 0) {
        audio.play();
        playerTrack.addClass("active");
        albumArt.addClass("active");

        clearInterval(buffInterval);
        checkBuffering();
      }

      albumName.text(currAlbum);
      trackName.text(currTrackName);
      albumArt.find("img.active").removeClass("active");
      $("#" + currArtwork).addClass("active");

      bgArtworkUrl = $("#" + currArtwork).attr("src");

      bgArtwork.css({ "background-image": "url(" + bgArtworkUrl + ")" });
    } else {
      if (flag == 0 || flag == 1) --currIndex;
      else ++currIndex;
    }
  }

  function initPlayer() {
    audio = new Audio();

    selectTrack(0);

    audio.loop = false;

    playPauseButton.on("click", playPause);

    sArea.mousemove(function (event) {
      showHover(event);
    });

    sArea.mouseout(hideHover);

    sArea.on("click", playFromClickedPos);

    $(audio).on("timeupdate", updateCurrTime);

    playPreviousTrackButton.on("click", function () {
      selectTrack(-1);
    });
    playNextTrackButton.on("click", function () {
      selectTrack(1);
    });
  }

  initPlayer();
  generateSongList();
});
