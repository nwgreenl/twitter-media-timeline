const TWITTER_TIMELINE_PATH = "x.com/home";

chrome.tabs.onUpdated.addListener(function (tabId, _changeInfo, tab) {
  if (!tab.active || !tab.url) return;

  if (
    !tab.url.endsWith(TWITTER_TIMELINE_PATH) &&
    !tab.url.endsWith(TWITTER_TIMELINE_PATH + "/")
  ) {
    return chrome.action.disable(tabId);
  }

  if (!chrome.action.isEnabled(tabId)) {
    return chrome.action.enable(tabId);
  }
});
