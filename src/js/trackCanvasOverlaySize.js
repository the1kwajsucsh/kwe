export const updateCanvasToOverlaySize = (frequency, duration) => {
  const overlayContainer = document.getElementById("content-overlay");
  const canvas = document.getElementById("canvas");
  const canvasChildDiv = canvas.childNodes[0];
  const actualCanvas = canvasChildDiv.childNodes[0];

  overlayContainer.style.transition = "all 2s ease-in-out";
  actualCanvas.style.opacity = 0;
  actualCanvas.style.transition = "opacity ease-in-out 0.8s";

  const loopInterval = setInterval(() => {
    const overlayWidth = overlayContainer.offsetWidth;
    const overlayHeight = overlayContainer.offsetHeight;

    canvas.style.width = overlayWidth + "px";
    canvas.style.height = overlayHeight + "px";

    canvasChildDiv.style.width = overlayWidth + "px";
    canvasChildDiv.style.height = overlayHeight + "px";

    actualCanvas.style.width = overlayWidth + "px";
    actualCanvas.style.height = overlayHeight + "px";
  }, frequency);

  setTimeout(() => {
    clearInterval(loopInterval);

    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvasChildDiv.style.width = "100%";
    canvasChildDiv.style.height = "100%";
    overlayContainer.style.transition = "";


    setTimeout(() => {
      actualCanvas.style.opacity = "100%";
    }, 30);

  }, duration);
};