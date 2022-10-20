const activateChromeListener = () =>{ console.log("listener start"); chrome.runtime.onMessage.addListener(receiveMessage)};

function receiveMessage(data, send, senderResponse) {
  switch (data.type) {
    case "GET_VIDEO":
      const videoList = findFirstVideoTag();
      return senderResponse({ videoList });
    case "CREATE_ROOM":
      const videoDetail = data.videoDetail;
      console.log("this is sync", videoDetail.index);
      const roomId = generateRoomCode(videoDetail);
      socketInit(videoDetail, true, roomId);
      return senderResponse(roomInfo);
    case "JOIN_ROOM":
      const videoData = decodeRoomId(data.roomId);
      socketInit(videoData, false, data.roomId);
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

function decodeRoomId (id) {
  const decodeArray = id.split("-");
  const isIframe = decodeArray.length == 4;
  const iFrameIndex = isIframe ? decodeArray[1] : "";
  const index = decodeArray[decodeArray.length - 1];
  return {isIframe, iFrameIndex, index};
}
function generateRoomCode (data) {
  const codeArray = [];
  const { isIframe, iFrameIndex, index } = data;
  if(isIframe){ 
    codeArray.push("i");
    codeArray.push(iFrameIndex.toString());
  }
  codeArray.push(uuid().toString());
  codeArray.push(index.toString());
  
  return codeArray.join("-");
}

function uuid () {
//   return Date.now().toString(36) + Math.random().toString(36).substr(2);
    return Math.floor(1000 + Math.random() * 9000).toString();
};