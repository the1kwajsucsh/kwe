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

      return {
        freqAverage: frequencyAverage,
        volumeAmplitude: volumeAmplitude,
        minDecibels: analyser.minDecibels,
        maxDecibels: analyser.maxDecibels,
      }
    },
  }
}