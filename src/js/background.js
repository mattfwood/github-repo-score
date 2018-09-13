import '../img/icon-128.png'
import '../img/icon-34.png'

// chrome.tabs.executeScript({
//   file: 'inject.bundle.js'
// });


chrome.tabs.onUpdated.addListener((tabId, changeInfo, callback) => {
  if (changeInfo.status == 'complete') {
    chrome.tabs.executeScript(tabId, {
      file: 'inject.bundle.js'
    });
  }
});