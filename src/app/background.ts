// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   console.log("Background got a message!");
//   sendResponse({});
// });

console.log("background is running");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background got a message!");
  console.log("message", message);

  if (message === "capture") {
    console.log("capture");
    chrome.tabs.captureVisibleTab(null, {}, (dataUrl) => {
      console.log("dataUrl", dataUrl);
      sendResponse(dataUrl);
    });
  } else if (message === "showPageAction") {
    console.log("RUN PDF CONTENT STUFF");
    sendResponse("pdf brnach");
  } else {
    console.log("else ");
    sendResponse("web");
  }

  return true;
});

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   chrome.tabs.captureVisibleTab(null, {}, (dataUrl) => {
//     sendResponse({ imgSrc: dataUrl });
//   });
// });
