import React from "react";

const Content = ({msg, overlaySetters}) => {
  return (
    <div className={"message" + (msg.isLast ? " last" : "")}>
      {React.cloneElement(msg.content, {overlaySetters: overlaySetters})}
    </div>
  )
};

export default Content;