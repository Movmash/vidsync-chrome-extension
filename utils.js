const sendMessage = (data, callback = () => {}) => {
  const queryOptions = { active: true, currentWindow: true };
  chrome.tabs.query(queryOptions, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, data, callback);
  });
};
