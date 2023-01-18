import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import {Canvas, useFrame, useThree} from "@react-three/fiber";
import {suspend} from "suspend-react";
import {createAudio} from "../../../js/audioAnalyzer/audioAnalyzer";
import {Object3D, Shape, Color, MathUtils} from "three";
import {DoubleSide} from "three/src/constants";
import {Line, OrbitControls, PerspectiveCamera, Plane} from "@react-three/drei";
import {useControls} from "leva";
import {Vector3} from "three/src/math/Vector3";

const colors = require('nice-color-palettes');

let ONE_THIRD_BAND = Array.from({length: 30}, () => [0, 0, 0]);
const ONE_THIRD_BAND_LENGTH = ONE_THIRD_BAND.length;

let ONE_TWENTY_FOURTH_BAND = Array.from({length: 244}, () => [0, 0, 0]);
const ONE_TWENTY_FOURTH_BAND_LENGTH = ONE_TWENTY_FOURTH_BAND.length;

const PolygonVisualizer = ({dataType, position, scale, color}) => {
  const LEN = dataType === "THIRD" ? ONE_THIRD_BAND_LENGTH : ONE_TWENTY_FOURTH_BAND_LENGTH;
  const ref = useRef();
  const [shape, setShape] = useState(new Shape());

  useFrame(() => {
    updateShape(dataType === "THIRD" ? ONE_THIRD_BAND : ONE_TWENTY_FOURTH_BAND);
  });

  const updateShape = (data) => {
    const tempShape = new Shape();
    tempShape.moveTo(0, 0);

    for (let i = 1; i <= LEN; i++) {
      tempShape.lineTo((i/LEN)*2, data[i-1]/256);
    }

    tempShape.lineTo(2 + 1/LEN, 0);
    tempShape.lineTo(0, 0);

    setShape(tempShape);
  };

  return (
    <mesh position={position} scale={scale}>
      <shapeGeometry args={[shape]} ref={ref}/>
      <meshBasicMaterial color={color} side={DoubleSide}/>
    </mesh>
  )
};

const PolygonTopBarVisualizer = ({dataType, position, scale, color}) => {
  return (
    <group position={position} scale={scale}>
      <PolygonVisualizer dataType={dataType} scale={[1, 0.7, 1]} color={color}/>
      <PolylineVisualizer dataType={dataType} color={color}/>
    </group>
  )
};

const PolygonVisualizerMirrored = ({dataType, position, scale, color}) => {
  return (
    <group position={position} scale={scale}>
      <PolygonVisualizer dataType={dataType} position={[0, 0.5, 0]} scale={[1, 0.5, 1]} color={color}/>
      <PolygonVisualizer dataType={dataType} position={[0, 0.5, 0]} scale={[1, -0.5, 1]} color={color}/>
    </group>
  )
};

const PolylineVisualizer = ({dataType, position, scale={x: 1, y: 1, z: 1}, color}) => {
  const LEN = dataType === "THIRD" ? ONE_THIRD_BAND_LENGTH : ONE_TWENTY_FOURTH_BAND_LENGTH;

  const ref = useRef();
  const [initialPoints] = useState(Array.from({length: LEN + 2}, (_, i) => [i/LEN*2, 0, 0]));


  useFrame(() => {
    updateLine(dataType === "THIRD" ? ONE_THIRD_BAND : ONE_TWENTY_FOURTH_BAND);
  });

  const updateLine = (data) => {

    const updatedPositions = [];
    updatedPositions.push(0, 0, 0);
    for (let i = 1; i <= LEN; i++) {
      updatedPositions.push((i/LEN)*2*scale.x, data[i-1]/256*scale.y, 0);
    }
    updatedPositions.push((2 + 1/LEN)*scale.x, 0, 0);

    ref.current.geometry.setPositions(updatedPositions);
  };

  return (
    <group position={position}>
      <Line
        ref={ref}
        points={initialPoints}
        color={color}
        lineWidth={2}
      />
    </group>
  )
};

const PolylineVisualizerMirrored = ({dataType, position, scale, color}) => {
  return (
    <group position={position} scale={scale}>
      <PolylineVisualizer dataType={dataType} position={[0, 0.5, 0]} scale={{x: 1, y: 0.5, z: 1}} color={color}/>
      <PolylineVisualizer dataType={dataType} position={[0, 0.5, 0]} scale={{x: 1, y: -0.5, z: 1}} color={color}/>
    </group>
  )
};

