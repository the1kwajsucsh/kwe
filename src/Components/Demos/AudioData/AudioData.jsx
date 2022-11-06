import React, {useEffect, useRef, useState} from "react";
import {suspend} from "suspend-react";
import {createAudio} from "../../../js/audioAnalyzer/audioAnalyzer";

const AudioData = () => {
  const { gain, context, update, duration } = suspend(() => createAudio(process.env.PUBLIC_URL + "/local/GKTF/05_MAAD_WORLD.mp3", false), []);
  const [freqArray, setFreqArray] = useState([]);
  const [freqAverage, setFreqAverage] = useState(0);
  const [frequency, setFrequency] = useState(-1);
  const [thirdBand, setThirdBand] = useState([]);
  const [twentyFourthBand, setTwentyFourthBand] = useState([]);
  const [volumeAmplitude, setVolumeAmplitude] = useState(0);
  const [meter, setMeter] = useState(0);
  const [volumeAvg, setVolumeAvg] = useState(0);
  const [volumeHistoryAvg, setVolumeHistoryAvg] = useState(0);
  const [minDecibels, setMinDecibels] = useState(0);
  const [maxDecibels, setMaxDecibels] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [bpm, setBpm] = useState(0);
  const [bpmOffset, setBpmOffset] = useState(0);
  const [tempo, setTempo] = useState(0);
  const [isBeat, setIsBeat] = useState(false);
  const [pitch, setPitch] = useState("");

  const thirdCanvas = useRef();
  const fourthCanvas = useRef();
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
        oneTwentyFourthOctaveBands,
        volumeAmplitude,
        volumeAvg,
        meter,
        volumeHistoryAvg,
        minDecibels,
        maxDecibels,
        currentTime,
        pitch,
        bpm,
        bpmOffset,
        tempo,
        isBeat
      } = update();
      setFreqArray(freqArray);
      setFreqAverage(freqAverage.toFixed(0));
      setThirdBand(oneThirdOctaveBands);
      setTwentyFourthBand(oneTwentyFourthOctaveBands);
      setFrequency(frequency.toFixed(0));
      setVolumeAmplitude(volumeAmplitude.toFixed(2));
      setVolumeAvg(volumeAvg.toFixed(2));
      setVolumeHistoryAvg(volumeHistoryAvg.toFixed(2));
      setMinDecibels(minDecibels);
      setMaxDecibels(maxDecibels);
      setCurrentTime(currentTime.toFixed(2));
      setMeter(meter.toFixed(0));
      setBpm(bpm);
      setBpmOffset(bpmOffset);
      setTempo(tempo);
      setIsBeat(isBeat);

      pitch !== undefined && setPitch(pitch);

      // canvas stuff
      const canvasForFreq = freqCanvas.current;
      const canvasForThird = thirdCanvas.current;
      const canvasForFourth = fourthCanvas.current;
      const canvasForMeter = meterCanvas.current;
      const freqCanvasContext = canvasForFreq.getContext('2d');
      const thirdCanvasContext = canvasForThird.getContext('2d');
      const fourthCanvasContext = canvasForFourth.getContext('2d');
      const meterCanvasContext = canvasForMeter.getContext('2d');

      const HEIGHT = 50;
      const WIDTH = 500;

      freqCanvasContext.clearRect(0, 0, freqCanvasContext.canvas.width, freqCanvasContext.canvas.height);
      freqCanvasContext.fillStyle = isBeat ? "#17c6de" : "#051319";
      freqCanvasContext.fillRect(0, 0, freqCanvasContext.canvas.width, freqCanvasContext.canvas.height);

      thirdCanvasContext.clearRect(0, 0, thirdCanvasContext.canvas.width, thirdCanvasContext.canvas.height);
      thirdCanvasContext.fillStyle = isBeat ? "#052e34" : "#051319";
      thirdCanvasContext.fillRect(0, 0, thirdCanvasContext.canvas.width, thirdCanvasContext.canvas.height);

      fourthCanvasContext.clearRect(0, 0, fourthCanvasContext.canvas.width, fourthCanvasContext.canvas.height);
      fourthCanvasContext.fillStyle = isBeat ? "#052e34" : "#051319";
      fourthCanvasContext.fillRect(0, 0, fourthCanvasContext.canvas.width, fourthCanvasContext.canvas.height);

      meterCanvasContext.clearRect(0, 0, meterCanvasContext.canvas.width, meterCanvasContext.canvas.height);
      meterCanvasContext.fillStyle = isBeat ? "#052e34" : "#051319";
      meterCanvasContext.fillRect(0, 0, meterCanvasContext.canvas.width, meterCanvasContext.canvas.height);


      let grd = meterCanvasContext.createLinearGradient(0, 0, 0, meterCanvasContext.canvas.height);
      grd.addColorStop(0, `hsl(0, 100%, 50%`);
      grd.addColorStop(0.5, `hsl(64, 100%, 50%`);
      grd.addColorStop(1, `hsl(120, 100%, 50%`);
      meterCanvasContext.fillStyle = grd;
      meterCanvasContext.fillRect(0, meterCanvasContext.canvas.height, meterCanvasContext.canvas.width,  -meterCanvasContext.canvas.height - meter);

      for (let i = 0; i < oneThirdOctaveBands.length; i++) {
        const value = oneThirdOctaveBands[i];

        const NUM_BARS = oneThirdOctaveBands.length;
        const SPACING_BETWEEN_BARS = 2;

        const percent = value / 256;
        const height = HEIGHT * percent;
        const offset = HEIGHT - height - 1;
        const barWidth = (WIDTH - NUM_BARS*SPACING_BETWEEN_BARS)/NUM_BARS;

        const hue = i/oneThirdOctaveBands.length * 360;
        thirdCanvasContext.fillStyle = `hsl(${hue}, 100%, 50%`;
        thirdCanvasContext.fillRect(i*barWidth + i*SPACING_BETWEEN_BARS, offset, barWidth, height);
      }

      for (let i = 0; i < oneTwentyFourthOctaveBands.length; i++) {
        const value = oneTwentyFourthOctaveBands[i];

        const NUM_BARS = oneTwentyFourthOctaveBands.length;
        const SPACING_BETWEEN_BARS = 0;

        const percent = value / 256;
        const height = HEIGHT * percent;
        const offset = HEIGHT - height - 1;
        const barWidth = (WIDTH - NUM_BARS*SPACING_BETWEEN_BARS)/NUM_BARS;

        const hue = i/oneTwentyFourthOctaveBands.length * 360;
        fourthCanvasContext.fillStyle = `hsl(${hue}, 100%, 50%`;
        fourthCanvasContext.fillRect(i*barWidth + i*SPACING_BETWEEN_BARS, offset, barWidth, height);
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
    <div style={{backgroundColor: "white"}}>
      <br/>
      <h3 style={{marginBlockStart: "0"}}>Time</h3>
      <ol>
        <li>{`Duration: ${duration}`}</li>
        <li>{`Current Time: ${currentTime}`}</li>
      </ol>
      <h3>Frequency</h3>
      <ol>
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
      <h3>Beat</h3>
      <ol>
        <li>{`BPM: ${bpm}`}</li>
        <li>{`BPM Offset: ${bpmOffset}`}</li>
        <li>{`Tempo: ${tempo}`}</li>
        <li>{`Beat: ${isBeat}`}</li>
      </ol>
      <h3>Visualizations</h3>
      <p>One third octave bands:</p>
      <canvas className="visualizer-canvas" ref={thirdCanvas} width={500} height={50}/>
      <p>One twenty fourth octave bands:</p>
      <canvas className="visualizer-canvas" ref={fourthCanvas} width={500} height={50}/>
      <p>Linear Frequency Array:</p>
      <canvas className="visualizer-canvas" ref={freqCanvas} width={500} height={50}/>
      <p>Meter:</p>
      <canvas className="visualizer-canvas" ref={meterCanvas} width={10} height={-minDecibels}/>
    </div>
  )
};

export default AudioData;