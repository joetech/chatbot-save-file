console.log('popup js running...');

// Execute code when the popup is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Send message to the background script
  chrome.runtime.sendMessage({ type: "addSaveButton" });

  // Add click event listener to the close button
  const closeButton = document.getElementById("closeButton");
  closeButton.addEventListener("click", function () {
    // Send message to the background script to close the popup
    window.close();
  });
});
