const createButton = document.getElementById("create-btn");
const joinButton = document.getElementById("join-btn");
const input = document.getElementById("room-code");
const mainContainer = document.getElementById("main-content");
const closeCreateContainerButton = document.getElementById("close-btn");
const videoContainer = document.getElementById("video-container");
let roomCode = "";

document.addEventListener("DOMContentLoaded", () => {
  console.log("hello");
  sendMessage({type:"GET_ROOM_INFO"}, (response) => {
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
    if(totalVideo){
      const reloadImage = document.getElementById("reload-img");
      if (reloadImage) reloadImage.remove();
        for (let index = 0; index < totalVideo; index++) createVideoCard(index);
    }else {
      const reloadImage = document.createElement("img");
      reloadImage.src = "./assets/icons/reload.svg";
      reloadImage.id = "reload-img";
      reloadImage.onclick = () => createRoom();
      videoContainer.appendChild(reloadImage);
    }

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
