import React, {useState} from "react";
import Header from "./Header";

const Sidebar = ({example, params, demoNames}) => {
  const [selected, setSelected] = useState("");

  const updateExample = (newExample) => {
    setSelected(newExample);
    example.current = newExample;
  };

  return (
    <div className="sidebar lg-pt-0 lg-bg-white lg-overflow-y-visible lg-w-60 lg-h-auto lg-block lg-static">
      <div className="nav-wrapper lg-bg-transparent lg-h-auto lg-block lg-mr-0 lg-top-16 lg-sticky overflow-y-auto overflow-hidden" style={{left: "-200px"}}>
        <div className="nav lg-text-sm lg-pb-14 sticky-lg-h">
          <ul className="nav-list lg-text-sm font-medium">
            {(Object.keys(demoNames)).map(sectionTitle => {
              return (
                <div key={sectionTitle}>
                  <Header text={sectionTitle}/>
                  {Object.entries(demoNames[sectionTitle]).map(indexNameArray => {
                    const demoName = indexNameArray[1];
                    const id = sectionTitle + demoName;
                    return (
                      <li key={id} className={"example-link" + (selected === demoName ? " example-link-active" : "")}
                          onClick={() => updateExample(demoName)}>
                        {demoName}
                      </li>
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