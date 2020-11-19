const getDocument = (elm) => (elm || {}).ownerDocument || document;

const getWindow = (elm) => (getDocument(elm) || {}).defaultView || window;

const isHTMLCanvasElement = (elm) =>
  elm instanceof HTMLCanvasElement ||
  elm instanceof getWindow(elm).HTMLCanvasElement;

function getAreaAsPNG(canvas, position) {
  const { left, top, width, height } = position;

  const doc = canvas ? canvas.ownerDocument : null;
  const newCanvas = doc && doc.createElement("canvas");

  // if (!newCanvas || !isHTMLCanvasElement(newCanvas)) {
  //   return "";
  // }

  newCanvas.width = width;
  newCanvas.height = height;

  const newCanvasContext = newCanvas.getContext("2d");

  // if (!newCanvasContext || !canvas) {
  //   return "";
  // }

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

export function areaHiglhightStuff() {
  let areaSelection = {};

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

    // const pageIndex =
    //   window.PDFViewerApplication.pdfViewer.currentPageNumber - 1;
    // const page = window.PDFViewerApplication.pdfViewer.getPageView(pageIndex);
    // const pageElement = page.canvas.parentElement;
    // const pageRect = page.canvas.getClientRects()[0];
    // const viewport = page.viewport;

    const x1 = areaSelection.x;
    const y1 = areaSelection.y;
    const x2 = event.clientX;
    const y2 = event.clientY;

    // areaSelection = {
    //   ...areaSelection,
    //   w: Math.abs(areaSelection.x - event.clientX),
    //   h: Math.abs(areaSelection.y - event.clientY),
    //   x2,
    //   y2,
    // };

    // console.log("areaSelection", areaSelection);

    // const selectionRect = {
    // const bounds = {
    //   left: Math.min(x1, x2),
    //   top: Math.min(y1, y2),
    //   right: Math.max(x1, x2),
    //   bottom: Math.max(y1, y2),
    // };

    const bounds = [
      Math.min(x1, x2),
      Math.min(y1, y2),
      Math.max(x1, x2),
      Math.max(y1, y2),
    ];

    // console.log("selectionRect", selectionRect);

    // const rect = viewport
    //   .convertToPdfPoint(
    //     selectionRect.left - pageRect.x,
    //     selectionRect.top - pageRect.y
    //   )
    //   .concat(
    //     viewport.convertToPdfPoint(
    //       selectionRect.right - pageRect.x,
    //       selectionRect.bottom - pageRect.y
    //     )
    //   );

    // const bounds = viewport.convertToViewportRectangle(rect);

    console.log("bounds", bounds);

    const bodyEl = document.querySelector("body");
    const canvas = document.createElement("canvas");
    const div = document.createElement("div");

    canvas.setAttribute(
      "style",
      `
        position: absolute;
        left: ${Math.min(bounds[0], bounds[2])}px; 
        top: ${Math.min(bounds[1], bounds[3])}px; 
        width: ${Math.abs(bounds[0] - bounds[2])}px; 
        height: ${Math.abs(bounds[1] - bounds[3])}px;
        margin: 0;
        background: initial;
      `
    );

    bodyEl.appendChild(canvas);

    const position = {
      left: Math.min(bounds[0], bounds[2]),
      top: Math.min(bounds[1], bounds[3]),
      width: Math.abs(bounds[0] - bounds[2]),
      height: Math.abs(bounds[1] - bounds[3]),
    };

    // const screenshot = getAreaAsPNG(page.canvas, position);
    const screenshot = getAreaAsPNG(canvas, position);
    console.log("screenshot", screenshot);
    window.screenshot = screenshot;
    window.alma = "alma";

    bodyEl.appendChild(div);

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

    // canvas.remove();

    started = false;
  });
}
