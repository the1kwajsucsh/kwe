import React, {useEffect, useState} from "react";
import {mapLinear} from "three/src/math/MathUtils";
const Meyda = require('meyda');

const NUM_DISPLAY_BARS = 42;
const VOLUME_HEIGHT = 23.6;


const VoiceMessage = ({audioSource = process.env.PUBLIC_URL + "/audio/sampulator.mp3"}) => {
  const [duration, setDuration] = useState("00:00");
  const [volumes, setVolumes] = useState(new Array(32));

  useEffect(() => {
    fetch(audioSource)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => {
        const offlineAudioContext = new OfflineAudioContext({
          length: 1,
          sampleRate: 44100
        });

        return offlineAudioContext.decodeAudioData(arrayBuffer);
      })
      .then((audioBuffer) => {
        const signal = new Float32Array(512);
        const volumeBars = new Array(NUM_DISPLAY_BARS);
        const lengthInSeconds = audioBuffer.length / audioBuffer.sampleRate;

        const minutes = Math.floor(lengthInSeconds / 60) + "";
        const seconds = Math.ceil(lengthInSeconds % 60) + "";

        setDuration(minutes.padStart(2, '0') + ":" + seconds.padStart(2, '0'));

        let j = 0;
        for (let i = 0; i < audioBuffer.length; i += audioBuffer.length/NUM_DISPLAY_BARS) {
          audioBuffer.copyFromChannel(signal, 0, i);
          volumeBars[j++] = Meyda.extract('rms', signal);
        }

        Array.prototype.max = function() {
          return Math.max.apply(null, this);
        };
        const maxVolume = volumeBars.max();
        volumeBars.forEach((val, index) => volumeBars[index] = mapLinear(val, 0, maxVolume, 0, 1));
        setVolumes(volumeBars)
      });
  }, [audioSource]);


  return (
    <div style={{display: "flex", alignItems: "center"}}>
      <div style={{display: "inline-flex"}}>
        {volumes.map((volume, index) => {
          return <div
            key={index}
            style={{
              backgroundColor: "black",
              height: volume*VOLUME_HEIGHT,
              width: 2,
              marginRight: "1px",
              marginTop: (VOLUME_HEIGHT-volume*VOLUME_HEIGHT)/2 + "px",
              marginBottom: (VOLUME_HEIGHT-volume*VOLUME_HEIGHT)/2 + "px"
            }}
          />
        })}
      </div>
      <div style={{display: "inline-flex", paddingLeft: "0.3em"}}>
        <p  style={{margin: "0", fontSize: "12px"}}>
          {duration}
        </p>
      </div>
    </div>
  );
};

export default VoiceMessage;