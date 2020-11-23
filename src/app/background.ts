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
  } else {
    console.log("else ");
    sendResponse({});
  }

  return true;
});

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   chrome.tabs.captureVisibleTab(null, {}, (dataUrl) => {
//     sendResponse({ imgSrc: dataUrl });
//   });
// });
