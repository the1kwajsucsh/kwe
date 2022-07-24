import React, {useEffect, useState} from "react";
import 'react-circular-progressbar/dist/styles.css';
import {IoIosPause, IoIosPlay} from "react-icons/io";
import {CircularProgressbarWithChildren} from "react-circular-progressbar";

const AudioPlayer = ({audioSource}) => {
  const [audio] = useState(new Audio(audioSource));
  const [isplaying, setIsPlaying] = useState(false);
  const [playPercentage, setPlayPercentage] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlayPercentage(audio.currentTime / audio.duration * 100);
    }, 100);
    return () => clearInterval(interval);
  }, [audio.currentTime, audio.duration]);

  useEffect(() => {
    isplaying ? audio.play() : audio.pause();
  }, [isplaying, audio]);

  useEffect(() => {
    return () => {
      // isplaying && audio.pause();
      console.log("Audio player dismounted");
    }
  }, []);

  const playAudio = () => {
    setIsPlaying(true);
    setPlayPercentage(0);
  };

  const pauseAudio = () => {
    setIsPlaying(false);
  };

  return (
    <CircularProgressbarWithChildren value={playPercentage}>
      {!isplaying && <IoIosPlay style={{color: "#0085D1"}} onClick={playAudio}/>}
      {isplaying && <IoIosPause style={{color: "#0085D1"}} onClick={pauseAudio}/>}
    </CircularProgressbarWithChildren>
  );
};
const MemoizedAudioPlayer = React.memo(AudioPlayer);
export default MemoizedAudioPlayer;