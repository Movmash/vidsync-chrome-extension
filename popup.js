console.log("hello world");
const createButton = document.getElementById("create-btn");
const joinButton = document.getElementById("join-btn");
const input = document.getElementById("room-code");
const createContainer = document.getElementById("create-container");
const closeCreateContainerButton = document.getElementById("close-btn");

let roomCode = "";

const openCreateContainer = () => {
  createContainer.classList.add("moveup");
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

closeCreateContainerButton.addEventListener("click",(e) => closeCreateContainer());
