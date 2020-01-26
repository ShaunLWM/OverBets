import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { StateProvider } from "./store";
ReactDOM.render(<StateProvider><App /></StateProvider>, document.getElementById("root"));
serviceWorker.unregister();
