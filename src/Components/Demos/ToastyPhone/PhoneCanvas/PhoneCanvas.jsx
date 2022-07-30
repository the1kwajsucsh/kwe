import React from "react";
import {updateCanvasToOverlaySize} from "../../../../js/trackCanvasOverlaySize";
import SplineSquares from "../../SpineSquares/SplineSquares";

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
   <div id="phone-canvas-holder">
     <div className="phone-canvas" style={{width: "100px", height: "100px"}} onClick={populateOverlay}/>
   </div>
  );
};

export default PhoneCanvas;