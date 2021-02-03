let handlefail = function (err) {
    console.log(err)
}

let appId = "8670601d5846453da7342427e9da5420";
let globalStream;
let globalScreenStream;
let isAudioOff = false;
let isVideoOff = false;
let isScreenOff = true;

let client = AgoraRTC.createClient({
    mode: "live",
    codec: "h264"
})

var screenClient = AgoraRTC.createClient({
    mode: "live",
    codec: "h264"
});

client.init(appId, () => console.log("AgoraRTC Client Connected"), handlefail
)

screenClient.init(appId, () => console.log("Screen Client Connected"), handlefail
)

function removeMyVideoStream() {
    globalStream.stop();
    globalStream.close();
}

function removeVideoStream(evt) {
    let stream = evt.stream;
    stream.stop();
    stream.close();
    let remDiv = document.getElementById(stream.getId())
    remDiv.parentNode.removeChild(remDiv)
}

function removeMyScreenStream() {
    globalSscreenStream.close();
}

function addVideoStream(streamId) {

    console.log()
    let followerContainer = document.getElementById("followers");
    let screenContainer = document.createElement("div");
    screenContainer.className = "screen-container";
    followerContainer.appendChild(screenContainer);

    let streamDiv = document.createElement("div");
    streamDiv.id = streamId;
    streamDiv.style.transform = "rotateY(180deg)";
    streamDiv.className = "follower-screen";
    screenContainer.appendChild(streamDiv);

    let name = document.createElement("span");
    name.innerHTML = streamId;
    name.className = "follower-name";
    screenContainer.appendChild(name);
}

document.getElementById("btn-leave").onclick = function () {
    client.leave(function () {
        console.log("Left!")
    }, handlefail)
    removeMyVideoStream();
}

document.getElementById("btn-join").onclick = function () {
    let room = document.getElementById("room").value;
    let username = document.getElementById("username").value;
    let appId = "8670601d5846453da7342427e9da5420";

    let client = AgoraRTC.createClient({
        mode: "live",
        codec: "h264"
    })

    var screenClient = AgoraRTC.createClient({
        mode: "live",
        codec: "h264"
    });

    client.init(appId, () => console.log("AgoraRTC Client Connected"), handlefail
    )

    screenClient.init(appId, () => console.log("Screen Client Connected"), handlefail
    )

    client.join(
        null,
        room,
        username,
        () => {

            var localStream = AgoraRTC.createStream({
                video: true,
                audio: true,
                screen: false
            })

            localStream.init(function () {
                localStream.play("leader-screen")
                console.log(`App id: ${appId}\nChannel id: ${room}`)
                client.publish(localStream)

                let leadName = document.getElementById("leader-name")
                leadName.innerHTML = username;
            })

            globalStream = localStream;
        }
    )

    client.on("stream-added", function (evt) {
        client.subscribe(evt.stream, handlefail)
    })

    client.on("stream-subscribed", function (evt) {
        console.log("Subscribed Stream");
        let stream = evt.stream;
        addVideoStream(stream.getId());
        stream.play(stream.getId());
    })

    client.on("peer-leave", function (evt) {
        console.log("Peer has left");
        removeVideoStream(evt)
    })

    document.getElementById("toggle-video").onclick = function () {
        if (!isVideoOff) {
            globalStream.muteVideo();
            isVideoOff = true;
        }
        else {
            globalStream.unmuteVideo();
            isVideoOff = false;
        }
    }

    document.getElementById("toggle-audio").onclick = function () {
        if (!isAudioOff) {
            globalStream.muteAudio();
            isAudioOff = true;
        }
        else {
            globalStream.unmuteAudio();
            isAudioOff = false;
        }
    }

    document.getElementById("toggle-screen").onclick = function () {
        if (!isScreenOff) {
            screenClient.leave(function () {
                console.log("Swap!")
            }, handlefail)
            removeMyScreenStream();
            isScreenOff = true;
        }
        else {
            client.leave(function () {
                console.log("Swap!")
            }, handlefail)
            removeMyVideoStream();

            var screenStream = AgoraRTC.createStream({
                audio: false,
                video: false,
                screen: true,
            })

            screenStream.init(function () {
                screenStream.play("leader-screen")
                console.log(`App id: ${appId}\nChannel id: ${room}`)
                screenClient.publish(screenStream)
            })

            globalScreenStream = screenStream;
            isScreenOff = false;

        }
    }

}