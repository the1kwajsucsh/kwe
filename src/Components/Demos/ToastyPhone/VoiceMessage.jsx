import React, {useEffect, useState} from "react";
import {getAverageVolumeArray, getDuration} from "./AudioAnalyzer";
import AudioPlayer from "./AudioPlayer";

const VOLUME_HEIGHT = 23.6;

const VoiceMessage = ({audioSource = process.env.PUBLIC_URL + "/audio/sampulator.mp3"}) => {
  const [duration, setDuration] = useState(0);
  const [volumes, setVolumes] = useState(new Array(42));

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
      <div style={{display: "inline-flex", width: "18px", height: "18px"}}>
        <AudioPlayer audioSource={audioSource}/>
      </div>
      <div style={{display: "inline-flex"}}>
        {volumes.map((volume, index) => {
          return <div
            key={index}
            style={{
              backgroundColor: "#343434",
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
          {formatDurationToMMSS(duration)}
        </p>
      </div>
    </div>
  );
};

const formatDurationToMMSS = (totalDuration) => {
  const minutes = Math.floor(totalDuration / 60) + "";
  const seconds = Math.ceil(totalDuration % 60) + "";
  return minutes.padStart(2, '0') + ":" + seconds.padStart(2, '0');
};
const MemoizedVoiceMessage = React.memo(VoiceMessage);
export default MemoizedVoiceMessage;