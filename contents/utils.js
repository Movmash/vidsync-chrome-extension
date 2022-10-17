const activateChromeListener = () =>{ console.log("listener start"); chrome.runtime.onMessage.addListener(receiveMessage)};

function receiveMessage(data, send, senderResponse) {
        console.log(data);
  switch (data.type) {
    case "GET_VIDEO":
      const videoNumber = document.getElementsByTagName("video").length;
      console.log(videoNumber);
      return senderResponse({ videoNumber });
    case "CREATE_ROOM":
      console.log("this is sync", data.index);
      const roomId = `${uuid()}-${data.index}`;
      socketInit(data.index, true, roomId);
      return senderResponse(roomInfo);
    case "JOIN_ROOM":
      const index = data.roomId.split("-")[1];
      socketInit(index, false, data.roomId);
      return senderResponse(roomInfo);
    case "LEAVE_ROOM":
      console.log(data);
      leaveRoom();
      return senderResponse(roomInfo);
    case "GET_ROOM_INFO":
      return senderResponse(roomInfo);
    default:
      break;
  }
}

function uuid () {
//   return Date.now().toString(36) + Math.random().toString(36).substr(2);
    return Math.floor(1000 + Math.random() * 9000).toString();
};