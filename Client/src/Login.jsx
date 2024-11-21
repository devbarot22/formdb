import { React, useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import ClosedEye from "./public/icons8-closed-eye-96.png";
import OpenedEye from "./public/icons8-eye-96.png";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="Parent">
      <h1>Login</h1>
      <form className="FormLogin">
        <label htmlFor="UserName" style={{ marginBottom: "10px" }}>
          UserName or Email
        </label>
        <input
          type="text"
          style={{
            height: "5vh",
            width: "18vw",
            border: "1px solid black",
            borderRadius: "5px",
            paddingLeft: "10px",
          }}
          placeholder="Enter Your email or user name"
        />
        <label htmlFor="" style={{ marginBottom: "10px", marginTop: "10px" }}>
          Password
        </label>
        <input
          type={showPassword ? "text" : "password"}
          style={{
            height: "5vh",
            width: "18vw",
            position: "relative",
            border: "1px solid black",
            borderRadius: "5px",
            paddingLeft: "10px",
          }}
          placeholder="Enter your password"
        />
        <img
          src={showPassword ? ClosedEye : OpenedEye}
          alt=""
          style={{
            position: "absolute",
            height: "15px",
            top: "20.5vh",
            right: "3.1vw",
            cursor: "pointer",
          }}
          onClick={togglePasswordVisibility}
        />
        <button
          type="submit"
          style={{
            height: "2.20vw",
            width: "6vw",
            fontFamily: "sans-serif",
            borderRadius: "5px",
            border: "1px solid black",
            backgroundColor: "transparent",
            marginTop: "10px",
          }}>
          Login
        </button>

        <span style={{ marginTop: "6px", cursor: "pointer" }}>
          Haven't registered yet?{" "}
           <span style={{ color: "#0000EE" }} onClick={() => navigate("/")}>
            Sign Up.
          </span>
        </span>
      </form>
    </div>
  );
};

export default Login;
