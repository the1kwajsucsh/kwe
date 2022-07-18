import React from "react";

const PhoneFooter = ({handleSubmit, handleChange, input}) => {
  return (
    <div className="footerHbox phone-left-right-border">
      <div className="flex">
        <img src={process.env.PUBLIC_URL +  "/svg/camera.svg"} className="icon" alt="Camera icon"/>
      </div>
      <div className="flex">
        <img src={process.env.PUBLIC_URL +  "/svg/connect.svg"} className="icon" alt="Connect icon"/>
      </div>
      <div className="sendHbox">
        <div className="flex">
          <form onSubmit={handleSubmit}>
            <input className="iosInput" type="text" placeholder="iMessage" value={input} onChange={handleChange} />
          </form>
        </div>
        <div className="flex">
          <img src={process.env.PUBLIC_URL +  "/svg/microphone.svg"} className="icon" alt="Microphone icon"/>
        </div>
      </div>
    </div>
  );
};

export default PhoneFooter;