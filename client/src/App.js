import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, useParams } from "react-router-dom";
import createPersistedState from "use-persisted-state";
const fetch = require('node-fetch');

const useTokenState = createPersistedState("token");

function App() {
  const [token, setToken] = useTokenState("");

  const checkToken = (e) => {
    e.preventDefault();
    if (token.length < 1) return console.log("No tokn");
    fetch("http://localhost:3001/matches/25", {
      method: "POST",
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ coins: 50 })
    }).then(res => res.json())
      .then(data => console.log(data))
      .catch(error => console.error(error))
  }
  return (
    <div className="App">
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                {token.length < 1
                  ? <a href="http://localhost:3001/auth/bnet">Login</a>
                  :
                  <div><a href="#" onClick={(e) => {
                    e.preventDefault();
                    setToken("");
                    window.location = "http://localhost:3001/auth/logout";
                  }}>Logout</a>

                  </div>
                }
              </li>
              <li><button onClick={checkToken}>Check</button></li>
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
