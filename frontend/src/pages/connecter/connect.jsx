import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import { GoogleLogin } from "@react-oauth/google";

const Connect = ({ onClose,titre }) => {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user,handleLogin, handleGoogleLogin } = useContext(AuthContext);
  
  const handleError = () => {
    console.log("Login Failed");
  };
  return (
    <div>
      {user ? onClose():""}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="relative w-1/4 p-6  bg-white rounded-lg shadow-lg">
          <button className="absolute top-0 right-2 text-2xl text-gray-600 hover:text-gray-900"
          onClick={onClose}>
            &times;
          </button>
          <h1>{titre}</h1>
          <h2 className="text-xl font-semibold mb-4 mt-2 text-center">
            Connecter à votre account
          </h2>
          <p className="mb-6">
            Lazmak tconnecti bsh tnajam ta3mal j'aime ldar ml dyar
          </p>
          {/* Google Sign up button */}
          <div className="google-login">
            <GoogleLogin onSuccess={handleGoogleLogin} onError={handleError}
             />
          </div>
          
          {/* Divider */}
          <div className="flex items-center justify-center my-4">
            <span className="w-full h-px bg-gray-300"></span>
            <span className="text-gray-500 mx-2">OR</span>
            <span className="w-full h-px bg-gray-300"></span>
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 py-[6px] border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              className="w-full px-3 py-[6px] border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <p className="text-center text-sm mb-6">
              vous n'avez pas un account ?{" "}
              <Link to="/register" className="text-green-500">
                Register
              </Link>
            </p>
          </div>
          {/* Sign up button */}
          <div className="mb-2">
            <button className="w-full py-[7px] bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600">
              Sign up
            </button>
          </div>

          {/*<h1 className="text-center text-xl font-medium">Welcome back</h1>
          <div className="mb-4">
            <input
              className=" block border px-4 py-3 w-full rounded-lg"
              type="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <input
              className=" block border px-4 py-3 w-full rounded-lg"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 w-full"
            type="submit"
          >
            Continue
          </button>
          <h1 className="text-center">
            vous n'avez pas un account ?{" "}
            <Link to="/register" className="text-green-500">
              Register
            </Link>
          </h1>
          <div className="flex items-center justify-center my-4">
            <span className="w-full h-px bg-gray-300"></span>
            <span className="text-gray-500 mx-2">OR</span>
            <span className="w-full h-px bg-gray-300"></span>
          </div>
          <button className="border px-4 py-3 rounded-lg hover:border-black">
            continue with google
          </button>*/}
        </div>
      </div>
    </div>
  );
};

export default Connect;
