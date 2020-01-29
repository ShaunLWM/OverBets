import CssBaseline from '@material-ui/core/CssBaseline';
import fetch from "node-fetch";
import React, { useContext, useEffect } from 'react';
import { BrowserRouter, Route, useParams } from 'react-router-dom';
import MatchesContainer from "./components/MatchesContainer";
import NavigationBar from "./components/NavigationBar";
import socket from "./lib/useSocket";
import useTokenState from "./lib/useTokenState";
import { store } from "./store";

function App() {
  const { dispatch } = useContext(store);

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
        <Route path="/login/token/:tokenId" component={TokenHandler} />
        <Route exact path="/" component={MatchesContainer} />
      </BrowserRouter>
    </>
  );
}

function TokenHandler(props) {
  const { dispatch } = useContext(store);
  let { tokenId } = useParams();
  const [, setToken] = useTokenState("");

  useEffect(() => {
    async function fetchProfile() {
      const results = await fetch("http://localhost:3001/profile", {
        method: "POST",
        headers: { 'Authorization': `Bearer ${tokenId}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });

      const profile = await results.json();
      console.log(profile);
      dispatch({ type: "setProfile", data: profile });
      props.history.push("/");
    }

    setToken(tokenId);
    fetchProfile()
  }, []);

  return <></>;
}

export default App;
