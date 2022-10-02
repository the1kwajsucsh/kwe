import React, {useCallback, useEffect, useState} from "react";
import Header from "./Header";
import ExampleLink from "./ExampleLink";
import {MathUtils} from "three";
import Template from "../Demos/Template";
import CircleSpinners from "../Demos/CircleSpinners/CircleSpinners";
import SplineSquares from "../Demos/SpineSquares/SplineSquares";
import WebcamVisualizer from "../Demos/WebcamVisualizer/WebcamVisualizer";
import WarpedDiscoWall from "../Demos/WarpedDiscoWall/WarpedDiscoWall";
import Nut from "../Demos/Nut/Nut";
import AbstractArt from "../Demos/AbstractArt/AbstractArt";
import ToastyPhone from "../Demos/ToastyPhone/ToastyPhone";
import MatrixRain from "../Demos/MatrixRain/MatrixRain";
import AbstractArt2 from "../Demos/AbstractArt2/AbstractArt2";
import AudioBoxVisualizer from "../Demos/AudioBoxVisualizer/AudioBoxVisualizer";
import SphereVideo from "../Demos/SphereVideo/SphereVideo";
import AudioData from "../Demos/AudioData/AudioData";
import VisualizerPlane from "../Demos/VisualizerPlane/VisualizerPlane";

const elements = {
  Basics: {
    Template: <Template/>,
    AbstractArt: <AbstractArt/>,
    AbstractArt2_Basement: <AbstractArt2/>,
    SphereVideo: <SphereVideo/>,
    CircleSpinners: <CircleSpinners/>,
    WarpedDiscoWall: <WarpedDiscoWall/>,
    AudioBoxVisualizer: <AudioBoxVisualizer/>,
    VisualizerPlane: <VisualizerPlane/>,
    AudioData: <AudioData/>,
    Nut: <Nut/>,
  },
  Intermediate: {
    SplineSquares: <SplineSquares/>,
    WebcamVisualizer: <WebcamVisualizer/>,
    MatrixRain: <MatrixRain/>,
    ToastyPhone: <ToastyPhone/>,
  },
};

const Sidebar = ({setExample, params}) => {

  let [activeElement, setActiveElement] = useState();

  const updateExample = useCallback((title, component) => {
    setActiveElement(title);
    setExample(component);
  }, [setExample]);

  useEffect(() => {
    if (Object.keys(params).length !== 0) {
      const {group, demo} = params;
      updateExample(group + demo, elements[group][demo]);
    } else {
      updateExample("BasicsTemplate", elements.Basics.Template);
    }
  }, [params, updateExample]);

  return (
    <div className="sidebar lg-pt-0 lg-bg-white lg-overflow-y-visible lg-w-60 lg-h-auto lg-block lg-static">
      <div className="nav-wrapper lg-bg-transparent lg-h-auto lg-block lg-mr-0 lg-top-16 lg-sticky overflow-y-auto overflow-hidden" style={{left: "-200px"}}>
        <div className="nav lg-text-sm lg-pb-14 sticky-lg-h">
          <ul className="nav-list lg-text-sm font-medium">
            {Object.keys(elements).map(sectionTitle => {
              return (
                <div key={MathUtils.generateUUID()}>
                  <Header text={sectionTitle}/>
                  {Object.entries(elements[sectionTitle]).map(kv => {
                    const [exampleName, component] = kv;
                    const id = sectionTitle + exampleName;
                    return (
                      <ExampleLink
                        id={id}
                        key={id}
                        sectionTitle={sectionTitle}
                        exampleName={exampleName}
                        activeElement={activeElement}
                        isClicked={updateExample}
                      >
                        {component}
                      </ExampleLink>
                    )
                  })}
                </div>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;