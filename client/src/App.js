import CssBaseline from '@material-ui/core/CssBaseline';
import React, { useContext, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import MatchesContainer from "./components/MatchesContainer";
import NavigationBar from "./components/NavigationBar";
import socket from "./lib/useSocket";
import { store } from "./store";

function App() {
  const { state, dispatch } = useContext(store);

  useEffect(() => {
    socket.on("connection", () => {
      console.log("Connected");
    });

    socket.on("match:bets:new", data => {
      dispatch({ type: "newBets", data });
    })
  }, []);

  return (
    <>
      <CssBaseline />
      <NavigationBar />
      <BrowserRouter>
        <MatchesContainer />
      </BrowserRouter>
    </>
  );
}

export default App;
