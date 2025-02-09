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



let currentAction = "Summarize"; //first action (default)

function createMenu(x, y, selectedText) //Function to create
{
    removeMenu(); //Ensure no old inactive menus

    const menu = document.createElement('div'); //Create div
    menu.id = 'context-menu'; //Name menu
    menu.style.left = `${x}px`; //Set x pos
    menu.style.top = `${y}px`; //Set y pos

    //Language selection drop opt
    const languageOptions =
    {
        "eng": "English",
        "ces": "Czech",
        "dan": "Danish",
        "nld": "Dutch",
        "est": "Estonian",
        "fin": "Finnish",
        "fra": "French",
        "deu": "German",
        "ell": "Greek",
        "ita": "Italian",
        "nor": "Norwegian",
        "pol": "Polish",
        "por": "Portuguese",
        "slv": "Slovene",
        "spa": "Spanish",
        "swe": "Swedish",
        "tur": "Turkish"
    };

    const srcLangSelect = document.createElement('select');
    srcLangSelect.classList.add("language-select");
    for (const [code, name] of Object.entries(languageOptions))
    {
        let option = document.createElement('option');
        option.value = code;
        option.textContent = name;
        srcLangSelect.appendChild(option);
    }

    const targetLangSelect = document.createElement('select');
    targetLangSelect.classList.add("language-select");
    for (const [code, name] of Object.entries(languageOptions))
    {
        let option = document.createElement('option');
        option.value = code;
        option.textContent = name;
        targetLangSelect.appendChild(option);
    }

     //Column Option Stack
     const colStackOptions = document.createElement('div');
     colStackOptions.id = "colStackOptions";
     colStackOptions.appendChild(srcLangSelect);
     colStackOptions.appendChild(targetLangSelect);
     colStackOptions.style.display = currentAction === "Translate" ? "flex" : "none";


    //Toggle button
    const toggleButton = document.createElement('button');
    toggleButton.id = "toggle-button";
    toggleButton.textContent = "🔄";
    toggleButton.addEventListener('click', () => {
        currentAction = currentAction === "Translate" ? "Summarize" : "Translate"; //Sets the value of the main button
        mainButton.textContent = currentAction;
        //Display option depending on choice
        colStackOptions.style.display = currentAction === "Translate" ? "flex" : "none";
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
        const sourceLang = srcLangSelect.value; //Source language
        const targetLang = targetLangSelect.value; //Target language

        const json = {
        text: selectedText,
        request_type: "translate",
        source_lang: sourceLang,
        target_lang: targetLang,
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
        createresponseWindow(`Translation (${languageOptions[sourceLang]} to ${languageOptions[targetLang]})`, result['text'], x, y);
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

    // Initially hide language selection if "Summarize" is selected
    if (currentAction === "Summarize") {
        colStackOptions.style.display = "none";
    }

    //Add all the elements to the menu
    menu.appendChild(toggleButton);
    const buttonWrapper = document.createElement('div');
    buttonWrapper.id = "button-wrapper";
    buttonWrapper.appendChild(mainButton);
    buttonWrapper.appendChild(colStackOptions);
    menu.appendChild(buttonWrapper);
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

