import {mapLinear} from "three/src/math/MathUtils";
import { guess } from 'web-audio-beat-detector';

let context = null;

export async function createAudio(url, microphone=false) {
  if (context === null) {
    context = new (window.AudioContext || window.webkitAudioContext)();
  }

  let source;
  const gain = context.createGain();
  const analyser  = context.createAnalyser();

  let bpm = 0;
  let bpmOffset = 0;
  let tempo = 0;

  if (!microphone) {
    console.log("Initializing Track Analyzer");

    // Fetch audio frequencyData and create a buffer source
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    source = context.createBufferSource();
    source.buffer = await new Promise((res) => context.decodeAudioData(buffer, res));
    source.loop = true;
    // This is why it doesn't run in Safari 🍏🐛. Start has to be called in an onClick event
    // which makes it too awkward for a little demo since you need to load the async frequencyData first
    source.start(0);
    analyser.connect(gain);

    // Start detecting bpm
    guess(source.buffer)
      .then(({ bpm: pBpm, offset: pOffset, tempo: pTempo }) => {
        bpm = pBpm;
        bpmOffset = pOffset;
        tempo = pTempo;
      })
      .catch((err) => {});
  } else {
    console.log("Initializing Microphone Analyzer");

    const audio = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false
    });

    source = context.createMediaStreamSource(audio);
  }

  source.connect(analyser);

  /* Defines the buffer size used to perform the analysis. It must be a power of two.
  Higher values will result in more fine grained analysis of the signal, at the cost of performance loss.*/
  analyser.fftSize = 2048;
  analyser.minDecibels = -60;
  analyser.maxDecibels = 0;
  analyser.smoothingTimeConstant = 0.7;

  // The frequencyData array receive the audio frequencies
  const frequencyData = new Uint8Array(analyser.frequencyBinCount);
  const pcmData = new Float32Array(analyser.fftSize);

  const MAX_FREQUENCY = context.sampleRate/2;

  let n = 0;
  let volumeHistoryTenSeconds = new Array(600).fill(0);

  return {
    context,
    source,
    gain,
    duration: microphone ? 0.0 : source.buffer.duration,

    // This function gets called every frame per audio source
    update: () => {
      analyser.getByteFrequencyData(frequencyData);
      analyser.getFloatTimeDomainData(pcmData);

      const thirdBand = calculateNthBand(frequencyData, MAX_FREQUENCY, 3);
      const twentyFourthBand = calculateNthBand(frequencyData, MAX_FREQUENCY, 24);

      //calculate volume amplitude
      let sumSquares = 0.0;
      for (const amplitude of pcmData) {sumSquares += amplitude*amplitude}
      const volumeAmplitude =  Math.sqrt(sumSquares / pcmData.length);

      // Calculate a frequency average
      const frequencyAverage = frequencyData.reduce((prev, cur) => prev + cur / frequencyData.length, 0);
      const frequency = autoCorrelate(pcmData,context.sampleRate);

      // Store history
      n++;
      volumeHistoryTenSeconds[n % volumeHistoryTenSeconds.length] = volumeAmplitude;

      const songTimestamp = (context.currentTime) % source.buffer.duration;

      return {
        /*
        Byte frequency data (integers on a scale of 0 to 255). Each item represents the decibel value
        for a specific frequency. Frequencies are spread linearly from to to 1/2 the sample rate.
         */
        freqArray: frequencyData,

        /*
        Average frequency of the byte frequency data.
         */
        freqAverage: frequencyAverage,

        /*
        Current frequency in HZ.
         */
        frequency: Math.round(frequency),

        /*
        One-third octave bands
         */
        oneThirdOctaveBands: thirdBand,

        /*
        One-twentyFourth octave bands
         */
        oneTwentyFourthOctaveBands: twentyFourthBand,

        /*
        Note associated with the current frequency.
         */
        pitch: noteFromPitch(frequency),

        /*
          Determine if a waveform exceeds its maximum level.
         */
        meter: mapLinear(Math.max(Math.max.apply(null, pcmData.map(Math.abs))), 0, 1, analyser.minDecibels, analyser.maxDecibels),

        /*
        The Beats Per Minute
         */
        bpm: bpm,

        /*
        The offset of the first beat in seconds
         */
        bpmOffset: bpmOffset,

        /*
        The specific tempo (non-rounded BPM)
         */
        tempo: tempo,

        /*
        Whether we think this is a beat or not

        ((lengthOfBeat + offset) / songTimestamp) % 1      is > 1-lambda or < lambda
         */
        isBeat: microphone ? false : ((((songTimestamp-bpmOffset)/(60/bpm)) % 1) > 1-0.1 || (((songTimestamp-bpmOffset)/(60/bpm)) % 1) < 0.1),

        /*

         */
        volumeAmplitude: volumeAmplitude,

        /*

         */
        volumeAvg: average(volumeHistoryTenSeconds),

        /*

         */
        volumeHistoryAvg: average(getPreviousElementsFromIndex(volumeHistoryTenSeconds, n % volumeHistoryTenSeconds.length, 10)),

        /*

         */
        minDecibels: analyser.minDecibels,

        /*

         */
        maxDecibels: analyser.maxDecibels,

        /*

         */
        currentTime: microphone ? 0 : songTimestamp,
      }
    },
  }
}

