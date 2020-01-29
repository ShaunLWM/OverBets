import CssBaseline from "@material-ui/core/CssBaseline";
import fetch from "node-fetch";
import React, { useContext, useEffect } from "react";
import { BrowserRouter, Route, Switch, useParams } from "react-router-dom";
import FourOhFour from "./components/FourOhFour";
import IndividualMatchContainer from "./components/IndividualMatchContainer";
import MatchesContainer from "./components/MatchesContainer";
import NavigationBar from "./components/NavigationBar";
import socket from "./lib/useSocket";
import useTokenState from "./lib/useTokenState";
import { store } from "./store";

function App() {
  const { dispatch } = useContext(store);
  const [userToken] = useTokenState("");

  useEffect(() => {
    async function fetchProfile() {
      const results = await fetch("http://localhost:3001/profile", {
        method: "POST",
        headers: { "Authorization": `Bearer ${userToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({})
      });

      const profile = await results.json();
      dispatch({ type: "setProfile", data: profile });
    }

    if (userToken.length > 0) fetchProfile();
  }, [dispatch, userToken]);

  useEffect(() => {
    socket.on("connection", () => {
      console.log("Connected");
    });

    socket.on("match:bets:new", data => {
      dispatch({ type: "newBets", data });
    })
  }, [dispatch]);

  return (
    <>
      <CssBaseline />
      <BrowserRouter>
        <NavigationBar />
        <Switch>
          <Route path="/matches/:matchId" component={IndividualMatchContainer} />
          <Route path="/login/token/:tokenId" component={TokenHandler} />
          <Route exact path="/" component={MatchesContainer} />
          <Route component={FourOhFour} />
        </Switch>
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
        headers: { "Authorization": `Bearer ${tokenId}`, "Content-Type": "application/json" },
        body: JSON.stringify({})
      });

      const profile = await results.json();
      dispatch({ type: "setProfile", data: profile });
      props.history.push("/");
    }

    setToken(tokenId);
    fetchProfile()
  }, [dispatch, props.history, setToken, tokenId]);

  return <></>;
}

export default App;