const TriplePolylineVisualizer = ({dataType, position, scale, color}) => {
  return (
    <group position={position} scale={scale}>
      <PolylineVisualizer dataType={dataType} position={[0, 0.5, 0]} scale={{x: 1, y: 1, z: 1}} color={color}/>
      <PolylineVisualizer dataType={dataType} position={[0, 0.5, 0]} scale={{x: 1, y: 0.7, z: 1}} color={color}/>
      <PolylineVisualizer dataType={dataType} position={[0, 0.5, 0]} scale={{x: 1, y: 0.4, z: 1}} color={color}/>
    </group>
  )
};

const BoxVisualizer = ({dataType, position, scale, color}) => {
  const LEN = dataType === "THIRD" ? ONE_THIRD_BAND_LENGTH : ONE_TWENTY_FOURTH_BAND_LENGTH;
  const SPACE = dataType === "THIRD" ? 0.01 : 0.0;
  const BOX_WIDTH = 2/LEN - SPACE;
  const obj = new Object3D();
  const ref = useRef();

  useFrame(() => {
    for (let i = 0; i < LEN; i++) {
      const HEIGHT = (dataType === "THIRD" ? ONE_THIRD_BAND : ONE_TWENTY_FOURTH_BAND)[i]/256;
      obj.scale.set(1, HEIGHT, 1);
      obj.position.set(BOX_WIDTH/2 + i * (BOX_WIDTH + SPACE), HEIGHT/2, 0);
      obj.updateMatrix();
      ref.current.setMatrixAt(i, obj.matrix);
    }

    ref.current.instanceMatrix.needsUpdate = true
  });

  return (
    <group position={position} scale={scale}>
      <instancedMesh ref={ref} args={[null, null, LEN]}>
        <planeGeometry args={[BOX_WIDTH, 1]} />
        <meshBasicMaterial color={color} side={DoubleSide}/>
      </instancedMesh>
    </group>
  )
};

const BoxVisualizerMirrored = ({dataType, position, scale, color}) => {
  return (
    <group position={position} scale={scale}>
      <BoxVisualizer dataType={dataType} position={[0, 0.5, 0]} scale={[1, 0.5, 1]} color={color}/>
      <BoxVisualizer dataType={dataType} position={[0, 0.5, 0]} scale={[1, -0.5, 1]} color={color}/>
    </group>
  )
};

