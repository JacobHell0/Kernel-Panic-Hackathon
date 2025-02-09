console.log("Content script is running");

let mouseUpListener = (e) => {
  const selection = window.getSelection();
  if (selection.toString().length > 0) {
    setTimeout(() => {
      const menu = document.getElementById('context-menu'); //Label element
      if (!menu) {
        createMenu(e.pageX, e.pageY, selection.toString());
      }
    }, 100);
  } else {
    removeMenu();
  }
};

let clickListener = (event) => {
  const menu = document.getElementById('context-menu');
  if (menu && !menu.contains(event.target)) {
    removeMenu();
  }
};

function enableEventListeners() {
  document.addEventListener('mouseup', mouseUpListener);
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "extractText") {
      console.log("Extracting text from the page...");
      const bodyText = document.body.innerText;
      console.log("Extracted Text:", bodyText);
      sendResponse({ extractedText: bodyText });
    }
  });
  document.addEventListener('click', clickListener);
}

function disableEventListeners() {
  removeMenu();
  document.removeEventListener('mouseup', mouseUpListener);
  document.removeEventListener('click', clickListener);
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'disableListeners') {
    console.log('Disabling event listeners in content script');
    disableEventListeners();
  }
});

enableEventListeners();


let currentAction = "Translate"; //first action (default)

function createMenu(x, y, selectedText) //Function to create
{
    removeMenu(); //Ensure no old inactive menus

    const menu = document.createElement('div'); //Create div
    menu.id = 'context-menu'; //Name menu
    menu.style.left = `${x}px`; //Set x pos
    menu.style.top = `${y}px`; //Set y pos


    //Toggle button
    const toggleButton = document.createElement('button');
    toggleButton.id = "toggle-button";
    toggleButton.textContent = "🔄";
    toggleButton.addEventListener('click', () => {
    currentAction = currentAction === "Translate" ? "Summarize" : "Translate"; //Sets the value of the main button
    mainButton.textContent = currentAction;
    });

    //Action button
    const mainButton = document.createElement('button');
    mainButton.id = "main-button";
    mainButton.textContent = currentAction;
    mainButton.addEventListener('click', () => {
    console.log(`${currentAction} button clicked`);


    //Handles action of features
    if (currentAction === "Translate")
    {
      const json = {
        text: selectedText,
        request_type: "translate",
        source_lang: "eng",
        target_lang: "fra",
      };


      fetch('https://jhello.xyz/json_post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(json)
      })
      .then(response => response.json())
      .then(result => {
        console.log("Response:", result);
        createresponseWindow("Translated Text", result['text'], x, y);
      });


    }
    else //summarize logic
    {
        const json = {
          text: selectedText,
          request_type: "summarize",
        };

        fetch('https://jhello.xyz/json_post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(json)
        })
        .then(response => response.json())
        .then(result => {
          console.log("Response:", result);
          createresponseWindow("Summarized Text", result[0]['summary_text'], x, y);
        });


    }
    });

    menu.appendChild(toggleButton);
    menu.appendChild(mainButton);
    document.body.appendChild(menu);
}

//Removes the menu from the screen
function removeMenu()
{
    const menu = document.getElementById('context-menu');
    if (menu)
    {
    document.body.removeChild(menu);
    }
}

