import React, {Suspense, useState} from "react";
import Loader from "../Common/Loader";
import OverlayContent from "../Common/OverlayContent";

const Content = ({example}) => {
  const [overlayContent, setOverlayContent] = useState(null);
  const [overlayClasses, setOverlayClasses] = useState("");

  const overlaySetters = {
    setOverlayContent: setOverlayContent,
    setOverlayClasses: setOverlayClasses
  };

  return (
    <div className="flex-auto h-full">
      <div className="flex w-full h-full">
        <OverlayContent content={overlayContent} classes={overlayClasses} overlaySetters={overlaySetters}/>
        <div className="content-container sm-px-6">
          <main>
            <Suspense fallback={<Loader/>}>
              {example && React.cloneElement(example, {overlaySetters: overlaySetters})}
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  )
};

export default Content;