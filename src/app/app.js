import Highlighter from "web-highlighter";
import html2canvas from "html2canvas";
// import { areaHiglhightStuff } from "./area.js";

class LocalStore {
  constructor(id) {
    this.key =
      id !== undefined ? `highlight-mengshou-${id}` : "highlight-mengshou";
  }

  storeToJson() {
    const store = localStorage.getItem(this.key);
    let sources;
    try {
      sources = JSON.parse(store) || [];
    } catch (e) {
      sources = [];
    }
    return sources;
  }

  jsonToStore(stores) {
    localStorage.setItem(this.key, JSON.stringify(stores));
  }

  save(data) {
    const stores = this.storeToJson();
    const map = {};
    stores.forEach((store, idx) => (map[store.hs.id] = idx));

    if (!Array.isArray(data)) {
      data = [data];
    }

    data.forEach((store) => {
      // update
      if (map[store.hs.id] !== undefined) {
        stores[map[store.hs.id]] = store;
      }
      // append
      else {
        stores.push(store);
      }
    });
    this.jsonToStore(stores);
  }

  forceSave(store) {
    const stores = this.storeToJson();
    stores.push(store);
    this.jsonToStore(stores);
  }

  remove(id) {
    const stores = this.storeToJson();
    let index = null;
    for (let i = 0; i < stores.length; i++) {
      if (stores[i].hs.id === id) {
        index = i;
        break;
      }
    }
    stores.splice(index, 1);
    this.jsonToStore(stores);
  }

  getAll() {
    return this.storeToJson();
  }

  removeAll() {
    this.jsonToStore([]);
  }
}

const getDocument = (elm) => (elm || {}).ownerDocument || document;

const getWindow = (elm) => (getDocument(elm) || {}).defaultView || window;

const isHTMLCanvasElement = (elm) =>
  elm instanceof HTMLCanvasElement ||
  elm instanceof getWindow(elm).HTMLCanvasElement;

function getAreaAsPNG(canvas, position) {
  const { left, top, width, height } = position;

  const doc = canvas ? canvas.ownerDocument : null;
  const newCanvas = doc && doc.createElement("canvas");

  if (!newCanvas || !isHTMLCanvasElement(newCanvas)) {
    return "";
  }

  newCanvas.width = width;
  newCanvas.height = height;

  const newCanvasContext = newCanvas.getContext("2d");

  if (!newCanvasContext || !canvas) {
    return "";
  }

  const dpr = window.devicePixelRatio;

  newCanvasContext.drawImage(
    canvas,
    left * dpr,
    top * dpr,
    width * dpr,
    height * dpr,
    0,
    0,
    width,
    height
  );

  return newCanvas.toDataURL("image/png");
}

let started = false;
let areaSelection = {};

function screenshot() {
  document.addEventListener("keydown", (event) => {
    if (event.altKey) {
      const body = document.querySelector("body");
      body.setAttribute("style", "cursor: crosshair");
    }
  });

  document.addEventListener("keyup", (event) => {
    const body = document.querySelector("body");
    body.setAttribute("style", "cursor: default");
  });

  document.addEventListener("mousedown", (event) => {
    started = event.altKey;

    if (!started) return;

    event.preventDefault();

    areaSelection = {
      x: event.clientX,
      y: event.clientY,
    };
  });

  document.addEventListener("mousemove", (event) => {
    if (!started) return;
    event.preventDefault();
  });

  document.addEventListener("mouseup", (event) => {
    if (!started) return;

    event.preventDefault();

    started = false;

    console.log("takeScreenshot");

    takeScreenshot(event);
  });
}

