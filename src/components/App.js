import React, { useState, useEffect } from "react";
import { getTokenFromResponse } from "../auth";
import Login from "./Login";
import Home from "./Home";
import { Button } from "@mui/material";

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const hash = getTokenFromResponse();
    window.location.hash = "";
    let _token = hash.access_token;

    if (_token) {
      setToken(_token);
      // localStorage.setItem("spotify_access_t4", _token);
    }
  }, []);

  return (
    <div className="App">{!token ? <Login /> : <Home token={token} />}</div>
  );
}

export default App;
