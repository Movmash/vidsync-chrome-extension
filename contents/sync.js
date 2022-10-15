const socketData = {
  socket: {},
  serverOrigin: "http://localhost:3000",
};
const roomInfo = {
  roomId: "",
  host: false,
  isJoined: false,
}

function socketInit (index = 0, isCreateRoom = true, roomId = ""){
  socketData.socket = io(socketData.serverOrigin);
  roomInfo.roomId = roomId;
  const {socket} = socketData;
  roomInfo.host = isCreateRoom;
  socket.emit("join-room", {roomInfo});
  socket.on("join-room", (data) => {
    console.log(data);
  });
  roomInfo.isJoined = true;
  return sync(index);
}

function sync(index) {
  console.log(roomInfo);
  const { socket } = socketData;
  const videoList = document.getElementsByTagName("video");
  const video = videoList[index];
  let host = false;
  let roomId = "";
  // console.log(video);
  // socket.on("connected", (data) => {
  //   console.log(data.message);
  // });

  // socket.emit("create-room");
  // socket.on("create-room", (data) => {
  //   console.log(data);
  //   roomId = data.roomId;
  //   host = data.host;
  //   if (!host) syncVideoWithHost();
  // });

  const videoState = {
    paused: video.paused,
    currentTime: video.currentTime,
    playbackRate: video.playbackRate,
  };

  const hostVideoState = {};

  function updateState() {
    videoState["paused"] = video.paused;
    videoState["currentTime"] = video.currentTime;
    videoState["playbackRate"] = video.playbackRate;
    return videoState;
  }

  function updateHostState() {
    hostVideoState["paused"] = video.paused;
    hostVideoState["currentTime"] = video.currentTime;
    hostVideoState["playbackRate"] = video.playbackRate;
    return hostVideoState;
  }
  const syncVideoTo = (srcState) => {
    video.currentTime = srcState["currentTime"];
    video.playbackRate = srcState["playbackRate"];
    if (!srcState["paused"]) video.play();
    else video.pause();
    updateState();
    updateHostState();
  };

  const syncVideoWithHost = () => {
    if (host) return;
    updateState();
    console.log(hostVideoState);
    console.log(videoState);
    if (!Object.keys(hostVideoState).length)
      return socket.emit("syncwithhost", { roomId });

    const hostCurrTime = hostVideoState["currentTime"];
    const userCurrTime = videoState["currentTime"];
    const pauseState = !(hostVideoState["paused"] === videoState["paused"]);
    const playbackState = !(
      hostVideoState["playbackRate"] == videoState["playbackRate"]
    );
    const currentTimeState = Math.abs(hostCurrTime - userCurrTime) > 2;
    console.log({ pauseState, playbackState, currentTimeState });
    console.log(pauseState || playbackState || currentTimeState);

    if (pauseState || playbackState || currentTimeState)
      return socket.emit("syncwithhost", { roomId });
  };

  video.onplay = () => {
    if (!host) {
      syncVideoWithHost();
      return;
    }
    updateState();
    socket.emit("onplay", { roomId, videoState });
  };

  video.onpause = () => {
    if (!host) {
      syncVideoWithHost();
      console.log("user is not sync with host");
      return;
    }
    updateState();
    socket.emit("onpause", { roomId, videoState });
  };

  socket.on("onpause", ({ videoState }) => {
    if (host) return;
    syncVideoTo(videoState);
  });

  socket.on("onplay", ({ videoState }) => {
    if (host) return;
    syncVideoTo(videoState);
  });

  socket.on("syncwithhost", () => {
    if (!host) return;
    updateState();
    console.log("requesting user for the source data");
    socket.emit("hostvideostate", { roomId, videoState });
  });

  socket.on("hostvideostate", (data) => {
    if (host) return;
    updateState();
    hostVideoState["paused"] = data.hostVideoState["paused"];
    hostVideoState["currentTime"] = data.hostVideoState["currentTime"];
    hostVideoState["playbackRate"] = data.hostVideoState["playbackRate"];
    syncVideoTo(hostVideoState);
  });
}
