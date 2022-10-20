const socketData = {
  socket: {},
  serverOrigin: "https://vidsyncronize.herokuapp.com/",
};
const roomInfo = {
  roomId: "",
  host: false,
  isJoined: false,
}

function socketInit (videoDetail = {}, isCreateRoom = true, roomId = ""){
  socketData.socket = io(socketData.serverOrigin);
  roomInfo.roomId = roomId;
  const {socket} = socketData;
  roomInfo.host = isCreateRoom;
  console.log(roomInfo);
  socket.emit("joinroom", roomInfo);
  socket.on("joinroom", (data) => {
    console.log(`user joined with ${data}`);
  });
  roomInfo.isJoined = true;
  return sync(videoDetail);
}

const leaveRoom = () => {
  const { socket } = socketData;
  roomInfo.host = false;
  roomInfo.isJoined = false;
  roomInfo.roomId = "";
  socket.disconnect();
};

function sync(videoData) {

  const { socket } = socketData;
  // const videoList = document.getElementsByTagName("video");
  const video = retreiveVideoTag(videoData);
  console.log(video);
  const { host, roomId } = roomInfo;
  const videoState = {
    paused: video.paused,
    currentTime: video.currentTime,
    playbackRate: video.playbackRate,
  };
  const hostVideoState = {};

  if (!host) syncVideoWithHost();
  
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

  function syncVideoTo (srcState) {
    console.log("syncing...");
    video.currentTime = srcState["currentTime"];
    video.playbackRate = srcState["playbackRate"];
    if (!srcState["paused"]) video.play();
    else video.pause();
    updateState();
    updateHostState();
  };

  function syncVideoWithHost() {
    if (host) return;
    updateState();
    console.log("sync with host");
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

  video.onseeked = (e) => {
    if (!host) {
      syncVideoWithHost();
      return;
    }
    updateState();
    socket.emit("onseeked", {roomId, videoState});
  }

  socket.on("onpause", ({ videoState }) => {
    if (host) return;
    syncVideoTo(videoState);
  });

  socket.on("onplay", ({ videoState }) => {
    if (host) return;
    syncVideoTo(videoState);
  });

  socket.on("onseeked", ({videoState}) => {
    if(host) return;
    syncVideoTo(videoState);
  })

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
