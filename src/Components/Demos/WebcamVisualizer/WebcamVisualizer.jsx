import {OrbitControls, Stats} from '@react-three/drei';
import {Canvas} from '@react-three/fiber';
import React, {useEffect} from "react";
import Box from "../Box";
import {PointsCam} from "./WebcamEffect";

const width = 960;
const height = 540;

function WebcamVisualizer() {
  const videoElement = document.createElement("video");
  videoElement.autoPlay = true;
  videoElement.playsInline = true;
  videoElement.style.setProperty("display", "none");
  videoElement.id = "video";
  document.body.appendChild(videoElement);

  const video = videoElement;

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const constraints = {video: {width: width, height: height, facingMode: 'user'}};
      navigator.mediaDevices.getUserMedia(constraints).then(
        function (stream) {
          // apply the stream to the video element used in the texture
          video.srcObject = stream;
          video.width = width;
          video.height = height;
          video.play();
        }).catch(
        function (error) {
          console.error('Unable to access the camera/webcam.', error);
        });
    } else {
      console.error('MediaDevices interface not available.');
    }

    return () => {
      const vid = document.getElementById("video");

      const stream = video.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
      }

      vid.parentNode.removeChild(vid);
    }
  });

  return (
    <>
      {
        video &&
        <Canvas camera={{position: [0, 0, 10]}}>
          <color attach={"background"} args={["black"]}/>
          <ambientLight intensity={1} color="white"/>
          <directionalLight intensity={1} color="white"/>
          <OrbitControls/>
          <Stats/>
          <group position={[-width/80/2, -height/80/2, 0]}>
            <PointsCam video={video} width={width} height={height}/>
          </group>
        </Canvas>
      }
    </>
  );
}

export default WebcamVisualizer;