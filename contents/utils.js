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
      const roomId = uuid();
      socketInit(data.index, true, roomId);
      return senderResponse({ roomId, host: true, isJoined: true });
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