const calculateNthBand = (frequencyData, max_frequency, bandNumber) => {
  const linearFreqPerPoint = max_frequency / frequencyData.length;
  const centreFrequencies = generateTheoreticalCentreFrequencies(20, max_frequency, bandNumber);
  const band = [];

  let fLower, indexLower, fUpper, indexUpper;
  for (let i = 0; i < centreFrequencies.length; i++) {
    fLower = centreFrequencies[i] / Math.pow(2, 1/(bandNumber * 2));
    fUpper = centreFrequencies[i] * Math.pow(2, 1/(bandNumber * 2));
    indexLower =getIndexFromFrequency(fLower, linearFreqPerPoint);
    indexUpper =getIndexFromFrequency(fUpper, linearFreqPerPoint);

    if (fUpper < max_frequency) {
      let diff = indexUpper - indexLower;
      if (diff < 2) {
        diff = 2;
      }
      band.push(Math.round(average(frequencyData.slice(indexLower, indexLower + diff))));
    }
  }

  linearSmoothBand(band);

  return band;
};

const linearSmoothBand = (bandData) => {
  let leftIndex = 0, rightIndex = 0;
  let leftVal, rightVal;

  while (rightIndex < bandData.length - 1) {
    leftVal = bandData[leftIndex];
    rightVal = bandData[++rightIndex];

    if (leftVal !== rightVal) {
      let indexDiff = rightIndex - leftIndex;

      if (indexDiff > 1) {
        let margin = (rightVal - leftVal) / indexDiff;
        for (let i = 1; i < indexDiff; i++) {
          bandData[++leftIndex] = bandData[leftIndex] + margin*i;
        }
      }

      leftIndex++;
    }
  }

  return bandData;
};

const generateTheoreticalCentreFrequencies = (minFreq, maxFreq, bandNumber) => {
  const centreFreqs = [];
  let lastFreq = minFreq;

  while (lastFreq < maxFreq) {
    let nextFreq = lastFreq * Math.pow(2, 1/bandNumber);
    centreFreqs.push(nextFreq);
    lastFreq = nextFreq;
  }

  return centreFreqs;
};

const getIndexFromFrequency = (frequency, linearFreqPerPoint) => {
  return Math.round(frequency / linearFreqPerPoint);
};

/**
 * Calculates the average value of an array.
 * @param array The array.
 * @returns {number}
 */
const average = array => array.reduce((a, b) => a + b) / array.length;

/**
 * Retrieves the last n elements from an array with the tail of the elements
 * at index. Will wrap around.
 * @param arr The array containing the elements.
 * @param index The index of the tail.
 * @param n The number of elements to retrieve.
 * @returns An array of size N containing the last N elements from the array with the tail at the index.
 */
const getPreviousElementsFromIndex = (arr, index, n) => {
  if (n > index) {
    const newArr = [];
    const numToGrabFromEnd = n - index;

    arr.slice(0, index).forEach(element => newArr.push(element));
    arr.slice(arr.length - numToGrabFromEnd).forEach(element => newArr.push(element));
    return newArr;
  } else {
    return arr.slice(index - n, index)
  }
};

// Must be called on analyser.getFloatTimeDomainData and audioContext.sampleRate
// From https://github.com/cwilso/PitchDetect/pull/23
// https://github.com/cwilso/PitchDetect/blob/main/js/pitchdetect.js
function autoCorrelate(buffer, sampleRate) {
  // Perform a quick root-mean-square to see if we have enough signal
  let SIZE = buffer.length;
  let sumOfSquares = 0;
  for (let i = 0; i < SIZE; i++) {
    const val = buffer[i];
    sumOfSquares += val * val;
  }
  const rootMeanSquare = Math.sqrt(sumOfSquares / SIZE);
  if (rootMeanSquare < 0.01) {
    return -1;
  }

  // Find a range in the buffer where the values are below a given threshold.
  let r1 = 0;
  let r2 = SIZE - 1;
  const threshold = 0.2;

  // Walk up for r1
  for (let i = 0; i < SIZE / 2; i++) {
    if (Math.abs(buffer[i]) < threshold) {
      r1 = i;
      break;
    }
  }

  // Walk down for r2
  for (let i = 1; i < SIZE / 2; i++) {
    if (Math.abs(buffer[SIZE - i]) < threshold) {
      r2 = SIZE - i;
      break;
    }
  }

  // Trim the buffer to these ranges and update SIZE.
  buffer = buffer.slice(r1, r2);
  SIZE = buffer.length;

  // Create a new array of the sums of offsets to do the autocorrelation
  const c = new Array(SIZE).fill(0);
  // For each potential offset, calculate the sum of each buffer value times its offset value
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE - i; j++) {
      c[i] = c[i] + buffer[j] * buffer[j+i]
    }
  }

  // Find the last index where that value is greater than the next one (the dip)
  let d = 0;
  while (c[d] > c[d+1]) {
    d++;
  }

  // Iterate from that index through the end and find the maximum sum
  let maxValue = -1;
  let maxIndex = -1;
  for (var i = d; i < SIZE; i++) {
    if (c[i] > maxValue) {
      maxValue = c[i];
      maxIndex = i;
    }
  }

  let T0 = maxIndex;

  // Not as sure about this part, don't @ me
  // From the original author:
  // interpolation is parabolic interpolation. It helps with precision. We suppose that a parabola pass through the
  // three points that comprise the peak. 'a' and 'b' are the unknowns from the linear equation system and b/(2a) is
  // the "error" in the abscissa. Well x1,x2,x3 should be y1,y2,y3 because they are the ordinates.
  const x1 = c[T0 - 1];
  const x2 = c[T0];
  const x3 = c[T0 + 1];

  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  if (a) {
    T0 = T0 - b / (2 * a);
  }

  return sampleRate/T0;
}

// Thanks to PitchDetect: https://github.com/cwilso/PitchDetect/blob/master/js/pitchdetect.js
const noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
function noteFromPitch( frequency ) {
  const noteNum = 12 * (Math.log( frequency / 440 )/Math.log(2) );
  return noteStrings[(Math.round( noteNum ) + 69) % 12];
}