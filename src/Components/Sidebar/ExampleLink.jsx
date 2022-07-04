import React from "react";
import {Link} from "react-router-dom";

const ExampleLink = (props) => {
  const {sectionTitle, exampleName, id, isClicked, activeElement} = props;

  return (
    <li>
      <Link
        to={"./" + sectionTitle + "/" + exampleName}
        className={"example-link" + (activeElement === id ? " example-link-active" : "")}
        onClick={() => isClicked(id, props.children)}
      >
        {exampleName}
      </Link>
    </li>
  );
};

export default ExampleLink;