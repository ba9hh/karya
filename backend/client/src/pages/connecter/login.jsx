import React, { useContext, useState } from "react";
import house from "../../assets/images/house.jpg";
import { Link } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DividerWithOr = () => {
  return (
    <div className="flex items-center justify-center ">
      <div className="flex-grow border-t border-gray-300"></div>
      <span className="px-3 text-gray-500">or</span>
      <div className="flex-grow border-t border-gray-300"></div>
    </div>
  );
};
const Login = () => {
  const navigate = useNavigate();
  const { user, handleLogin, loginError,handleGoogleLogin } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    handleLogin({ email, password });
    setError(loginError);
  };

  const handleError = () => {
    console.log("Login Failed");
  };

  return (
    <div className="flex flex-col h-[101vh]">
      <div className="h-20"></div>
      {user ? navigate("/account") : ""}
      <div className="border-4 flex-grow flex justify-center items-center">
        <div className="border w-1/3  flex flex-col gap-3">
          <form
            className="border px-24 flex flex-col gap-6 py-4"
            onSubmit={onSubmit}
          >
            <h1 className="text-center text-xl font-medium">Welcome back</h1>
            {error && ( // Conditionally render the error message
              <div className="text-red-500 text-center">{error}</div>
            )}
            <input
              className=" block border px-4 py-[10px] w-full rounded-lg"
              type="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className=" block border px-4 py-[10px] w-full rounded-lg"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="px-4 py-[7px] text-white bg-blue-600 rounded hover:bg-blue-700 w-full"
              type="submit"
            >
              Continue
            </button>
            <h1 className="text-center text-sm">
              vous n'avez pas un account ?{" "}
              <Link to="/register" className="text-green-500">
                Register
              </Link>
            </h1>
            <DividerWithOr />

            <div className="google-login">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={handleError}
              />
            </div>
          </form>
        </div>
        <div className="w-1/3 border">
          <img src={house} />
        </div>
      </div>
    </div>
  );
};

export default Login;
