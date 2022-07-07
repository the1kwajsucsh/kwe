import React, {useState} from "react";
import "./messenger.css";
import MessageSequence from "./MessageSequence";
import {MathUtils} from "three";
import structuredClone from '@ungap/structured-clone';

const ToastyPhone = () => {
  const [input, updateInput] = useState("");
  const [messageSequence, updateMessages] = useState([]);
  const [lastSender, setLastSender] = useState(null);

  const handleSubmit = function (event) {
    event.preventDefault();

    const message = {
      content: input,
      isLast: true,
    };

    if (lastSender !== "mine") {
      setLastSender("mine");
      updateMessages([...messageSequence, {messages: [message], sender: "mine"}]);
    } else {
      const cloneOfSequence = structuredClone(messageSequence);
      const lastSequence = cloneOfSequence.pop();

      const lastMessage = lastSequence.messages.pop();
      lastMessage.isLast = false;

      lastSequence.messages.push(lastMessage);
      lastSequence.messages.push(message);

      cloneOfSequence.push(lastSequence);

      updateMessages(cloneOfSequence);
    }

    updateInput('');
  };

  const handleChange = function (event) {
    event.preventDefault();
    updateInput(event.target.value)
  };

  return (
    <div className="phoneContainer">
      <div className="chat">
        {messageSequence.map((msg) => <MessageSequence key={MathUtils.generateUUID()} messageSequence={msg} sender={msg.sender}/>)}
      </div>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={input} onChange={handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  )
};

export default ToastyPhone;