import React, {useEffect, useState} from "react";
import {getAverageVolumeArray, getDuration} from "./AudioAnalyzer";

const VOLUME_HEIGHT = 23.6;

const VoiceMessage = ({audioSource = process.env.PUBLIC_URL + "/audio/sampulator.mp3"}) => {
  const [duration, setDuration] = useState("00:00");
  const [volumes, setVolumes] = useState(new Array(32));

  useEffect(() => {
    (async function fetchVolumes() {
      setVolumes(await getAverageVolumeArray(audioSource));
      setDuration(await getDuration(audioSource));

      if (elem) {
        elem.scrollTop = elem.scrollHeight;
      }
    })();
    const elem = document.getElementById('chat');
  }, [audioSource]);


  return (
    <div style={{display: "flex", alignItems: "center"}}>
      <div style={{display: "inline-flex"}}>
        {volumes.map((volume, index) => {
          return <div
            key={index}
            style={{
              backgroundColor: "black",
              height: volume * VOLUME_HEIGHT,
              width: 2,
              marginRight: "1px",
              marginTop: (VOLUME_HEIGHT - volume * VOLUME_HEIGHT) / 2 + "px",
              marginBottom: (VOLUME_HEIGHT - volume * VOLUME_HEIGHT) / 2 + "px"
            }}
          />
        })}
      </div>
      <div style={{display: "inline-flex", paddingLeft: "0.3em"}}>
        <p style={{margin: "0", fontSize: "12px"}}>
          {duration}
        </p>
      </div>
    </div>
  );
};

export default VoiceMessage;