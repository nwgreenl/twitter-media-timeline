(async () => {
  const src = chrome.runtime.getURL('src/index.js');
  const contentModule = await import(src);
  contentModule.init();
})();
