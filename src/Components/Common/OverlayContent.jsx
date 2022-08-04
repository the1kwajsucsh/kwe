import React from "react";
import {IoCloseSharp} from "react-icons/io5";
import {updateCanvasToOverlaySize} from "../../js/trackCanvasOverlaySize";


const OverlayContent = ({content, classes, overlaySetters}) => {

  const resetOverlay = () => {
    overlaySetters.setOverlayClasses("",
      setTimeout(() => {
        overlaySetters.setOverlayContent(null);
      }, 2000));

    updateCanvasToOverlaySize(15, 2500)
  };

  return (
    content &&
    <div id="content-overlay" className={"content-overlay " + classes}>
      <button id="overlay-close-button" className="overlay-close-button" style={{opacity: 0}} onClick={resetOverlay}>
        <IoCloseSharp id="overlay-close" className="overlay-close"/>
      </button>
      {content}
    </div>
  );
};

export default OverlayContent;