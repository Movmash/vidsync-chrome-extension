const activateChromeListener = () => chrome.runtime.onMessage.addListener(receiveMessage);

function receiveMessage(data, send, senderResponse) {
  switch (data.type) {
    case "GET_VIDEO":
      const videoNumber = document.getElementsByTagName("video").length;
      return senderResponse({ videoNumber });
    case "SYNC_VIDEO":
      console.log("this is sync", data.index);
      sync(data.index);
      return senderResponse({ index: data.index });
    default:
      break;
  }
}