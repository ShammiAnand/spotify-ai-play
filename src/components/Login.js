import React from "react";
import { accessUrl } from "../auth";
import "../styles/Login.css";
import { Button } from "@mui/material";

function Login() {
  return (
    <div className="login">
      <img
        src="https://getheavy.com/wp-content/uploads/2019/12/spotify2019-830x350.jpg"
        alt=""
      />
      <Button variant="contained" color="success">
        <a href={accessUrl}>LOGIN</a>
      </Button>
    </div>
  );
}

export default Login;
