import React from "react";

const MessageSequence = ({messageSequence = [], sender = "mine"}) => {
  return (
    <div className={"messages " + sender}>
      {messageSequence.messages.map((msg, id) => {
        return (
          <div
            key={id}
            className={"message" + (msg.isLast ? " last" : "") + (msg.type && msg.type === "AUDIO" ? " message-audio" : "")}
          >
            {msg.content}
          </div>
        );
      })}
    </div>
  )
};
export default MessageSequence;