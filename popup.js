
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
  syncButton.onclick = () => sendMessage({type: "SYNC_VIDEO", index });
  div.appendChild(videoIndex);
  div.appendChild(syncButton);
  videoContainer.appendChild(div);

}

const sendMessage = (data, callback = () => {}) => {
  document.querySelectorAll(".video-card").forEach(card => card.remove());
  const queryOptions = { active: true, currentWindow: true };
  chrome.tabs.query(queryOptions, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, data, callback);
  });
}
const createRoom = () => {
  sendMessage({ type: "GET_VIDEO" }, (response) => {
    console.log(response["videoNumber"]);
    const totalVideo = response["videoNumber"];
    for (let index = 0; index < totalVideo.length; index++) 
      createVideoCard(index);
      // const videoTag = new DOMParser().parseFromString(
      //   data[i],
      //   "text/xml"
      // ).firstChild;
      // console.log(videoTag);
      // videoContainer.appendChild(videoTag);
    
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
