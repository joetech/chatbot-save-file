console.log('popup js running...');

// Execute code when the popup is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Send message to the background script
  chrome.runtime.sendMessage({ type: "addSaveButton" });
});

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === "codeFound") {
    console.log('initiating file download...');

    // Create a data URL for the code content
    const dataUrl = 'data:text/plain;charset=utf-8,' + encodeURIComponent(message.code);

    // Create a file and initiate the download
    const downloadLink = document.createElement("a");
    downloadLink.href = dataUrl;
    downloadLink.download = "code.txt";
    downloadLink.click();
  }
});
