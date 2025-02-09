console.log("Content script is running");


//Extract highlighted text from screen
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => 
{
    if (message.action === "extractText") 
    {
        console.log("Extracting text from the page...");
        const bodyText = document.body.innerText;
        console.log("Extracted Text:", bodyText);

        sendResponse({extractedText: bodyText });
    }
});

//Detect mouse up event to create menu after highlight text
document.addEventListener('mouseup', (e) => {
  const selection = window.getSelection();
  if (selection.toString().length > 0) 
    {
    setTimeout(() => { //Set delay to ensure menu appears after click release

      const menu = document.getElementById('context-menu'); //Label element
      
      if (!menu) 
      {
        createMenu(e.pageX, e.pageY, selection.toString());
      }
    }, 100);
  } 
  else 
  {
    removeMenu();
  }
});

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
        createresponseWindow("Translation from x to y", selectedText, x, y);
    } 
    else 
    {
        createresponseWindow("Summarized Text", "Your text should now be summarized!", x, y);
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

//Removes the menu when you click off
document.addEventListener('click', (event) => {
    const menu = document.getElementById('context-menu');
    if (menu && !menu.contains(event.target)) 
    {
    removeMenu();
    }
});
