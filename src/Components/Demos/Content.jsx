import React, {Suspense} from "react";
import Loader from "../Common/Loader";

const Content = ({example}) => {
  return (
    <div className="flex-auto h-full">
      <div className="flex w-full h-full">
        <div className="content-container sm-px-6">
          <main>
            <Suspense fallback={<Loader/>}>
              {example}
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  )
};

export default Content;