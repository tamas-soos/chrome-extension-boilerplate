import start from "./app.js";

chrome.runtime.sendMessage({}, (response) => {
  var checkReady = setInterval(() => {
    if (document.readyState === "complete") {
      clearInterval(checkReady);
      console.log("We're in the injected content script!");

      start();

      //   setTimeout(() => {
      //     chrome.runtime.sendMessage("capture", (response) => {
      //       console.log("content response", response);
      //     });
      //   }, 5000);
    }
  });
});
