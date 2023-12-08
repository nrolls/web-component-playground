import React from "react";
import logo from "./logo.svg";
import "./App.css";
import RoomIframe from "./components/RoomIframe";
import WherebySandbox from "./wherebySandbox";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <WherebySandbox />
      </header>
    </div>
  );
}

export default App;
