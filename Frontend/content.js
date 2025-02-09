console.log("Content script is running");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "extractText") {
    console.log("Extracting text from the page...");
    const bodyText = document.body.innerText;
    console.log("Extracted Text:", bodyText);

    sendResponse({ extractedText: bodyText });
  }
});

document.addEventListener('mouseup', (e) => {
    const selection = window.getSelection();
    if (selection.toString().length > 0) {
      const menu = document.getElementById('context-menu');
      if (!menu) {
        createMenu(e.pageX, e.pageY, selection.toString());
      }
    } else {
      removeMenu();
    }
  });
  
  function createMenu(x, y, selectedText) {
    const menu = document.createElement('div');
    menu.id = 'context-menu';
    menu.style.position = 'absolute';
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
    menu.style.backgroundColor = '#f1f1f1';
    menu.style.border = '1px solid #ccc';
    menu.style.padding = '10px';
    menu.style.zIndex = '9999';
  
    const button1 = document.createElement('button');
    button1.textContent = 'Translate';
    button1.addEventListener('click', () => {
      console.log("Translate button clicked");
  
      // Send the selected text for translation
      console.log("Selected text:", selectedText);
      alert('Selected text: ' + selectedText);
    });
  
    const button2 = document.createElement('button');
    button2.textContent = 'Read Text';
    button2.addEventListener('click', () => {
      console.log("Read Text button clicked");

      console.log("Selected text:", selectedText);
      alert('Selected text: ' + selectedText);

    });
  
    const button3 = document.createElement('button');
    button3.textContent = 'Voice Command';
    button3.addEventListener('click', () => {
      console.log("Voice Command button clicked");
      
    });
  
    menu.appendChild(button1);
    menu.appendChild(button2);
    menu.appendChild(button3);
  
    document.body.appendChild(menu);
  }
  
  function removeMenu() {
    const menu = document.getElementById('context-menu');
    if (menu) {
      document.body.removeChild(menu);
    }
  }
  