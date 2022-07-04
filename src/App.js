import './css/App.css';
import React, {useState} from "react";
import Sidebar from "./Components/Sidebar/Sidebar";
import Content from "./Components/Demos/Content";

function App() {
  const [example, setExample] = useState();

  return (
    <div className="app">
      <div className="lg-flex h-full">
        <Sidebar setExample={setExample}/>
        <Content example={example}/>
      </div>
    </div>
  );
}

export default App;
