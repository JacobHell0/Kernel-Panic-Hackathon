function createresponseWindow(title, text, x, y) //Takes a title, the body text, and a position to put the window
{
  let responseWindow = document.getElementById("custom-responseWindow");

  if (!responseWindow) //Make sure response window does not already exist
    {
    responseWindow = document.createElement("div"); //create element
    responseWindow.id = "custom-responseWindow"; //Label window
    responseWindow.classList.add("responseWindow-hidden"); //start not shown

    //Window html
    responseWindow.innerHTML = `
      <div id="responseWindow-header">
        <span id="responseWindow-title">${title}</span>
        <button id="close-responseWindow">✖</button>
      </div>
      <hr id="responseWindow-divider">
      <div id="responseWindow-content">${text}</div>
    `;

    //Append window to screen
    document.body.appendChild(responseWindow);

    responseWindow.style.position = "absolute"; //Allow to reposition dynamically
    responseWindow.style.left = `${x}px`; //Set provided x pos
    responseWindow.style.top = `${y}px`; //set provided y pos

    setTimeout(() => adjustresponseWindowPosition(responseWindow), 10); //Stop from overflow view

    //Set time out count to ensure window on screen
    setTimeout(() => {
      responseWindow.classList.add("responseWindow-visible");
      responseWindow.classList.remove("responseWindow-hidden");
    }, 10);

    //Action on close
    document.getElementById("close-responseWindow").addEventListener("click", () => {
      responseWindow.classList.remove("responseWindow-visible");
      responseWindow.classList.add("responseWindow-hidden");
    });
  } 
  else 
  {
    document.getElementById("responseWindow-content").innerText = text;
    document.getElementById("responseWindow-title").innerText = title;
    responseWindow.style.left = `${x}px`; //Set x pos
    responseWindow.style.top = `${y}px`; //Set y pos

    setTimeout(() => adjustresponseWindowPosition(responseWindow), 10); //Ensure window stays on screen

    responseWindow.classList.add("responseWindow-visible");
    responseWindow.classList.remove("responseWindow-hidden");
  }
}

function adjustresponseWindowPosition(responseWindow) //Function to adjust window if overflowed
{
  const responseWindowRect = responseWindow.getBoundingClientRect(); //Get screen bounds
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let newLeft = parseInt(responseWindow.style.left, 10);
  let newTop = parseInt(responseWindow.style.top, 10);

    if (responseWindowRect.right > viewportWidth) //ensure window within screen horz
    {
    newLeft = viewportWidth - responseWindowRect.width - 15; //adjust to left to prevent overflow
    }
  
    if (newLeft < 0) 
    {
        newLeft = 10;
    }

    if (responseWindowRect.bottom > viewportHeight) //ensure window within vert restrict
    {
        newTop = viewportHeight - responseWindowRect.height - 15; //If the window is on the bottom, move it up
    }
    if (newTop < 0) 
    {
        newTop = 10; //Prevent window from going off top
    }

    //Change to the updated posit
    responseWindow.style.left = `${newLeft}px`;
    responseWindow.style.top = `${newTop}px`;
}