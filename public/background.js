chrome.tabs.onUpdated.addListener(function (_tabId, changeInfo) {
  if (changeInfo.url) {
    if (changeInfo.url.endsWith('twitter.com/home')) {
      chrome.browserAction.enable();
    } else {
      chrome.browserAction.disable();
    }
  }
});
