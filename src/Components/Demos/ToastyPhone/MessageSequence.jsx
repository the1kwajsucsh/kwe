import React from "react";
import Text from "./MessageComponents/Text";
import Audio from "./MessageComponents/Audio";
import Image from "./MessageComponents/Image";

const MessageSequence = ({messageSequence = [], sender = "mine"}) => {
  return (
    <div className={"messages " + sender}>
      {messageSequence.messages.map((msg, id) => {
        switch(msg.type) {
          case "AUDIO":
            return <Audio msg={msg}/>;
          case "IMAGE":
            return <Image msg={msg}/>
          case "TEXT":
          case "GREETING":
          default:
            return <Text msg={msg}/>;
        }
      })}
    </div>
  )
};
export default MessageSequence;