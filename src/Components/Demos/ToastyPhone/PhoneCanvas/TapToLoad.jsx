import React from "react";
import {IoIosArrowForward} from "react-icons/io"

const TapToLoad = (props) => {
  return (
    <div {...props} className="web-preview-message">
      <div className="web-preview-header">
        <p>Tap to Load</p>
      </div>
      <div className="web-preview-footer">
        <p style={{margin: "10px", display: "inline-block", fontSize: "12px"}}>
          KWE Demo
        </p>
        <IoIosArrowForward style={{display: "inline-block", float: "right", width: "20px", height: "20px", marginTop: "7px", marginRight: "5px"}}/>
      </div>
    </div>
  );
};

export default TapToLoad;