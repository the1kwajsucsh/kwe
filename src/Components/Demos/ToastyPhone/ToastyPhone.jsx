import React, {useEffect, useState} from "react";
import "./messenger.css";
import MessageSequence from "./MessageSequence";
import {MathUtils} from "three";
import structuredClone from '@ungap/structured-clone';
import { parseInput } from "./InputParser";
import { FaSignal } from 'react-icons/fa';
import {IoIosArrowForward, IoIosArrowBack, IoIosBatteryFull, IoIosWifi} from "react-icons/io"

const ToastyPhone = () => {
  const [input, updateInput] = useState("");
  const [messageSequence, updateMessages] = useState([]);
  const [lastSender, setLastSender] = useState(null);
  const [curTime, setCurTime] = useState(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: false }));
  const [timeAtLoad] = useState(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit'}));

  useEffect(() => {
    const elem = document.getElementById('chat');
    if (elem) {
      elem.scrollTop = elem.scrollHeight;
    }
  }, [messageSequence]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurTime(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: false }));
    }, 10*1000);
    return () => clearInterval(interval);
  }, []);

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
            <p className="center iosFont" style={{width: "100%", textAlign: "right"}}>
              <FaSignal style={{marginRight: "4px"}}/>
              <IoIosWifi style={{marginRight: "4px"}}/>
              <IoIosBatteryFull />
            </p>
          </div>
          <div className="grid-item">
            <p className="center iosFont" style={{left: "5%", top: "25%"}}>
              <IoIosArrowBack style={{fontSize: "22px"}} fill="#1777e2"/>
            </p>
          </div>
          <div className="grid-item">
            <div className="center" style={{height: "100%"}}>
              <div className="avatarHolder">
                <img src="https://pbs.twimg.com/profile_images/1521592428364505090/7VVIjH5j_400x400.jpg" className="avatar"/>
              </div>
              <p className="avatarName">
                Toasty
                <IoIosArrowForward fill="#818181" style={{transform: "translate(0, 2px)"}}/>
              </p>
            </div>
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