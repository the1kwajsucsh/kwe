import React, {useState} from "react";
import Header from "./Header";
import ExampleLink from "./ExampleLink";
import {MathUtils} from "three";
import Starter from "../Demos/Starter";
import CircleSpinners from "../Demos/CircleSpinners/CircleSpinners";
import SplineSquares from "../Demos/SpineSquares/SplineSquares";
import WebcamVisualizer from "../Demos/WebcamVisualizer/WebcamVisualizer";

const elements = {
  Basics: {
    Starter: <Starter/>,
    CircleSpinners: <CircleSpinners/>,
  },
  Intermediate: {
    SplineSquares: <SplineSquares/>,
    WebcamVisualizer: <WebcamVisualizer/>,
  },
};

const HelloWorld = () => {
  return <h2>Hello World</h2>
};

const Sidebar = ({setExample}) => {

  let [activeElement, setActiveElement] = useState("");

  const updateExample = (title, component) => {
    setActiveElement(title);
    setExample(component);
  };

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