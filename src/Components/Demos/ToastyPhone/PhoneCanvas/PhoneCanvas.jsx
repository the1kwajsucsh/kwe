import React from "react";
import {updateCanvasToOverlaySize} from "../../../../js/trackCanvasOverlaySize";
import SplineSquares from "../../SpineSquares/SplineSquares";
import TapToLoad from "./TapToLoad";

const PhoneCanvas = ({overlaySetters}) => {

  const populateOverlay = () => {
    overlaySetters.setOverlayContent(
      <SplineSquares/>,
      setTimeout(() => {
        overlaySetters.setOverlayClasses("content-overlay-fullscreen");
        updateCanvasToOverlaySize(15, 2500)
      }, 1000)
    );
  };

  return (
    <TapToLoad onClick={populateOverlay}/>
  );
};

export default PhoneCanvas;