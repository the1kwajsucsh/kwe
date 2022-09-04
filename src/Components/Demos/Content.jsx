import React, {Suspense, useEffect, useState} from "react";
import Loader from "../Common/Loader";
import OverlayContent from "../Common/OverlayContent";
import AbstractArtLoadingScreen from "./AbstractArt/AbstractArtLoadingScreen";
import {randFloat} from "three/src/math/MathUtils";

const Content = ({example}) => {
  const [overlayContent, setOverlayContent] = useState(null);
  const [overlayClasses, setOverlayClasses] = useState("");
  const [ready, setReady] = useState(false);

  const overlaySetters = {
    setOverlayContent: setOverlayContent,
    setOverlayClasses: setOverlayClasses
  };

  useEffect(() => {
    setReady(false);
  }, [example]);

  let WelcomeScreen = () => {
    return (
      <div className="w-full h-full" style={{position: "relative"}}>
        <button className="enter-button" onClick={() => setReady(true)}>Enter Demo</button>
        <AbstractArtLoadingScreen seed={randFloat(0, 100)}/>
      </div>
    );
  };

  return (
    <div className="flex-auto h-full">
      <div className="flex w-full h-full">
        <OverlayContent content={overlayContent} classes={overlayClasses} overlaySetters={overlaySetters}/>
        <div className="content-container sm-px-6">
          {
            ready ?
              <main>
                <Suspense fallback={<Loader/>}>
                  {example && React.cloneElement(example, {overlaySetters: overlaySetters})}
                </Suspense>
              </main>
              :
              <WelcomeScreen />
          }
        </div>
      </div>
    </div>
  )
};

export default Content;