function takeScreenshot(event) {
  chrome.runtime.sendMessage("capture", (dataURL) => {
    const clientRect = document.body.getBoundingClientRect();

    const x1 = areaSelection.x - clientRect.left;
    const y1 = areaSelection.y - clientRect.top;
    const x2 = event.clientX - clientRect.left;
    const y2 = event.clientY - clientRect.top;

    const bounds = [
      Math.min(x1, x2),
      Math.min(y1, y2),
      Math.max(x1, x2),
      Math.max(y1, y2),
    ];

    const position = {
      left: Math.min(bounds[0], bounds[2]),
      top: Math.min(bounds[1], bounds[3]),
      width: Math.abs(bounds[0] - bounds[2]),
      height: Math.abs(bounds[1] - bounds[3]),
    };

    // ##################################################

    const canvas = document.createElement("canvas");
    canvas.setAttribute("width", `${position.width}px`);
    canvas.setAttribute("height", `${position.height}px`);
    canvas.setAttribute("display", `none`);
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    let myImage;
    const img = new Image();
    img.src = dataURL;
    img.onload = () => {
      // ctx.drawImage(img, 0, 0, 1920, 1080, 0, 0, 1920, 1080);
      ctx.drawImage(
        img,
        position.left,
        position.top,
        position.width,
        position.height,
        0,
        0,
        position.width,
        position.height
      );
      ctx.save();

      //create a new data URL
      myImage = canvas.toDataURL();
      console.log("myImage", myImage);
    };

    // ##################################################

    drawAreaSelection(bounds);
  });
}

// function takeScreenshot(event) {
//   chrome.runtime.sendMessage("capture", (response) => {
//     console.log("content response", response);
//   });

//   html2canvas(document.body, { allowTaint: true }).then(function (canvas) {
//     // const img = canvas.toDataURL();
//     // console.log("img", img);

//     const clientRect = document.body.getBoundingClientRect();
//     console.log("clientRect", clientRect);

//     const x1 = areaSelection.x - clientRect.left;
//     const y1 = areaSelection.y - clientRect.top;
//     const x2 = event.clientX - clientRect.left;
//     const y2 = event.clientY - clientRect.top;

//     // const x1 = areaSelection.x;
//     // const y1 = areaSelection.y;
//     // const x2 = event.clientX;
//     // const y2 = event.clientY;

//     const bounds = [
//       Math.min(x1, x2),
//       Math.min(y1, y2),
//       Math.max(x1, x2),
//       Math.max(y1, y2),
//     ];

//     console.log("bounds", bounds);

//     const position = {
//       left: Math.min(bounds[0], bounds[2]),
//       top: Math.min(bounds[1], bounds[3]),
//       width: Math.abs(bounds[0] - bounds[2]),
//       height: Math.abs(bounds[1] - bounds[3]),
//     };

//     // const screenshot = getAreaAsPNG(page.canvas, position);
//     const screenshot = getAreaAsPNG(canvas, position);
//     console.log("screenshot", screenshot);

//     drawAreaSelection(bounds);
//   });
// }

function drawAreaSelection(bounds) {
  const div = document.createElement("div");

  div.setAttribute(
    "style",
    `
      position: absolute;
      background-color: red;
      opacity: 0.5;
      left: ${Math.min(bounds[0], bounds[2])}px; 
      top: ${Math.min(bounds[1], bounds[3])}px; 
      width: ${Math.abs(bounds[0] - bounds[2])}px; 
      height: ${Math.abs(bounds[1] - bounds[3])}px;
    `
  );

  document.body.appendChild(div);
}

export default function start() {
  console.log("main app start");

  const highlighter = new Highlighter({
    exceptSelectors: ["pre", "code"],
  });

  const store = new LocalStore();

  // add some listeners to handle interaction, such as hover
  highlighter
    .on("selection:hover", ({ id }) => {
      // display different bg color when hover
      highlighter.addClass("highlight-wrap-hover", id);
    })
    .on("selection:hover-out", ({ id }) => {
      // remove the hover effect when leaving
      highlighter.removeClass("highlight-wrap-hover", id);
    })
    .on("selection:create", ({ sources }) => {
      sources = sources.map((hs) => ({ hs }));
      // save to backend
      store.save(sources);
    });

  // retrieve data from store, and display highlights on the website
  store.getAll().forEach(
    // hs is the same data saved by 'store.save(sources)'
    ({ hs }) => highlighter.fromStore(hs.startMeta, hs.endMeta, hs.text, hs.id)
  );

  // auto-highlight selections
  highlighter.run();

  // areaHiglhightStuff();

  screenshot();

  console.log("main app end");
}
