document.getElementById('translate').addEventListener('click', () => {
  console.log("Translate button clicked");

  // Send a message to the service worker to start extracting text
  chrome.runtime.sendMessage({ action: "extractText" }, (response) => {
    if (response && response.status) {
      console.log(response.status);
    } else {
      console.error("No response from the service worker.");
    }
  });
});
