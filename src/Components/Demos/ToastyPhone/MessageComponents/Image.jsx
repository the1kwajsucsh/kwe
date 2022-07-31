import React, {useEffect} from "react";

const Image = ({msg}) => {

  useEffect(() => {
    setTimeout(() => {
      const elem = document.getElementById('chat');
      if (elem) {
        elem.scrollTop = elem.scrollHeight;
      }
    }, 10);
  }, []);

  return (
    <img className="message-image" src={msg.content} alt="Toasty Digital Art"/>
  )
};

export default Image;