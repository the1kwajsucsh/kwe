import './css/App.css';
import React, {useEffect, useRef} from "react";
import Sidebar from "./Components/Sidebar/Sidebar";
import DemoController from "./Components/Demos/DemoController";

//   //   PhotoFlasherVisualizer: <PhotoFlasherVisualizer/>,
//   //   SquarePhotoFlasher: <SquarePhotoFlasher/>,
//   //   VisualizerPlane: <VisualizerPlane/>,
//   //   AudioData: <AudioData/>,
//   // },
// };

const demoNames = {
  Basics: [
    "Template",
    "Abstract Art",
    "AbstractArt2_Basement",
    "Terminal",
    "Sphere Video",
    "Circle Spinners",
    "Warped Disco Wall",
    "Nut",
  ],
  Intermediate: [
    "Spline Squares",
    "Webcam Visualizer",
    "Matrix Rain",
  ],
  Visualizers: [
    "Simple Visualizers",
    "Audio Box Visualizer"
  ],
};

function App() {
  const exampleRef = useRef();

  useEffect(() => {
    console.log("App re-rendered")
  });

  return (
    <div className="app">
      <div className="lg-flex h-full">
        <Sidebar example={exampleRef} demoNames={demoNames}/>
        <div className="non-sidebar-area">
          <DemoController demo={exampleRef}/>
        </div>
      </div>
      {/*AudioController*/}
      {/*Overlay*/}
    </div>
  );
}

export default App;
