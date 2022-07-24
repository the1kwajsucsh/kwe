import React, {useEffect, useState} from "react";
import {getAverageVolumeArray, getDuration, NUM_AUDIO_DISPLAY_BARS} from "./AudioAnalyzer";
import AudioPlayer from "./AudioPlayer";
import {MathUtils} from "three";

const VOLUME_HEIGHT = 23.6;

const VoiceMessage = ({audioSource = process.env.PUBLIC_URL + "/audio/voice.mp3"}) => {
  const [voiceMessageUUID] = useState(MathUtils.generateUUID);
  const [duration, setDuration] = useState(0);
  const [volumes, setVolumes] = useState(new Array(42));
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

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

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        const volBarStep = duration / NUM_AUDIO_DISPLAY_BARS;

        for (let i = 0; i < NUM_AUDIO_DISPLAY_BARS; i++) {
          const volBar = document.getElementById(voiceMessageUUID + "_" + i);
          if (currentTime >= volBarStep * i) {
            volBar && volBar.style.setProperty("background-color", "#343434");
          } else {
            volBar && volBar.style.setProperty("background-color", "#999999");
          }
        }
      }
    }, 50);
    return () => clearInterval(interval);
  }, [currentTime, duration, voiceMessageUUID]);

  return (
    <div style={{display: "flex", alignItems: "center"}}>
      <div style={{display: "inline-flex", width: "18px", height: "18px"}}>
        <AudioPlayer audioSource={audioSource} setCurrentTime={setCurrentTime} isPlaying={isPlaying} setIsPlaying={setIsPlaying} setIsPaused={setIsPaused}/>
      </div>
      <div style={{display: "inline-flex"}}>
        {volumes.map((volume, index) => {
          return <div
            id={voiceMessageUUID + "_" + index}
            key={voiceMessageUUID + "_" + index}
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
          {(isPlaying || isPaused) ? formatDurationToMMSS(currentTime) : formatDurationToMMSS(duration)}
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