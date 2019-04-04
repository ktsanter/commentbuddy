// on install/update of extension create a right-click menu item
chrome.runtime.onInstalled.addListener(function (e) {
  chrome.contextMenus.create({
    title: 'add selected text to CommentBuddy repository', 
    contexts:["selection"], 
    onclick: addSelectedTextToRepository
  });
});

// handler for context menu selection
function addSelectedTextToRepository(e) {
  chrome.storage.sync.set({"cbCommentText": e.selectionText}, function() {
    chrome.tabs.create({url: "savecomment.html"});
  });
}
