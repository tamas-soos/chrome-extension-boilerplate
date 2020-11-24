import start from "./app.js";
import start_lara_app from "./_lara/app.js";

console.log("web content script");

chrome.runtime.sendMessage({}, (response) => {
  console.log("response", response);

  var checkReady = setInterval(() => {
    if (document.readyState === "complete") {
      clearInterval(checkReady);
      // console.log("We're in the injected content script!");

      start();
      // TODO add branching
      // start_lara_app();

      console.log("after everything");

      //   setTimeout(() => {
      //     chrome.runtime.sendMessage("capture", (response) => {
      //       console.log("content response", response);
      //     });
      //   }, 5000);
    }
  });
});
