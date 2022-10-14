
const createButton = document.getElementById("create-btn");
const joinButton = document.getElementById("join-btn");
const input = document.getElementById("room-code");
const createContainer = document.getElementById("create-container");
const closeCreateContainerButton = document.getElementById("close-btn");
const videoContainer = document.getElementById("video-container");
let roomCode = "";

const createVideoCard = (index) => {
  const div = document.createElement("div");
  div.className = "video-card";
  const videoIndex = document.createElement("h2");
  videoIndex.className = "video-index";
  videoIndex.innerHTML = index + 1;
  const syncButton = document.createElement("button");
  syncButton.className = "btn sync-btn";
  syncButton.innerHTML = "Sync";
  syncButton.onclick = () => sendMessage({type: "SYNC_VIDEO", index }, (res) => {console.log(res)});
  div.appendChild(videoIndex);
  div.appendChild(syncButton);
  videoContainer.appendChild(div);

}

const createRoom = () => {
  document.querySelectorAll(".video-card").forEach((card) => card.remove());
  sendMessage({ type: "GET_VIDEO" }, (response) => {
    const totalVideo = response["videoNumber"];
    for (let index = 0; index < totalVideo; index++) 
      createVideoCard(index);
  });
};

const openCreateContainer = () => {
  createContainer.classList.add("moveup");
  createRoom();
};

const closeCreateContainer = () => {
  createContainer.classList.remove("moveup");
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

joinButton.addEventListener("click", (e) => {
  console.log(roomCode);
});

createButton.addEventListener("click", (e) => openCreateContainer());

closeCreateContainerButton.addEventListener("click", (e) =>
  closeCreateContainer()
);
