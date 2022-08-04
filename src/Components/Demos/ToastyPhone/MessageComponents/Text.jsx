import React from "react";

const Text = ({msg}) => {
  return (
    <div className={"message" + (msg.isLast ? " last" : "") + (msg.type && msg.type === "AUDIO" ? " message-audio" : "")}>
      {msg.content}
    </div>
  )
};

export default Text;