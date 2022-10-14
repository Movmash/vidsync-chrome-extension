(() => {
  const findingVideo = setInterval(checkingVideoList, 1000);
  function checkingVideoList() {
    if (document.getElementsByTagName("video").length != 0) {
      clearInterval(findingVideo);
      activateChromeListener();
    }
  }
})();

