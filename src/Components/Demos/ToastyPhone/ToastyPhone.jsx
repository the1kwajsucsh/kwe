import React, {useState} from "react";
import "./messenger.css";
import cloneDeep from 'lodash/cloneDeep';
import { parseInput } from "./InputParser";
import PhoneHeader from "./PhoneHeader";
import PhoneFooter from "./PhoneFooter";
import PhoneBody from "./PhoneBody";

const ToastyPhone = () => {
  const [input, updateInput] = useState("");
  const [messageSequence, updateMessages] = useState([]);
  const [lastSender, setLastSender] = useState(null);

  const handleSubmit = function (event) {
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
        updateMessages([...messageSequence,inputSequence]);
      }
    } else {
      const cloneOfSequence = cloneDeep(messageSequence);
      const lastSequence = cloneOfSequence.pop();

      const lastMessage = lastSequence.messages.pop();
      lastMessage.isLast = false;

      lastSequence.messages.push(lastMessage);
      lastSequence.messages.push(message);

      cloneOfSequence.push(lastSequence);

      if (responseMessages) {
        setLastSender("yours");
        cloneOfSequence.push(responseSequence);
      }

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
      <PhoneHeader />
      <PhoneBody messageSequence={messageSequence}/>
      <PhoneFooter handleSubmit={handleSubmit} handleChange={handleChange} input={input} />
    </div>
  )
};

export default ToastyPhone;