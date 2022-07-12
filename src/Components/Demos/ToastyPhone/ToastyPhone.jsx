import React, {useEffect, useState} from "react";
import "./messenger.css";
import MessageSequence from "./MessageSequence";
import {MathUtils} from "three";
import structuredClone from '@ungap/structured-clone';
import { parseInput } from "./InputParser";
import { FaSignal } from 'react-icons/fa';
import { BiWifi } from 'react-icons/bi';
import { BsBatteryFull } from "react-icons/bs"

const ToastyPhone = () => {
  const [input, updateInput] = useState("");
  const [messageSequence, updateMessages] = useState([]);
  const [lastSender, setLastSender] = useState(null);
  const [curTime, setCurTime] = useState(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: false }))

  let timeAtLoad = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  useEffect(() => {
    const elem = document.getElementById('chat');
    if (elem) {
      elem.scrollTop = elem.scrollHeight;
    }
  }, [messageSequence]);

  const handleSubmit = function (event) {
    event.preventDefault();

    const message = {
      content: input,
      isLast: true,
    };

    const responseMessage = parseInput(input);
    const responseSequence = {messages: [responseMessage], sender: "yours"};

    if (lastSender !== "mine") {
      const inputSequence = {messages: [message], sender: "mine"};

      if (responseMessage) {
        setLastSender("yours");
        updateMessages([...messageSequence, inputSequence, responseSequence]);
      } else {
        setLastSender("mine");
        updateMessages([...messageSequence,inputSequence]);
      }
    } else {
      const cloneOfSequence = structuredClone(messageSequence);
      const lastSequence = cloneOfSequence.pop();

      const lastMessage = lastSequence.messages.pop();
      lastMessage.isLast = false;

      lastSequence.messages.push(lastMessage);
      lastSequence.messages.push(message);

      cloneOfSequence.push(lastSequence);

      if (responseMessage) {
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
      <div className="phone-header phone-left-right-border">
        <div className="grid-container">
          <div className="grid-item">
            <p className="center"><strong>{curTime}</strong></p>
          </div>
          <div className="grid-item" />
          <div className="grid-item">
            <p className="center iosFont">
              <FaSignal />
              <BiWifi />
              <BsBatteryFull />
            </p>
          </div>
          <div className="grid-item">
            <p className="center iosFont">4</p>
          </div>
          <div className="grid-item">
            <p className="center iosFont">5</p>
          </div>
          <div className="grid-item" />
        </div>
      </div>
      <div id="chat" className="chat phone-left-right-border">
        <div>
          <p className="iMessageText">iMessage<br/>Today {timeAtLoad}</p>
        </div>
        {messageSequence.map((msg) => <MessageSequence key={MathUtils.generateUUID()} messageSequence={msg} sender={msg.sender}/>)}
      </div>
      <div className="footerHbox phone-left-right-border">
        <div className="flex">
          <img src={process.env.PUBLIC_URL +  "/svg/camera.svg"} className="icon"/>
        </div>
        <div className="flex">
          <img src={process.env.PUBLIC_URL +  "/svg/connect.svg"} className="icon"/>
        </div>
        <div className="sendHbox">
          <div className="flex">
            <form onSubmit={handleSubmit}>
              <input className="iosInput" type="text" placeholder="iMessage" value={input} onChange={handleChange} />
            </form>
          </div>
          <div className="flex">
            <img src={process.env.PUBLIC_URL +  "/svg/microphone.svg"} className="icon"/>
          </div>
        </div>
      </div>
    </div>
  )
};

export default ToastyPhone;