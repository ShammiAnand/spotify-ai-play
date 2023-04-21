import React, { useState, useEffect } from "react";
import { getTokenFromResponse } from "../auth";
import Login from "./Login";
import Home from "./Home";

function App() {
  const [token, setToken] = useState(
    localStorage.getItem("spotify_access_token") || null
  );

  useEffect(() => {
    const hash = getTokenFromResponse();
    window.location.hash = "";
    let _token = hash.access_token;

    if (_token) {
      setToken(_token);
      localStorage.setItem("spotify_access_token", _token);
    }
  }, []);

  return (
    <div className="App">{!token ? <Login /> : <Home token={token} />}</div>
  );
}

export default App;
