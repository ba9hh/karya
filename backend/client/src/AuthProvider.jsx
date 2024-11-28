import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {  GoogleLogin } from "@react-oauth/google";

const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loginError, setLoginError] = useState("");
  
  const navigate = useNavigate();
  useEffect(() => {
    // Check for the authToken cookie by sending a request to the backend
    axios
      .get("https://karya-kpet.onrender.com/api/validateToken", { withCredentials: true })
      .then((response) => {
        setIsAuthenticated(true);
        setUser(response.data.user);
      })

      .catch((error) => {
        console.error("Token validation failed", error);
        handleLogout();
      });
  }, []);

  const handleRegister = (credentials) => {
    axios
      .post("https://karya-kpet.onrender.com/api/register", credentials, {
        withCredentials: true,
      })
      .then((response) => {
        setIsAuthenticated(true);
        setUser(response.data.user);
        navigate("/");
      })
      .catch((error) => {
        console.error("Registration failed", error);
        
      });
  };

  const handleLogin = (credentials) => {
    axios
      .post("https://karya-kpet.onrender.com/api/login", credentials, {
        withCredentials: true,
      })
      .then((response) => {
        setIsAuthenticated(true);
        setUser(response.data.user);
        navigate("/");
      })
      .catch((error) => {
        console.error("Login failed", error);
        setLoginError("Invalid email or password.")
      });
  };
  const handleGoogleLogin = async (googleResponse) => {
    try {
      const { credential } = googleResponse;
    
      // Send the token to your backend for validation
      const response = await axios.post(
        "https://karya-kpet.onrender.com/api/auth/google",
        { token: credential },
        { withCredentials: true }
         
      );
      setIsAuthenticated(true);
      setUser(response.data.user);
      
      /*navigate("/");*/
    } catch (error) {
      console.error("Google login failed", error);
    }
  };
  
  const handleLogout = () => {
    axios
      .post("https://karya-kpet.onrender.com/api/logout", {}, { withCredentials: true })
      .then(() => {
        setIsAuthenticated(false);
        setUser(null);
      })
      .catch((error) => {
        console.error("Logout failed", error);
      });
  };

  return (
    
      <AuthContext.Provider
        value={{
          isAuthenticated,
          user,
          loginError,
          setUser,
          handleRegister,
          handleLogin,
          handleGoogleLogin,
          handleLogout,
        }}
      >
        {children}
       
      </AuthContext.Provider>
   
  );
};

export { AuthProvider, AuthContext };
