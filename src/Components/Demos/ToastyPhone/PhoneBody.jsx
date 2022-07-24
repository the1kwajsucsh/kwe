import React, {useEffect, useState} from "react";
import MessageSequence from "./MessageSequence";

const PhoneBody = ({messageSequence}) => {
  const [timeAtLoad] = useState(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit'}));

  useEffect(() => {
    const elem = document.getElementById('chat');
    if (elem) {
      elem.scrollTop = elem.scrollHeight;
    }
  }, [messageSequence]);

  return (
    <div id="chat" className="chat phone-left-right-border">
      <div>
        <p className="iMessageText">iMessage<br/>Today {timeAtLoad}</p>
      </div>
      {messageSequence.map((msg, id) =>
        <MessageSequence
          key={id}
          messageSequence={msg}
          sender={msg.sender}
        />
      )}
    </div>
  );
};

const MemoizedPhoneBody = React.memo(PhoneBody);
export default MemoizedPhoneBody;