import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, useParams } from "react-router-dom";
import createPersistedState from "use-persisted-state";

const useTokenState = createPersistedState("token");

function App() {
  const [token, setToken] = useTokenState("");

  useEffect(() => {
    console.log(`Token is ${token}`)
  }, []);
  return (
    <div className="App">
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                {token.length < 1
                  ? <a href="http://localhost:3001/auth/bnet">Login</a>
                  : <a href="#" onClick={(e) => {
                    e.preventDefault();
                    setToken("");
                    window.location = "http://localhost:3001/auth/logout";
                  }}>Logout</a>}
              </li>
            </ul>
          </nav>

          <Switch>
            <Route path="/login/token/:tokenId">
              <Topic />
            </Route>
            <Route path="/">
              <span>Please login</span>
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

function Topic() {
  const [, setToken] = useTokenState("");
  let { tokenId } = useParams();
  useEffect(() => {
    setToken(tokenId);
  }, []);
  return <h3>TokenId: {tokenId}</h3>;
}

export default App;
