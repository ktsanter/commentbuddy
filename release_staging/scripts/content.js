// respond to request from background.js
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "comment_buddy_request" ) {
      console.log("received comment buddy request message");
      var selectedText = window.getSelection().toString();
      console.log('responding with selected text: ' + selectedText);
      
      sendResponse({"message": "selected_text", "data": selectedText});
    }
  }
);