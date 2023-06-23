console.log('popup js running...');

// Execute code when the popup is loaded
document.addEventListener("DOMContentLoaded", function () {
    // Send message to the background script
    chrome.runtime.sendMessage({ type: "addSaveButton" });
  });
  
  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.type === "codeFound") {
      // Create a file and initiate the download
      const downloadLink = document.createElement("a");
      downloadLink.href = message.code;
      downloadLink.download = "code.txt";
      downloadLink.click();
    }
  });
  