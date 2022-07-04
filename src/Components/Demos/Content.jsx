import React from "react";

const Content = ({example}) => {
  return (
    <div className="flex-auto h-full">
      <div className="flex w-full h-full">
        <div className="content-container sm-px-6">
          <main>
            {example}
          </main>
        </div>
      </div>
    </div>
  )
};

export default Content;