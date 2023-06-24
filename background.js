console.log('background listening...');

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === "addSaveButton") {
    console.log('adding save buttons...');
    // Inject content script into the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ["content.js"]
      }, function () {
        console.log('initiating addSaveButton message...');
        // Send message to the content script
        chrome.tabs.sendMessage(tabs[0].id, { type: "addSaveButton" });
      });
    });
  }
});
