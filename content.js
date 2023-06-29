function addSaveButton() {
  // Find the last 5 instances of a button element with "copy code" text and add a "Save Code" button
  const buttons = document.querySelectorAll('button');

  let count = 0;
  for (let i = buttons.length - 1; i >= 0; i--) {
    const buttonText = buttons[i].textContent;
    if (buttonText.includes('Copy code')) {
      // Check if "Save Code" button is already present
      const existingSaveButton = buttons[i].nextSibling;
      if (existingSaveButton && existingSaveButton.classList.contains('save-code-button')) {
        continue; // Skip adding the button if it already exists
      }

      const saveButton = document.createElement("button");
      saveButton.classList.add('save-code-button');
      saveButton.style.paddingLeft = '20px';
      saveButton.style.background = 'none';
      saveButton.style.border = 'none';

      const icon = document.createElement("img");
      icon.src = chrome.runtime.getURL("icon16.png");
      icon.style.marginBottom = '0px';
      icon.style.marginTop = '0px';
      icon.style.objectFit = 'contain';

      saveButton.appendChild(icon);
      saveButton.addEventListener("click", function (event) {
        saveCode(event, buttons[i]);
      });

      const parent = buttons[i].parentNode;
      parent.insertBefore(saveButton, buttons[i].nextSibling);

      count++;
      if (count === 5) {
        break;
      }
    }
  }
}

function saveCode(event, button) {
  console.log('saving the code');
  const darkElement = document.querySelector('.max-w-full'); // Find the element with the class 'dark'

  if (darkElement) {
    // Clone the next element to preserve the original content
    const clonedElement = darkElement.cloneNode(true);

    // Remove all images from the cloned element
    const images = clonedElement.querySelectorAll('img');
    images.forEach((image) => {
      image.remove();
    });

    // Remove all buttons from the cloned element
    const buttons = clonedElement.querySelectorAll('button');
    buttons.forEach((button) => {
      button.remove();
    });

    // Remove all SVG elements from the cloned element
    const svgs = clonedElement.querySelectorAll('svg');
    svgs.forEach((svg) => {
      svg.remove();
    });

    // Remove the first child div inside the 'bg-black' div
    const bgBlackDiv = clonedElement.querySelector('.bg-black');
    if (bgBlackDiv && bgBlackDiv.firstElementChild) {
      bgBlackDiv.firstElementChild.remove();
    }

    // Remove elements with 'group-hover:visible' in the class
    const visibleElements = clonedElement.querySelectorAll('[class*="group-hover:visible"]');
    visibleElements.forEach((element) => {
      element.remove();
    });

    // Remove the last div from the cloned element
    const lastDiv = clonedElement.querySelector('main').lastElementChild;
    if (lastDiv) {
      lastDiv.remove();
    }

    // Add CSS for the 'bg-black' class to the cloned element
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      .bg-black {
        background-color: black;
        color: white;
        padding: 10px;
        border-radius: 8px;
      }
      
      .text-gray-500 {
        background-color: lightgreen;
        border-radius: 15px;
        padding: 15px;
        margin-bottom: 10px;
      }
      
      .empty\\:hidden {
        background-color: lightblue;
        color: black;
        padding: 7px;
        border-radius: 5px;
      }
      
      .prose p {
        background-color: lightgrey;
        color: black;
        padding: 7px;
        border-radius: 5px;
      }
        `;
    clonedElement.appendChild(styleElement);

    // Add the code for including the Highlight.js library
    const highlightScript = document.createElement('script');
    highlightScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js';
    const highlightStylesheet = document.createElement('link');
    highlightStylesheet.rel = 'stylesheet';
    highlightStylesheet.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/ir-black.min.css';
    clonedElement.appendChild(highlightStylesheet);
    clonedElement.appendChild(highlightScript);

    const htmlContent = clonedElement.innerHTML; // Get the HTML content of the cloned element

    // Send a message to the background script with the HTML content
    chrome.runtime.sendMessage({ type: "codeFound", code: htmlContent, filename: "chat.html" });
  }
}



// Listen for messages from the background script or the popup
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === "addSaveButton") {
    addSaveButton();
  } else if (message.type === "saveChatFile") {
    console.log('saveChat message received');
    saveCode();
  }
});
