import {mapLinear} from "three/src/math/MathUtils";
import memoize from 'lodash/memoize';

const Meyda = require('meyda');
export const NUM_AUDIO_DISPLAY_BARS = 42;

export async function getAverageVolumeArray(audioSource) {
  return await calculateVolumeArray(audioSource);
}

export async function getDuration(audioSource) {
  return await calculateDuration(audioSource);
}

const calculateDuration = memoize(async function (audioSource) {
  return await fetch(audioSource)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => {
      const offlineAudioContext = new OfflineAudioContext({
        length: 1,
        sampleRate: 44100
      });
      return offlineAudioContext.decodeAudioData(arrayBuffer);
    })
    .then((audioBuffer) => {
      return audioBuffer.length / audioBuffer.sampleRate;
    })
});

const calculateVolumeArray = memoize(async function (audioSource) {
  return await fetch(audioSource)
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
      const volumeBars = new Array(NUM_AUDIO_DISPLAY_BARS);

      let j = 0;
      for (let i = 0; i < audioBuffer.length; i += audioBuffer.length / NUM_AUDIO_DISPLAY_BARS) {
        audioBuffer.copyFromChannel(signal, 0, i);
        volumeBars[j++] = Meyda.extract('rms', signal);
      }

      // eslint-disable-next-line no-extend-native
      Array.prototype.max = function () {
        return Math.max.apply(null, this);
      };
      const maxVolume = volumeBars.max();
      volumeBars.forEach((val, index) => volumeBars[index] = mapLinear(val, 0, maxVolume, 0, 1));
      return volumeBars
    });
});