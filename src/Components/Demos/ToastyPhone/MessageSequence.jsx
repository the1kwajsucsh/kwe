import React from "react";
import {MathUtils} from "three";

const MessageSequence = ({messageSequence = [], sender = "mine"}) => {
  return (
    <div className={"messages " + sender}>
      {messageSequence.messages.map(msg => {
        return (
          <div key={MathUtils.generateUUID()} className={"message" + (msg.isLast ? " last" : "")}>
            {msg.content}
          </div>
        );
      })}
    </div>
  )
};

export default MessageSequence;