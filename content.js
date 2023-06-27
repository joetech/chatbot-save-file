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
  const codeParent = event.target.closest('.bg-black'); // Find the parent element with class 'bg-black'
  const preElement = codeParent.parentElement;

  let filename = "code.txt"; // Default filename

  if (preElement) {
    let siblingElement = preElement.previousElementSibling; // Get the previous sibling element
  
    while (siblingElement && siblingElement.nodeType !== Node.ELEMENT_NODE) {
      // Traverse previous siblings until an element node is found
      siblingElement = siblingElement.previousElementSibling;
    }
  
    if (
      siblingElement &&
      siblingElement.tagName.toLowerCase() === "p" &&
      siblingElement.textContent.trim().length > 0 && // Ensure non-empty text content
      siblingElement.textContent.trim().length <= 40 && // Limit filename length to 40 characters
      /^[a-zA-Z0-9.:]+$/.test(siblingElement.textContent.trim()) // Validate filename format
    ) {
      console.log("found the p tag with the valid file name");
  
      filename = siblingElement.textContent.trim(); // Get the text content of the <p> element
      filename = filename.replace(':', '');
      console.log('updated filename', filename);
    }
  }

  const codeElement = codeParent.querySelector('code'); // Find the <code> element within the parent

  if (codeElement) {
    console.log('codeElement', codeElement);
    const codeContent = codeElement.textContent; // Get the content of the <code> element

    // Send a message to the background script with the code content and filename
    chrome.runtime.sendMessage({ type: "codeFound", code: codeContent, filename: filename });
  }
}

// Function to convert HTML to Markdown using Turndown.js
function convertHtmlToMarkdown(html) {
  console.log('converting html to markdown');
  const turndownService = new TurndownService();
  return turndownService.turndown(html);
}

// Function to save the chat contents as a markdown file
function saveChat() {
  console.log('preparing to save chat');

  // Select elements with class "empty:hidden" or "prose"
  const elements = document.querySelectorAll('.empty\\:hidden, .prose');

  // Flatten the elements to include <p> and <code> tags as separate elements
  const filteredElements = flattenElements(elements);

  // Convert each element to markdown
  const markdownElements = Array.from(filteredElements).map(element => {
    if (element.classList.contains('prose') || (element.tagName.toLowerCase() === 'p' && isPreSibling(element))) {
      // Apply blockquote formatting to elements with class "prose" or peers of <pre> tags
      return `> ${convertHtmlToMarkdown(element.innerHTML)}`;
    } else {
      return convertHtmlToMarkdown(element.innerHTML);
    }
  });

  // Add horizontal line after each element with class "empty:hidden"
  const markdownWithHorizontalLines = markdownElements.join('\n\n---\n\n');

  // Send a message to the background script with the chat markdown
  chrome.runtime.sendMessage({ type: "codeFound", code: markdownWithHorizontalLines, filename: "markdown.md" });
}

// Function to flatten elements to include <p> and <code> tags as separate elements
function flattenElements(elements) {
  const flattenedElements = [];

  elements.forEach(element => {
    if (element.tagName.toLowerCase() === 'p' || element.tagName.toLowerCase() === 'code') {
      flattenedElements.push(element);
    } else {
      const childElements = Array.from(element.querySelectorAll('p, code'));
      flattenedElements.push(...childElements);
    }
  });

  return flattenedElements;
}

// Function to check if an element is a peer of a <pre> tag
function isPreSibling(element) {
  const parentElement = element.parentElement;
  const preSibling = parentElement.previousElementSibling;
  return preSibling && preSibling.tagName.toLowerCase() === 'pre';
}

// Listen for messages from the background script or the popup
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === "addSaveButton") {
    addSaveButton();
  } else if (message.type === "saveChatFile") {
    console.log('saveChat message received');
    saveChat();
  }
});
