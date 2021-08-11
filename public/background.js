chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
  if (changeInfo.url && changeInfo.url.endsWith('/home')) {
    chrome.scripting.executeScript({
      target: {tabId},
      files: ['src/index.js'],
    });
  }
});
