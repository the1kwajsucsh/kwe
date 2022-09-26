import React, {useEffect, useRef, useState} from "react";
import {suspend} from "suspend-react";
import {createAudio} from "../../../js/audioAnalyzer/audioAnalyzer";

const AudioData = () => {
  const { gain, context, update, duration } = suspend(() => createAudio(process.env.PUBLIC_URL + "/local/Lukhash/WeComeTogether.mp3"/*"/audio/c_scale.mp3"*/), []);
  const [freqArray, setFreqArray] = useState([]);
  const [freqAverage, setFreqAverage] = useState(0);
  const [frequency, setFrequency] = useState(-1);
  const [thirdBand, setThirdBand] = useState([]);
  const [volumeAmplitude, setVolumeAmplitude] = useState(0);
  const [meter, setMeter] = useState(0);
  const [volumeAvg, setVolumeAvg] = useState(0);
  const [volumeHistoryAvg, setVolumeHistoryAvg] = useState(0);
  const [minDecibels, setMinDecibels] = useState(0);
  const [maxDecibels, setMaxDecibels] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [pitch, setPitch] = useState("");

  const thirdCanvas = useRef();
  const freqCanvas = useRef();
  const meterCanvas = useRef();

  useEffect(() => {
    // Connect the gain node, which plays the audio
    gain.connect(context.destination);

    const interval = setInterval(() => {
      const {
        freqArray,
        frequency,
        freqAverage,
        oneThirdOctaveBands,
        volumeAmplitude,
        volumeAvg,
        meter,
        volumeHistoryAvg,
        minDecibels,
        maxDecibels,
        currentTime,
        pitch,
      } = update();
      setFreqArray(freqArray);
      setFreqAverage(freqAverage.toFixed(0));
      setThirdBand(oneThirdOctaveBands);
      setFrequency(frequency.toFixed(0));
      setVolumeAmplitude(volumeAmplitude.toFixed(2));
      setVolumeAvg(volumeAvg.toFixed(2));
      setVolumeHistoryAvg(volumeHistoryAvg.toFixed(2));
      setMinDecibels(minDecibels);
      setMaxDecibels(maxDecibels);
      setCurrentTime(currentTime.toFixed(2));
      setMeter(meter.toFixed(0));

      pitch !== undefined && setPitch(pitch);

      // canvas stuff
      const canvasForFreq = freqCanvas.current;
      const canvasForThird = thirdCanvas.current;
      const canvasForMeter = meterCanvas.current;
      const freqCanvasContext = canvasForFreq.getContext('2d');
      const thirdCanvasContext = canvasForThird.getContext('2d');
      const meterCanvasContext = canvasForMeter.getContext('2d');

      const HEIGHT = 50;
      const WIDTH = 33*12;

      freqCanvasContext.clearRect(0, 0, freqCanvasContext.canvas.width, freqCanvasContext.canvas.height);
      thirdCanvasContext.clearRect(0, 0, thirdCanvasContext.canvas.width, thirdCanvasContext.canvas.height);
      meterCanvasContext.clearRect(0, 0, meterCanvasContext.canvas.width, meterCanvasContext.canvas.height);

      let grd = meterCanvasContext.createLinearGradient(0, 0, 0, meterCanvasContext.canvas.height);
      grd.addColorStop(0, `hsl(0, 100%, 50%`);
      grd.addColorStop(0.5, `hsl(64, 100%, 50%`);
      grd.addColorStop(1, `hsl(120, 100%, 50%`);
      meterCanvasContext.fillStyle = grd;
      meterCanvasContext.fillRect(0, meterCanvasContext.canvas.height, meterCanvasContext.canvas.width,  -meterCanvasContext.canvas.height - meter);

      for (let i = 0; i < oneThirdOctaveBands.length; i++) {
        const value = oneThirdOctaveBands[i];

        const percent = value / 256;
        const height = HEIGHT * percent;
        const offset = HEIGHT - height - 1;
        const barWidth = 10;

        const hue = i/oneThirdOctaveBands.length * 360;
        thirdCanvasContext.fillStyle = `hsl(${hue}, 100%, 50%`;
        thirdCanvasContext.fillRect(i*barWidth + i*2, offset, barWidth, height);
      }

      for (let i = 0; i < freqArray.length; i++) {
        const value = freqArray[i];
        const percent = value / 256;
        const height = HEIGHT * percent;
        const offset = HEIGHT - height - 1;
        const barWidth = WIDTH/freqArray.length;
        const hue = i/freqArray.length * 360;
        freqCanvasContext.fillStyle = `hsl(${hue}, 100%, 50%`;
        freqCanvasContext.fillRect(i*barWidth, offset, barWidth, height);
      }


    }, 1/60);

    // Disconnect it on dismount
    return () => {
      gain.disconnect();
      clearInterval(interval);
    }
  }, [gain, context]);

  return (
    <div>
      <h3>Time</h3>
      <ol>
        <li>{`Duration: ${duration}`}</li>
        <li>{`Current Time: ${currentTime}`}</li>
      </ol>
      <h3>Frequency</h3>
      <ol>
        <li>{`Frequency Array: ${freqArray.toString().substring(0, 100)}...`}</li>
        <li>{`One third octave bands: ${thirdBand}`}</li>
        <li>{`Frequency Average: ${freqAverage}`}</li>
        <li>{`Frequency: ${frequency === -1 ? "Too Quiet" : frequency + " HZ"}`}</li>
        <li>{`Pitch: ${pitch}`}</li>
      </ol>
      <h3>Volume</h3>
      <ol>
        <li>{`Volume Amplitude: ${volumeAmplitude}`}</li>
        <li>{`Volume Average: ${volumeAvg}`}</li>
        <li>{`Meter: ${meter} dB`}</li>
        <li>{`Volume History Average: ${volumeHistoryAvg}`}</li>
        <li>{`Min Decibels: ${minDecibels} dB`}</li>
        <li>{`Max Decibels: ${maxDecibels} dB`}</li>
      </ol>
      <h3>Visualizations</h3>
      <p>One third octave bands:</p>
      <canvas ref={thirdCanvas} width={33*12} height={50}/>
      <p>Linear Frequency Array:</p>
      <canvas ref={freqCanvas} width={33*12} height={50}/>
      <p>Meter:</p>
      <canvas ref={meterCanvas} width={10} height={-minDecibels}/>
    </div>
  )
};

export default AudioData;