import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { StateProvider } from "./store";
const whyDidYouRender = require("@welldone-software/why-did-you-render");
whyDidYouRender(React);

ReactDOM.render(<StateProvider><App /></StateProvider>, document.getElementById("root"));
serviceWorker.unregister();
