import './css/App.css';
import React, {useState} from "react";
import Sidebar from "./Components/Sidebar/Sidebar";
import Content from "./Components/Demos/Content";
import {useParams} from "react-router";

function App() {
  const [example, setExample] = useState();
  const params = useParams();

  return (
    <div className="app">
      <div className="lg-flex h-full">
        <Sidebar setExample={setExample} params={params}/>
        <div className="non-sidebar-area">
          <Content example={example}/>
        </div>
      </div>
    </div>
  );
}

export default App;
