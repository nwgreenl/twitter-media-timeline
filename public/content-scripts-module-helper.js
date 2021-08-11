(async () => {
  const src = chrome.extension.getURL('src/index.js');
  const contentModule = await import(src);
  contentModule.init();
})();
