const createButton = document.getElementById("create-btn");
const joinButton = document.getElementById("join-btn");
const input = document.getElementById("room-code");
const mainContainer = document.getElementById("main-content");
const closeCreateContainerButton = document.getElementById("close-btn");
const videoContainer = document.getElementById("video-container");
const leaveButton = document.getElementById("leave-btn");

let roomCode = "";

document.addEventListener("DOMContentLoaded", () => {
  console.log("hello");
  sendMessage({ type: "GET_ROOM_INFO" }, (response) => {
    if (response.isJoined) {
      document.getElementById("room-id").innerHTML = response.roomId;
      mainContainer.classList.add("moveup");
      mainContainer.classList.add("moveleft");
    }
  });
});

const onRoomJoined = (response) => {
  document.getElementById("room-id").innerHTML = response.roomId;
  mainContainer.classList.add("moveleft");
};

const creatingRoom = (e, videoDetail) => {
  e.preventDefault();
  sendMessage({ type: "CREATE_ROOM", videoDetail }, onRoomJoined);
};

const createVideoCard = (videoData) => {
  const {duration, isIframe, index} = videoData;
  const div = document.createElement("div");
  div.className = "video-card";
  const videoInfo = document.createElement("div");
  videoInfo.className = "video-info-card";
  const videoIndex = document.createElement("h2");
  const iframe = document.createElement("span");
  iframe.innerHTML = isIframe && "Iframe";
  videoIndex.className = "video-index";
  videoIndex.innerHTML = index + 1;
  const syncButton = document.createElement("button");
  syncButton.className = "btn sync-btn";
  syncButton.innerHTML = "Sync";
  syncButton.onclick = (e) => creatingRoom(e, videoData);
  videoInfo.appendChild(videoIndex);
  videoInfo.appendChild(iframe);
  div.appendChild(videoInfo);
  div.appendChild(syncButton);
  videoContainer.appendChild(div);
};

const createRoom = () => {
  document.querySelectorAll(".video-card").forEach((card) => card.remove());

  sendMessage({ type: "GET_VIDEO" }, (response) => {
    console.log(response);
    const videoList = response["videoList"];
    if (videoList.length) {
      const reloadImage = document.getElementById("reload-img");
      if (reloadImage) reloadImage.remove();
      for (let index = 0; index < videoList.length; index++) createVideoCard(videoList[index]);
    } else {
      const reloadImage = document.createElement("img");
      reloadImage.src = "./assets/icons/reload.svg";
      reloadImage.id = "reload-img";
      reloadImage.onclick = () => createRoom();
      videoContainer.appendChild(reloadImage);
    }
  });
};

const joinRoom = (e) => {
  sendMessage({ type: "JOIN_ROOM", roomId: roomCode }, (response) => {
    if (response.isJoined) {
      document.getElementById("room-id").innerHTML = response.roomId;
      mainContainer.classList.add("moveup");
      mainContainer.classList.add("moveleft");
    }
  });
};

const leaveRoom = (e) => {
  sendMessage({ type: "LEAVE_ROOM" }, (data) => {
    console.log("you left");
    mainContainer.classList.remove("moveup");
    mainContainer.classList.remove("moveleft");
  });
};

const openCreateContainer = () => {
  mainContainer.classList.add("moveup");
  createRoom();
};

const closeCreateContainer = () => {
  mainContainer.classList.remove("moveup");
};

const onKeyUp = (e) => {
  roomCode = e.target.value;
  if (e.target.value === "") {
    joinButton.classList.add("disabled");
    joinButton.disabled = true;
  } else {
    joinButton.classList.remove("disabled");
    joinButton.disabled = false;
  }
};

input.addEventListener("keyup", (e) => onKeyUp(e));

joinButton.addEventListener("click", joinRoom);

leaveButton.addEventListener("click", leaveRoom);

createButton.addEventListener("click", (e) => openCreateContainer());

closeCreateContainerButton.addEventListener("click", (e) =>
  closeCreateContainer()
);
