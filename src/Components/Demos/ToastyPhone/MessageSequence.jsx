import React from "react";
import Text from "./MessageComponents/Text";
import Audio from "./MessageComponents/Audio";
import Image from "./MessageComponents/Image";
import Content from "./MessageComponents/Content";

const MessageSequence = ({messageSequence = [], sender = "mine", overlaySetters}) => {
  return (
    <div className={"messages " + sender}>
      {messageSequence.messages.map((msg, id) => {
        switch(msg.type) {
          case "AUDIO":
            return <Audio msg={msg} key={id}/>;
          case "IMAGE":
            return <Image msg={msg} key={id}/>;
          case "CANVAS":
            return <Content msg={msg} key={id} overlaySetters={overlaySetters}/>;
          case "TEXT":
          default:
            return <Text msg={msg} key={id}/>;
        }
      })}
    </div>
  )
};
export default MessageSequence;