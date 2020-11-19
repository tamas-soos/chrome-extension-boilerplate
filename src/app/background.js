function showPageAction(tabId, displayUrl) {
  console.log("displayUrl", displayUrl);
  // rewriteUrlClosure in viewer.js ensures that the URL looks like
  // chrome-extension://[extensionid]/http://example.com/file.pdf
  var url = /^chrome-extension:\/\/[a-p]{32}\/([^#]+)/.exec(displayUrl);
  if (url) {
    url = url[1];
    chrome.pageAction.setPopup({
      tabId: tabId,
      popup: "/pageAction/popup.html?file=" + encodeURIComponent(url),
    });
    chrome.pageAction.show(tabId);
  } else {
    console.log("Unable to get PDF url from " + displayUrl);
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background got a message!");
  console.log("message", message);

  if (message === "showPageAction" && sender.tab) {
    console.log("pdf viwer");
    showPageAction(sender.tab.id, sender.tab.url);
  }
  if (message === "capture") {
    console.log("capture");
    chrome.tabs.captureVisibleTab(null, {}, (dataUrl) => {
      console.log("dataUrl", dataUrl);
      sendResponse(dataUrl);
    });
  } else {
    console.log("else ");
    sendResponse({});
  }

  return true;
});
