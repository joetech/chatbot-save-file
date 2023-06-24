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
        saveButton.addEventListener("click", saveCode);
  
        const parent = buttons[i].parentNode;
        parent.insertBefore(saveButton, buttons[i].nextSibling);
  
        count++;
        if (count === 5) {
          break;
        }
      }
    }
  }
  
      
    
  // Function to save the code
  function saveCode(event) {
    const codeElement = event.target.previousSibling; // Adjust this according to the element containing the code you want to save
    const code = codeElement.textContent; // Adjust this according to the code element's retrieval method
    chrome.runtime.sendMessage({ type: "codeFound", code: code });
  }
  
  // Listen for messages from the background script or the popup
  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.type === "addSaveButton") {
      addSaveButton();
    }
  });
  