import { sketches } from "./sketches.js";

import { createQueueButton, buildAlbumTemplate, buildSongView, buildAlbumView } from "./renders.js"

(function() {
    // global dom pointers
    const queueListDump = document.getElementById("queueList");



    // 
    // global song arrays
    const activeSongQueue = [];
    const fullSongList = [];

    // 
    // create default song list, manipulate list functions
    const converter = (albumArr) => {
        albumArr.map((ep) => {
            ep.trackList.map((song) => {
                const singleSong = {
                    epName: ep.title,
                    epArtist: ep.artist,
                    epArtistFull: ep.longArtist,
                    epRelease: ep.releaseDate,
                    epArtLink: ep.webLink,
                    songTitle: song.track,
                    songLength: song.length,
                    songUrl: song.url,
                    songOgFile: song.fileName,
                    songDaw: song.daw,
                    songStDate: song.date,
                    songStTime: song.started
                }
                fullSongList.push(singleSong)
            })
        })
    }


    const changeSongList = (newSongArr) => {
        fullSongList = newSongArr;
    }

    // 
    // queue functions
    const handleQueueItemClick = (e) => {
        e.preventDefault();
        const searchUrl = e.target.id.split(" ")[0]
        const data4Modal = findSong(searchUrl)
        modalDump.innerText = `${searchUrl}=${JSON.stringify(data4Modal, null, 2)}`;
        removeBtn.dataset.whichSong = searchUrl
        upNextBtn.dataset.whichSong = searchUrl
        modal.style.display = "block";
        removeBtn.style.display = "block"
        upNextBtn.style.display = "block"
    }

    const doesQueueButtonExist = (songObj) => {
        const searchId = songObj.url + " " + songObj.ep;
        const buttonSearch = document.getElementById(searchId)
        if (buttonSearch === null) {
            return 0
        }
        return 1;
    }

    const addSong2Queue = (el) => {
        const item = {
            title: el.title,
            length: el.length,
            ep: el.ep,
            artist: el.artist,
            url: el.url,
            art: el.art,
        }
        activeSongQueue.push(item);
        return;
    }

    const addSong2QueueFront = (el) => {
        const item = {
            title: el.songTitle,
            length: el.songLength,
            ep: el.epName,
            artist: el.epArtist,
            url: el.songUrl,
            art: el.epArtLink,
        }
        activeSongQueue.splice(1, 0, item);
        const newBtn = createQueueButton(item)
        newBtn.addEventListener("click", handleQueueItemClick)

        const firstChild = queueListDump.firstChild;
        queueListDump.insertBefore(newBtn, firstChild);
    }

    const renderButton = (el) => {
        // const qId = el.url + " " + el.ep
        const qObj = {
            url: el.url,
            ep: el.ep,
        }

        const newBtn = createQueueButton(el)
        newBtn.addEventListener("click", handleQueueItemClick);

        if (doesQueueButtonExist(qObj) === 1) {
            console.log("already in queue!")
            return;
        } else {
            queueListDump.appendChild(newBtn);
        }
    }

    const removeQueueButton = (btnId) => {
        console.log(btnId);
        document.getElementById(btnId).remove();
        return;
    }

    const removePlaceInQueue = (trackId) => {
        const trkUrl = trackId.split(" ")[0]
        const trackIdx = activeSongQueue.findIndex(item => item.url === trkUrl)
        const removed = activeSongQueue.splice(trackIdx, 1)

        removeQueueButton(trackId);
        console.log(`${removed[0].title} has been removed.`);
    }

    const removeFirstFromQueue = () => {
        const first = activeSongQueue[1];
        const searchBtn = first.url + " " + first.ep;
        removeQueueButton(searchBtn)
        activeSongQueue.shift();
        console.log("Queue shifted.")
        return;
    }

    const findButtonSearch = (trackUrl) => {
        const getId = activeSongQueue.find(track => track.url === trackUrl)
        const searchId = getId.url + " " + getId.ep;
        return searchId;
    }

    const doesButtonExist = (songObj) => {
        const searchId = songObj.url + " " + songObj.ep;
        const buttonSearch = document.getElementById(searchId)
        if (buttonSearch === null) {
            return 0
        }
        return 1;
    }
    // grabNext = ()
    // grabLength = ()

    const findSong = (url) => {
        const songName = url;

        let item = fullSongList.find(song => song.songUrl === songName)
        return item;
    }

    // audio player functions and poitners
    const currAlbumPic = document.getElementById("albumPic");
    const currTrackName = document.getElementById("trackName");
    const currArtistName = document.getElementById("artistName");
    const currAlbumName = document.getElementById("albumName");
    const audioPlayer = document.getElementById("player");
    const headSwap = document.getElementById("wellHeyThere");

    const clearPlayer = () => {
        document.title = "Sketches";
        currArtistName.innerText = "";
        currTrackName.innerText = "";
        currAlbumName.innerText = "No track queued!";
        currAlbumPic.src = "https://picsum.photos/25";
        audioPlayer.src = "https://forestw70.github.io/sketches-bcc-client/assets/music/mario3.mp3";
        headSwap.innerText = "sum' sketches"
    }

    const filterPlayer = () => {
        let wiper = activeSongQueue[0];
        if (activeSongQueue.length > 1) {
            wiper = activeSongQueue[1]
        }
        const songHome = `https://forestw70.github.io/sketches-bcc-client/assets/music/${wiper.url}.mp3`
        const newTitle = `${wiper.artist} ~ ${wiper.url}`

        // clear page title and replace with song info
        clearPlayer();
        document.title = newTitle;
        headSwap.innerText = wiper.artist + " " + wiper.url + ".mp3 '" + wiper.title + "' " + wiper.ep + " " + wiper.length;
        currArtistName.innerText = wiper.artist;
        currTrackName.innerText = `"${wiper.url}"`;
        currAlbumName.innerText = wiper.ep;
        currAlbumPic.src = wiper.art;
        audioPlayer.src = songHome;
        console.log("Next track loaded!");
        return;
    }

    // 
    // Buttons / options 

    let autoPlayOn = false;
    window.localStorage.setItem("view", "albumView");

    // top of page
    const topOfPageBtn = document.getElementById("returnToTop")
    topOfPageBtn.addEventListener("click", (e) => {
        e.preventDefault();
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    })

    // turn on auto play
    const autoPlayButton = document.getElementById("autoPlayOption");
    autoPlayButton.addEventListener("click", (e) => {
        e.preventDefault();
        if (!autoPlayOn) {
            autoPlayButton.innerText = "~expirimental autoplay~ -- ON."
            autoPlayButton.classList.add("opt-on")
            autoPlayOn = true;
            return;
        }
        autoPlayOn = false;
        autoPlayButton.innerText = "~expirimental autoplay~ -- OFF."
        autoPlayButton.classList.remove("opt-on")
    })

    // toggle show queue
    const toggleQueue = document.getElementById("toggleShowQueue")
    const queueicon = document.getElementById("sq")
    const queueTip = document.getElementById("qTip")
    toggleQueue.addEventListener("click", () => {
        if (!queueListDump.classList.contains("menu-hide")) {

            queueicon.classList.remove("glyphicon-menu-right")
            queueicon.classList.add("glyphicon-menu-down")
            queueListDump.classList.toggle('menu-hide')
            // queue hidden
            queueTip.innerText = "Queue Hidden."

        } else {

            queueListDump.classList.toggle('menu-hide')
            queueicon.classList.remove("glyphicon-menu-down")
            queueicon.classList.add("glyphicon-menu-right")
            queueTip.innerText = "Queue:"
        }
    })

    // change view buttons
    const albumViewBtn = document.getElementById("viewAlbums")
    const songViewBtn = document.getElementById("viewSongs")
    const optViewBtn = document.getElementById("viewOptions")
    albumViewBtn.addEventListener("click", () => {
        if (!albumViewBtn.classList.contains("curr-view")) {
            albumViewBtn.classList.add("curr-view")
            optViewBtn.classList.remove("curr-view")
            songViewBtn.classList.remove("curr-view")
            renderAlbumView();
        }
    })
    songViewBtn.addEventListener("click", () => {
        if (!songViewBtn.classList.contains("curr-view")) {
            songViewBtn.classList.add("curr-view")
            albumViewBtn.classList.remove("curr-view")
            optViewBtn.classList.remove("curr-view")
            showSongView(fullSongList);
        }
    })
    optViewBtn.addEventListener("click", () => {
        if (!optViewBtn.classList.contains("curr-view")) {
            optViewBtn.classList.add("curr-view")
            albumViewBtn.classList.remove("curr-view")
            songViewBtn.classList.remove("curr-view")
            showOptionView();
        }
    })

    // audio player buttons
    const playButton = document.getElementById("pause-play");
    const nextTrackBtn = document.getElementById("nextTrack");
    const icon = document.getElementById("pp");
    playButton.addEventListener("click", () => {
        const isLoadedCheck = audioPlayer.src.split(".").pop()
        // console.log(isLoadedCheck)
        if (isLoadedCheck !== "mp3") {
            return window.alert("Please queue up next song.")
        }
        if (audioPlayer.paused) {

            icon.classList.remove("glyphicon-play");
            icon.classList.add("glyphicon-pause");
            audioPlayer.play();
        } else {

            audioPlayer.pause();
            icon.classList.remove("glyphicon-pause");
            icon.classList.add("glyphicon-play");
        }
    })

    nextTrackBtn.addEventListener("click", () => {

        const queueLength = activeSongQueue.length;
        icon.classList.remove("glyphicon-pause");
        icon.classList.add("glyphicon-play");
        console.log(`You have ${queueLength - 2} items left in your queue!`);
        if (queueLength <= 1) {
            clearPlayer();
            console.log("nothing queued!")
        } else {
            filterPlayer();
            removeFirstFromQueue();
            icon.classList.add("glyphicon-pause");
            icon.classList.remove("glyphicon-play");
            audioPlayer.play();
        }
    })

    // 
    // list header buttons (for sorting)
    const headButtons = document.getElementById("headerRow").querySelectorAll("span");
    headButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            if (e.target.classList.contains("list-reverse")) {
                let list = fullSongList;
                e.target.classList.remove("list-reverse")
                return showSongView(list.reverse());
            }

            changeSortedSongList(e.target.dataset.sortBy)
            showSongView(fullSongList)
            e.target.classList.add("list-reverse");

        })
    })


    // 
    // track select functions
    const handleTrackSelect = (e) => {
        e.preventDefault();
        const lookObj = {
            title: e.currentTarget.dataset.title,
            length: e.currentTarget.dataset.length,
            ep: e.currentTarget.dataset.epname,
            artist: e.currentTarget.dataset.artist,
            url: e.currentTarget.dataset.url,
            art: e.currentTarget.dataset.albumurl,
        }
        const currQueueTime = activeSongQueue.length || 0;
        if (currQueueTime === 0) {
            addSong2Queue(lookObj);
            filterPlayer();
        } else {
            if (doesButtonExist(lookObj) === 0) {
                addSong2Queue(lookObj);
                renderButton(lookObj);
            } else {
                window.alert("song already in queue!")
            }
        }
    }

    // 
    // view swap functions and variables
    const discoContainer = document.getElementById("disco");
    const listDump = document.getElementById("listDump");
    const listView = document.getElementById("list");
    const optionsContainer = document.getElementById("options");

    const renderAlbumView = () => {
        localStorage.setItem("currentView", "album")

        discoContainer.innerText = ""
        listDump.innerText = '';
        listView.classList.add("hide");
        optionsContainer.classList.add("hide");
        discoContainer.classList.remove("hide");


        sketches.map(album => {
            const idvAlbum = buildAlbumCont(album);
            discoContainer.appendChild(idvAlbum);
        })
    }

    const buildAlbumCont = (albumInfo) => {
        const albumContainer = document.createElement("article");
        const trackContainer = document.createElement("div");
        const infoContainer = document.createElement("div");
        albumContainer.classList.add("disco-item");
        trackContainer.classList.add("track-container");
        infoContainer.classList.add("info-container");
        trackContainer.id = albumInfo.title;

        const songInfoFrag = buildAlbumTemplate(albumInfo);
        infoContainer.appendChild(songInfoFrag);
        albumContainer.appendChild(infoContainer);

        albumInfo.trackList.map((idvTrack, idx) => {
            const currSong = {
                trackNum: idx + 1,
                artist: albumInfo.artist,
                title: idvTrack.track,
                ep: albumInfo.title,
                art: albumInfo.webLink,
                url: idvTrack.url,
                length: idvTrack.length,
                albumRelease: albumInfo.releaseDate,
                artistLong: albumInfo.artistLong,
                ogFile: idvTrack.fileName,
                daw: idvTrack.daw,
                startDate: idvTrack.date,
                startTime: idvTrack.started
            }

            const songRow = buildAlbumView(currSong)
            songRow.addEventListener("click", handleTrackSelect);
            trackContainer.appendChild(songRow)
        })

        albumContainer.appendChild(trackContainer)
        return albumContainer;
    }


    // 
    // song view
    const showSongView = (sortedSongList) => {
        localStorage.setItem("currentView", "list")

        listDump.innerText = "";
        discoContainer.classList.add('hide');
        optionsContainer.classList.add("hide");
        listView.classList.remove("hide");

        sortedSongList.map((song, idx) => {
            const currSong = {
                trackNum: idx,
                title: song.title,
                length: song.length,
                artist: song.artist,
                ep: song.ep,
                art: song.artLink,
                url: song.url,
                albumRelease: song.releaseDate,
                artistLong: song.artistLong,
                ogFile: song.ogFileName,
                daw: song.dawUsed,
                startDate: song.dateCreated,
                startTime: song.timeCreated
            }

            const rowFragment = document.createDocumentFragment();
            const songRow = buildSongView(currSong);
            songRow.addEventListener("click", handleTrackSelect);
            rowFragment.appendChild(songRow)
            listDump.appendChild(rowFragment);
        })
    }

    // options view
    const showOptionView = () => {
        listView.classList.add('hide');
        listDump.innerText = '';
        discoContainer.classList.add('hide');
        optionsContainer.classList.remove('hide');
        localStorage.setItem("currentView", "option")
    }


    // 
    // track sort stuff
    const splitLength = (time) => {
        // "2:32"
        if (time === "?:??") return 1;

        const els = time.split(":");
        return new Number((els[0] * 60) + els[1])
    }

    const splitDate = (date) => {
        // "6-23-18"
        if (date === "--") return 1;

        const els = date.split("-");
        const utcDate = new Date(Date.UTC(els[2], els[0] - 1, els[1]))
        return utcDate.getTime();
    }

    const splitTimeSpamp = (ts) => {
        // "12:05 PM"
        if (ts === "--") return 1;

        const els = ts.split(" ");
        let mins = els[0].split(":")[0];
        const secs = els[0].split(":")[1];
        if (els[1] === "PM") {
            mins = mins + 12;
        }

        const totalSecs = new Number((mins * 60) + secs);
        return totalSecs;
    }

    const changeSortedSongList = (sortBy) => {
        const currentSort = fullSongList;
        let newSort;
        switch (sortBy) {
            case "trkNum":
                console.log("but... why?")
                break;

            case "trkNme":
                console.log("sorting by track title..");
                newSort = currentSort.sort((a, b) => {
                    let el1 = a.songTitle.toUpperCase();
                    let el2 = b.songTitle.toUpperCase();
                    if (el1 > el2) {
                        return 1
                    }
                    if (el1 < el2) {
                        return -1
                    }
                    return 0;
                })
                break;

            case "trkLen":
                console.log("sorting by track length..")
                newSort = currentSort.sort((a, b) => {
                    let el1 = splitLength(a.songLength);
                    let el2 = splitLength(b.songLength);
                    return el1 - el2;

                })
                break;

            case "epTtl":
                console.log("sorting by ep name..")
                newSort = currentSort.sort((a, b) => {
                    let el1 = a.epName.toUpperCase();
                    let el2 = b.epName.toUpperCase();
                    if (el1 > el2) {
                        return 1
                    }
                    if (el1 < el2) {
                        return -1
                    }
                    return 0;
                })

                break;

            case "artist":
                console.log("sorting by track artist..")
                newSort = currentSort.sort((a, b) => {
                    let el1 = a.epArtist.toUpperCase();
                    let el2 = b.epArtist.toUpperCase();
                    if (el1 > el2) {
                        return 1
                    }
                    if (el1 < el2) {
                        return -1
                    }
                    return 0;
                })

                break;

            case "trkUrl":
                console.log("sorting by track url..")
                newSort = currentSort.sort((a, b) => {
                    let el1 = a.songUrl.toUpperCase();
                    let el2 = b.songUrl.toUpperCase();
                    if (el1 > el2) {
                        return 1
                    }
                    if (el1 < el2) {
                        return -1
                    }
                    return 0;

                })
                break;

            case "trkOg":
                console.log("sorting by file name..")
                newSort = currentSort.sort((a, b) => {
                    if (a.fileName === "--" || b.fileName === "--") return 0;

                    let el1 = a.songOgFile.toUpperCase();
                    let el2 = b.songOgFile.toUpperCase();
                    if (el1 > el2) {
                        return -1
                    }
                    if (el1 < el2) {
                        return 1
                    }
                    return 0;
                })
                break;

            case "trkDte":
                console.log("sorting by date created..")
                newSort = currentSort.sort((a, b) => {
                    let el1 = splitDate(a.songStDate);
                    let el2 = splitDate(b.songStDate);
                    return el1 - el2;

                })
                break;

            case "trkTs":
                console.log("sorting by timestamp..")
                newSort = currentSort.sort((a, b) => {
                    let el1 = splitTimeSpamp(a.songStTime);
                    let el2 = splitTimeSpamp(b.songStTime);
                    return el1 - el2;

                })
                break;

            default:
                console.log(";)")
        }

        changeSongList(newSort);
    }


    // 
    // modal view
    const modal = document.getElementById("qPrompt");
    const modalDump = document.getElementById("modalDump");
    const nowPlayingInfo = document.getElementById("nowPlayingInfo");
    const closeModalBtn = document.getElementById("closeModal");
    const removeBtn = document.getElementById("removeThisSong");
    const upNextBtn = document.getElementById("upNextBtn");


    const handleCurrentTrackClick = (url) => {

        const data4Modal = findSong(url)
        modalDump.innerText = `${url}=${JSON.stringify(data4Modal, null, 2)}`;
        removeBtn.style.display = "none"
        upNextBtn.style.display = "none"
        modal.style.display = "block";
    }

    const handleQClick = (e) => {
        e.preventDefault();
        const searchUrl = e.target.id.split(" ")[0]
        const data4Modal = findSong(searchUrl)
        modalDump.innerText = `${searchUrl}=${JSON.stringify(data4Modal, null, 2)}`;
        removeBtn.dataset.whichSong = searchUrl
        upNextBtn.dataset.whichSong = searchUrl
        modal.style.display = "block";
        removeBtn.style.display = "block"
        upNextBtn.style.display = "block"
    }

    const closeModal = () => {
        modal.style.display = "none";
        removeBtn.dataset.whichSong = ""
        modalDump.innerText = ""
        removeBtn.style.display = "none"
        upNextBtn.style.display = "none"
    }

    nowPlayingInfo.addEventListener("click", (e) => {
        e.preventDefault();
        const displayFor = currTrackName.innerText.split('"')[1]
        handleCurrentTrackClick(displayFor)
    })

    upNextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const search = e.target.dataset.whichSong
        const btnSearch = findButtonSearch(search);
        removePlaceInQueue(btnSearch);
        const songItem = findSong(search);
        addSong2QueueFront(songItem);
        closeModal();
    })

    removeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const search = e.target.dataset.whichSong
        const btnSearch = findButtonSearch(search)
        removePlaceInQueue(btnSearch)
        closeModal();
    })

    closeModalBtn.addEventListener("click", (e) => {
        e.preventDefault();
        closeModal();
    })

    // 
    // window events
    window.onclick = (event) => {
        if (event.target == modal) {
            modalDump.innerText = ""
            modal.style.display = "none";
        }
    }

    window.onscroll = () => {
        if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
            topOfPageBtn.style.display = "flex";
        } else {
            topOfPageBtn.style.display = "none";
        }
    };

    audioPlayer.addEventListener("ended", () => {
        if (!autoPlayOn) {
            console.log("auto play is not on.")
            return;
        }
        const qtime = songQueue.grabLength()
        console.log(qtime)
        if (qtime > 1) {
            songQueue.filterPlayer();
            songQueue.removeFirstFromQueue();
            audioPlayer.play();
        } else if (qtime <= 1) {
            console.log('no more items in queue.')
        }
    })

    // ok, now do this and load baby
    converter(sketches);
    const currView = localStorage.getItem("currentView");
    if (currView === "list") {
        songViewBtn.classList.add("curr-view")
        showSongView(fullSongList);
    } else {
        console.log(currView)
        albumViewBtn.classList.add("curr-view")
        renderAlbumView();
    }
})();
