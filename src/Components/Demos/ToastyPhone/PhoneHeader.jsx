import React, {useEffect, useState} from "react";
import { FaSignal } from 'react-icons/fa';
import {IoIosArrowForward, IoIosArrowBack, IoIosBatteryFull, IoIosWifi} from "react-icons/io"

const PhoneHeader = () => {
  const [curTime, setCurTime] = useState(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: false }));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurTime(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: false }));
    }, 10*1000);
    return () => clearInterval(interval);
  }, []);

  return (
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
              <img src="https://pbs.twimg.com/profile_images/1521592428364505090/7VVIjH5j_400x400.jpg" className="avatar" alt="Toasty Digital Profile Avatar"/>
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
  );
};

export default PhoneHeader;