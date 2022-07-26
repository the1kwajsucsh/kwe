import React from "react";

const Image = ({msg}) => {
  return (
    <img className="message-image" src={msg.content} alt="Toasty Digital Art"/>
  )
};

export default Image;