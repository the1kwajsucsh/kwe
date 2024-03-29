import React, {useEffect, useState} from "react";
import "./messenger.css";
import {parseInput} from "./Parsing/InputParser";
import PhoneHeader from "./PhoneHeader";
import PhoneFooter from "./PhoneFooter";
import MessageSequence from "./MessageSequence";

const ToastyPhone = ({overlaySetters}) => {
  const [input, updateInput] = useState("");
  const [messageSequence, updateMessages] = useState([]);
  const [lastSender, setLastSender] = useState(null);
  const [timeAtLoad] = useState(new Date().toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'}));

  useEffect(() => {
    const elem = document.getElementById('chat');
    if (elem) {
      elem.scrollTop = elem.scrollHeight;
    }
  }, [messageSequence]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (/^\s*$/.test(input)) {
      updateInput('');
      return;
    }

    const message = {
      content: input,
      isLast: true,
    };

    const responseMessages = parseInput(input);
    const responseSequence = {messages: responseMessages, sender: "yours"};

    if (lastSender !== "mine") {
      const inputSequence = {messages: [message], sender: "mine"};

      if (responseMessages) {
        setLastSender("yours");
        updateMessages([...messageSequence, inputSequence, responseSequence]);
      } else {
        setLastSender("mine");
        updateMessages([...messageSequence, inputSequence]);
      }
    } else {
      const lastSequence = messageSequence[messageSequence.length - 1];
      const lastMessage = lastSequence.messages.pop();
      lastMessage.isLast = false;

      lastSequence.messages.push(lastMessage);
      lastSequence.messages.push(message);

      const shallowCopy = messageSequence.slice(0, messageSequence.length - 1);
      shallowCopy.push(lastSequence);

      if (responseMessages) {
        setLastSender("yours");
        shallowCopy.push(responseSequence);
      }

      updateMessages(shallowCopy);
    }

    updateInput('');
  };

  const handleChange = function (event) {
    event.preventDefault();
    updateInput(event.target.value);
  };

  return (
    <div className="phoneContainer" style={{backgroundColor: "white"}}>
      <PhoneHeader/>
      <div id="chat" className="chat phone-left-right-border">
        <div>
          <p className="iMessageText">iMessage<br/>Today {timeAtLoad}</p>
        </div>
        {messageSequence.map((msg, id) =>
          <MessageSequence
            key={id}
            messageSequence={msg}
            sender={msg.sender}
            overlaySetters={overlaySetters}
          />
        )}
      </div>
      <PhoneFooter handleSubmit={handleSubmit} handleChange={handleChange} input={input}/>
    </div>
  )
};

export default ToastyPhone;