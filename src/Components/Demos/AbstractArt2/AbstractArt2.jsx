import {CatmullRomLine, OrbitControls, OrthographicCamera, PerspectiveCamera} from '@react-three/drei';
import {Canvas, useFrame} from '@react-three/fiber';
import React, {useRef, useState} from "react";
import {Vector3} from "three";
import {seededRandom} from "three/src/math/MathUtils";

const getPoints = (seed, numPoints) => {
  seededRandom(seed);
  let randPoint=()=>{return(seededRandom()-0.5)*7};
  return Array.from({length: numPoints}, () => new Vector3(randPoint(), randPoint(), randPoint()));
};

const CurveTest = ({numPoints=25, changeInterval=0.1}) => {
  const [seed, setSeed] = useState(0);
  const [prevTime, setPrevTime] = useState(0);
  const [points, setPoints] = useState(getPoints(seed, numPoints));
  const ref = useRef();

  let curTime;
  useFrame(({clock}) => {
    curTime = clock.getElapsedTime();

    if (curTime - prevTime > changeInterval) {
      setPrevTime(curTime);

      setSeed(seed + 1);
      setPoints(getPoints(seed, numPoints));
    }
  });

  return (
    <CatmullRomLine
      ref={ref}
      points={points}
      lineWidth={1}
      color={"gray"}
      curveType={"catmullrom"}
      segments={numPoints*20}
    />
  );
};

//OrthographicCamera( left : Number, right : Number, top : Number, bottom : Number, near : Number, far : Number )

function AbstractArt2() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 7]}/>
      <color attach="background" args={["black"]} />
      <CurveTest/>
    </>
  );
}

export default AbstractArt2;