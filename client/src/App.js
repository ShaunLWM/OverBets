import CssBaseline from '@material-ui/core/CssBaseline';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import MatchesContainer from "./components/MatchesContainer";
import NavigationBar from "./components/NavigationBar";
function App() {
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
