document.getElementById('toggleExtension').addEventListener('change', function() {
  console.log("disabled event listeners");
    // Send a message to content script
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'disableListeners' });
    });
  });

