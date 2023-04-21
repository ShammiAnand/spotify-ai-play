import React from "react";
import { accessUrl } from "../auth";
import "../styles/Login.css";

function Login() {
  return (
    <div className="login">
      <img
        src="https://getheavy.com/wp-content/uploads/2019/12/spotify2019-830x350.jpg"
        alt=""
      />
      <a href={accessUrl}>LOGIN</a>
    </div>
  );
}

export default Login;
