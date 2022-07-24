import React, {useEffect, useState} from "react";
import 'react-circular-progressbar/dist/styles.css';
import {IoIosPause, IoIosPlay} from "react-icons/io";
import {CircularProgressbarWithChildren} from "react-circular-progressbar";

const AudioPlayer = ({audioSource, setCurrentTime, isPlaying, setIsPlaying, setIsPaused}) => {
  const [audio] = useState(new Audio(audioSource));
  const [playPercentage, setPlayPercentage] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      const percentage = audio.currentTime / audio.duration * 100;
      setPlayPercentage(percentage);
      setCurrentTime(audio.currentTime);
      if (percentage === 100) {
        setIsPlaying(false);
        setIsPaused(false);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [audio.currentTime, audio.duration]);

  useEffect(() => {
    isPlaying ? audio.play() : audio.pause();
  }, [isPlaying, audio]);

  const playAudio = () => {
    setIsPlaying(true);
    setIsPaused(false);
    setPlayPercentage(0);
  };

  const pauseAudio = () => {
    setIsPlaying(false);
    setIsPaused(true);
  };

  return (
    <CircularProgressbarWithChildren value={playPercentage}>
      {!isPlaying && <IoIosPlay style={{color: "#0085D1"}} onClick={playAudio}/>}
      {isPlaying && <IoIosPause style={{color: "#0085D1"}} onClick={pauseAudio}/>}
    </CircularProgressbarWithChildren>
  );
};
const MemoizedAudioPlayer = React.memo(AudioPlayer);
export default MemoizedAudioPlayer;