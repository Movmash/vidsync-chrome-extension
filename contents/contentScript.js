(() => {
  activateChromeListener();
})();

function findFirstVideoTag() {
  const videoList = [];
  const normalVideoTag = document.getElementsByTagName("video");
  for (let i = 0; i < normalVideoTag.length; i++) {
    const videoDetail = {
      duration: Math.floor(normalVideoTag[i].duration),
      isIframe: false,
      iFrameIndex: null,
      index: i,
    };

    videoList.push(videoDetail);
  }
  // iframes
  const frames = document.getElementsByTagName("iframe");
  for (let i = 0; i < frames.length; ++i) {
    try {
      var childDocument = frames[i].contentDocument;
    } catch (e) {
      continue;
    } // skip ones we can't access :|
    const videoTag = frames[i].contentDocument.getElementsByTagName("video");
    for (let j = 0; j < videoTag.length; j++) {
      const videoDetail = {
        duration: Math.floor(videoTag[j].duration),
        isIframe: true,
        iFrameIndex: i,
        index: j,
      };

      videoList.push(videoDetail);
    }
  }

  return videoList;
}

function retreiveVideoTag(videoDetail) {
  const { isIframe, iFrameIndex, index } = videoDetail;
  if (isIframe) {
    const iframe = document.getElementsByTagName("iframe")[iFrameIndex];
    const video = iframe.contentDocument.getElementsByTagName("video")[index];
    return video;
  }
  return document.getElementsByTagName("video")[index];
}
