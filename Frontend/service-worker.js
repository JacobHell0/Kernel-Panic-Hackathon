chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Service Worker received message:", message);
  
    if (message.action === "extractText") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "extractText" }, (response) => {
            if (response && response.extractedText) {
              console.log("Extracted text from the page:", response.extractedText);
            } else {
              console.error("Failed to extract text");
            }
          });
        }
      });
  
      sendResponse({ status: "Message received, processing started" });
    }
  });
  