export const Visualizer = ({audio, position, scale}) => {
  const { gain, context, update } = suspend(() => createAudio(audio, true), [audio]);
  const {paletteNumber} = useControls({
    paletteNumber: {
      value: Math.floor(Math.random() * colors.length),
      min: 0,
      max: 99,
      step: 1
    }
  });

  let palette = colors[paletteNumber];
  palette = palette.map((color) => new Color(color));

   useEffect(() => {
      gain.connect(context.destination);
      return () => {
        gain.disconnect();
      }
    }, [gain, context]);

  useFrame(() => {
    updateData();
  });

  useLayoutEffect(() => {
    updateData();
  });

  const updateData = () => {
    const {oneThirdOctaveBands, oneTwentyFourthOctaveBands} = update();
    ONE_TWENTY_FOURTH_BAND = oneTwentyFourthOctaveBands;
    ONE_THIRD_BAND = oneThirdOctaveBands;
  };

  let color1 = palette[Math.floor(Math.random() *5)];
  let color2 = palette[Math.floor(Math.random() *5)];

  const generateNewColors = () => {
    color1 = palette[Math.floor(Math.random() *5)];
    color2 = palette[Math.floor(Math.random() *5)];

    while (color2 === color1) {
      color2 = palette[Math.floor(Math.random() *5)];
    }
  };

  return (
    <group position={position} scale={scale}>

      {/*Bottom Row*/}
      {generateNewColors()}
      <Plane args={[2.1, 1.1, 4, 4]} position={[-2.3, 0.55, -0.01]}>
        <meshBasicMaterial color={color1}/>
      </Plane>
      <PolylineVisualizer dataType="THIRD" position={[-3.3, 0, 0]} color={color2}/>

      {generateNewColors()}
      <Plane args={[2.1, 1.1, 4, 4]} position={[0, 0.55, -0.01]}>
        <meshBasicMaterial color={color1}/>
      </Plane>
      <PolygonVisualizer dataType="THIRD" position={[-1, 0, 0]} color={color2}/>

      {generateNewColors()}
      <Plane args={[2.1, 1.1, 4, 4]} position={[2.3, 0.55, -0.01]}>
        <meshBasicMaterial color={color1}/>
      </Plane>
      <PolygonTopBarVisualizer  dataType="TWENTY_FOURTH" position={[1.3, 0, 0]} color={color2}/>

      {/*Second to Bottom Row*/}
      {generateNewColors()}
      <Plane args={[2.1, 1.1, 4, 4]} position={[-2.3, 1.85, -0.01]}>
        <meshBasicMaterial color={color1}/>
      </Plane>
      <TriplePolylineVisualizer dataType="TWENTY_FOURTH"  position={[-3.3, 0.8, 0]} color={color2}/>

      {generateNewColors()}
      <Plane args={[2.1, 1.1, 4, 4]} position={[0, 1.85, -0.01]}>
        <meshBasicMaterial color={color1}/>
      </Plane>
      <BoxVisualizer dataType="THIRD" position={[-1, 1.3, 0]} color={color2}/>

      {generateNewColors()}
      <Plane args={[2.1, 1.1, 4, 4]} position={[2.3, 1.85, -0.01]}>
        <meshBasicMaterial color={color1}/>
      </Plane>
      <PolylineVisualizer dataType="TWENTY_FOURTH" position={[1.3, 1.3, 0]} color={color2}/>

      {/*Second to top row*/}
      {generateNewColors()}
      <Plane args={[2.1, 1.1, 4, 4]} position={[-2.3, 3.15, -0.01]}>
        <meshBasicMaterial color={color1}/>
      </Plane>
      <PolygonVisualizerMirrored dataType="TWENTY_FOURTH" position={[-3.3, 2.65 , 0]} color={color2}/>

      {generateNewColors()}
      <Plane args={[2.1, 1.1, 4, 4]} position={[0, 3.15, -0.01]}>
        <meshBasicMaterial color={color1}/>
      </Plane>
      <PolygonVisualizer dataType="TWENTY_FOURTH" position={[-1, 2.6, 0]} color={color2}/>

      {generateNewColors()}
      <Plane args={[2.1, 1.1, 4, 4]} position={[2.3, 3.15, -0.01]}>
        <meshBasicMaterial color={color1}/>
      </Plane>
      <PolylineVisualizerMirrored dataType="THIRD" position={[1.3, 2.65, 0]} color={color2}/>

      {/*Top row*/}
      {generateNewColors()}
      <Plane args={[2.1, 1.1, 4, 4]} position={[-2.3, 4.45, -0.01]}>
        <meshBasicMaterial color={color1}/>
      </Plane>
      <PolylineVisualizerMirrored dataType="TWENTY_FOURTH" position={[-3.3, 3.95, 0]} color={color2}/>

      {generateNewColors()}
      <Plane args={[2.1, 1.1, 4, 4]} position={[0, 4.45, -0.01]}>
        <meshBasicMaterial color={color1}/>
      </Plane>
      <BoxVisualizerMirrored dataType="THIRD" position={[-1, 3.95, 0]} color={color2}/>

      {generateNewColors()}
      <Plane args={[2.1, 1.1, 4, 4]} position={[2.3, 4.45, -0.01]}>
        <meshBasicMaterial color={color1}/>
      </Plane>
      <PolygonVisualizerMirrored dataType="THIRD" position={[1.3, 3.95, 0]} color={color2}/>
    </group>
  )
};

function Rig({ children }) {
  const ref = useRef();
  const vec = new Vector3();
  const { camera, mouse } = useThree();
  useFrame(() => {
    camera.position.lerp(vec.set(mouse.x * 1, 0, 7), 0.05);
    ref.current.position.lerp(vec.set(mouse.x * 0.4, mouse.y * 0.4, 0), 0.1);
    ref.current.rotation.y = MathUtils.lerp(ref.current.rotation.y, (-mouse.x * Math.PI) / 20, 0.1)
  });
  return <group ref={ref}>{children}</group>
}

const SimpleVisualizers = () => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 7]}/>
      <color attach="background" args={["gray"]}/>
      <ambientLight/>
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      <Rig>
        <group position={[0, -2.5, 0]}>
          <Visualizer audio={process.env.PUBLIC_URL + "/local/DY/05_UMAMI.mp3"}/>
          <Plane args={[1000, 1000]} rotation={[Math.PI/2, 0, 0]}>
            <meshStandardMaterial color="lightgray" side={DoubleSide}/>
          </Plane>
        </group>
      </Rig>
      <fog attach="fog" args={["gray", 0, 25]} />
    </>
  );
};

export default SimpleVisualizers;