let context = null;

export async function createAudio(url) {
  if (context === null) {
    context = new (window.AudioContext || window.webkitAudioContext)();
  }

  // Fetch audio frequencyData and create a buffer source
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  const source = context.createBufferSource();
  source.buffer = await new Promise((res) => context.decodeAudioData(buffer, res));
  source.loop = true;
  // This is why it doesn't run in Safari 🍏🐛. Start has to be called in an onClick event
  // which makes it too awkward for a little demo since you need to load the async frequencyData first
  source.start(0);
  // Create gain node and an analyser
  const gain = context.createGain();
  const analyser = context.createAnalyser();
  analyser.fftSize = 64;
  source.connect(analyser);
  analyser.connect(gain);

  // The frequencyData array receive the audio frequencies
  const frequencyData = new Uint8Array(analyser.frequencyBinCount);
  const pcmData = new Float32Array(analyser.fftSize);
  let n = 0;
  let volumeHistoryTenSeconds = new Array(600).fill(0);

  return {
    context,
    source,
    gain,
    frequencyData: frequencyData,
    pcmData: pcmData,

    // This function gets called every frame per audio source
    update: () => {
      analyser.getByteFrequencyData(frequencyData);
      analyser.getFloatTimeDomainData(pcmData);

      // Calculate a frequency average
      const frequencyAverage = frequencyData.reduce((prev, cur) => prev + cur / frequencyData.length, 0);

      //calculate volume amplitude
      let sumSquares = 0.0;
      for (const amplitude of pcmData) {sumSquares += amplitude*amplitude}
      const volumeAmplitude =  Math.sqrt(sumSquares / pcmData.length);

      // Store history
      n++;
      volumeHistoryTenSeconds[n % volumeHistoryTenSeconds.length] = volumeAmplitude;


      return {
        freqAverage: frequencyAverage,
        volumeAmplitude: volumeAmplitude,
        volumeAvg: average(volumeHistoryTenSeconds),
        volumeHistoryAvg: average(getPreviousElementsFromIndex(volumeHistoryTenSeconds, n % volumeHistoryTenSeconds.length, 10)),
        minDecibels: analyser.minDecibels,
        maxDecibels: analyser.maxDecibels,
      }
    },
  }
}

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