const createButton = document.getElementById("create-btn");
const joinButton = document.getElementById("join-btn");
const input = document.getElementById("room-code");
const mainContainer = document.getElementById("main-content");
const closeCreateContainerButton = document.getElementById("close-btn");
const videoContainer = document.getElementById("video-container");
let roomCode = "";
const roomInfo = {
  roomId: "",
  host: false,
  isJoined: false,
};
document.addEventListener("DOMContentLoaded", () => {
  console.log("hello");
  chrome.storage.local.get(Object.keys(roomInfo), function (result) {
    console.log(result);
    if (Object.keys(result).length !== 0) {
      roomInfo.roomId = result["roomId"];
      roomInfo.host = result["host"];
      roomInfo.isJoined = result["isJoined"];
      if (roomInfo.isJoined) {
        document.getElementById("room-id").innerHTML = roomInfo.roomId;
        mainContainer.classList.add("moveup");
        mainContainer.classList.add("moveleft");
      }
    }
  });
});

const onRoomJoined = (response) => {
  console.log(response);
  chrome.storage.local.set(response, function () {
    console.log("Value is set to ");
  });

  document.getElementById("room-id").innerHTML = response.roomId;
  mainContainer.classList.add("moveleft");
};

const creatingRoom = (e, index) => {
  e.preventDefault();
  sendMessage({ type: "CREATE_ROOM", index }, onRoomJoined);
};

const createVideoCard = (index) => {
  const div = document.createElement("div");
  div.className = "video-card";
  const videoIndex = document.createElement("h2");
  videoIndex.className = "video-index";
  videoIndex.innerHTML = index + 1;
  const syncButton = document.createElement("button");
  syncButton.className = "btn sync-btn";
  syncButton.innerHTML = "Sync";
  syncButton.onclick = (e) => creatingRoom(e, index);
  div.appendChild(videoIndex);
  div.appendChild(syncButton);
  videoContainer.appendChild(div);
};

const createRoom = () => {
  document.querySelectorAll(".video-card").forEach((card) => card.remove());
  sendMessage({ type: "GET_VIDEO" }, (response) => {
    console.log(response);
    const totalVideo = response["videoNumber"];
    for (let index = 0; index < totalVideo; index++) createVideoCard(index);
  });
};

const joinRoom = (e) => {};

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

createButton.addEventListener("click", (e) => openCreateContainer());

closeCreateContainerButton.addEventListener("click", (e) =>
  closeCreateContainer()
);
