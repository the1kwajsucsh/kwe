import React from "react";

const Content = ({msg, overlaySetters}) => {
  return (
    <div>
      {React.cloneElement(msg.content, {overlaySetters: overlaySetters})}
    </div>
  )
};

export default Content;