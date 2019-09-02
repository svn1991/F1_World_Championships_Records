import React from "react";
import ReactDOM from "react-dom";

import Seasons from "./Seasons/Seasons";

import "./styles.css";

function App() {
  return <Seasons startYear={2005} endYear={2015} />;
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
