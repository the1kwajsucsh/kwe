import React from "react";

const Audio = ({msg}) => {
  return (
    <div className={"message message-audio" + (msg.isLast ? " last" : "")}>
      {msg.content}
    </div>
  )
};

export default Audio;