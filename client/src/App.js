import CssBaseline from '@material-ui/core/CssBaseline';
import React, { useContext, useEffect } from 'react';
import { BrowserRouter, Route, useParams } from 'react-router-dom';
import MatchesContainer from "./components/MatchesContainer";
import NavigationBar from "./components/NavigationBar";
import socket from "./lib/useSocket";
import useTokenState from "./lib/useTokenState";
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
        <Route path="/login/token/:tokenId">
          <TokenHandler />
        </Route>
        <Route exact path="/" component={MatchesContainer} />
      </BrowserRouter>
    </>
  );
}

function TokenHandler() {
  let { tokenId } = useParams();
  const [, setToken] = useTokenState("");

  useEffect(() => {
    setToken(tokenId);
    window.location = "/";
  }, []);

  return <></>;
}

export default App;
