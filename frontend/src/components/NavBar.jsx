import { useState, useEffect, useContext } from "react";
import logo from "../assets/icons/logo.png";
import home from "../assets/icons/home.png";
import add from "../assets/icons/add.png";
import log from "../assets/icons/log.png";
import homewhite from "../assets/icons/homewhite.svg";
import addwhite from "../assets/icons/addwhite.svg";
import logwhite from "../assets/icons/logwhite.svg";
import navbarbg from "../assets/images/navbarbg1.png";
import Notification from "./Notification";
import Language from "./language";
import Likes from "./likes";
import { useNavigate } from 'react-router-dom';
import { NavLink, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthProvider";
import user0 from "../assets/icons/user.png"

const NavBar = () => {
  const [showToast, setShowToast] = useState(false);

  const handleShowToast = () => {
    setShowToast(true);
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };
  const { isAuthenticated, user } = useContext(AuthContext);

  const [showDropdown, setShowDropdown] = useState(false);
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  const toggleDropdown1 = () => {
    setShowDropdown1(!showDropdown1);
  };
  const toggleDropdown2 = () => {
    setShowDropdown2(!showDropdown2);
  };
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const Part1 = () => {
    return (
      <div className="w-1/6">
        <img className="ml-8" src={logo} />
      </div>
    );
  };
  const Part2 = () => {
    return (
      <div className="w-4/6 flex justify-center border">
        <div className="flex w-96 justify-between items-center border">
          <NavLink
            to="/publication"
            className={`h-20  ${isScrolled ? "border-gray-950" : "border-white"}
              ${isActive("/publication") ? "border-b-4" : ""}
             flex flex-col justify-center items-center cursor-pointer`}
          >
            <img
              className="h-[35px] w-[35px]"
              src={isScrolled ? add : addwhite}
            />
            <h1
              className={`text-[12px] text-white font-normal ${
                isScrolled ? "hidden" : "visible"
              }`}
            >
              Publier
            </h1>
          </NavLink>
          <NavLink
            to="/"
            className={`h-20  ${isScrolled ? "border-gray-950" : "border-white"}
              ${isActive("/") ? "border-b-4" : ""}
             flex flex-col justify-center items-center px-10 cursor-pointer`}
          >
            <img
              className="h-[50px] w-[50px] mt-1"
              src={isScrolled ? home : homewhite}
            />
            <h1
              className={`text-[12px] text-white font-normal ${
                isScrolled ? "hidden" : "visible"
              }`}
            >
              Accueil
            </h1>
          </NavLink>

          {isAuthenticated ? (
            <NavLink
              to="/account"
              className={`h-20  ${
                isScrolled ? "border-gray-950" : "border-white"
              }
              ${isActive("/account") ? "border-b-4" : ""}
              flex flex-col justify-center items-center cursor-pointer`}
            >{user?user.profilePic ? (
              <img
                src={user.profilePic.startsWith("http") 
                  ? user.profilePic 
                  : `http://localhost:3000${user.profilePic}`}
                alt="Profile"
                style={{ borderRadius: '50%', width: '30px', height: '30px' }}
              />
            ) : (
              <img className="h-[30px] w-[30px] rounded-full border"
              src={user0} // Replace with the user's profile picture URL
              alt="User Profile" />
            ):<p>loading</p>}
            
              <h1
                className={`text-[12px] text-white font-normal ${
                  isScrolled ? "hidden" : "visible"
                }`}
              >
                Profile
              </h1>
            </NavLink>
          ) : (
            <NavLink
              to="/login"
              className={`h-20  ${
                isScrolled ? "border-gray-950" : "border-white"
              }
              ${isActive("/login") ? "border-b-4" : ""} ${
                isActive("/register") ? "border-b-4" : ""
              }
             flex flex-col justify-center items-center cursor-pointer`}
            >
              <img
                className="h-[30px] w-[30px]"
                src={isScrolled ? log : logwhite}
              />
              <h1
                className={`text-[12px] text-white font-normal ${
                  isScrolled ? "hidden" : "visible"
                }`}
              >
                Sign up
              </h1>
            </NavLink>
          )}
        </div>
      </div>
    );
  };

  const Part3 = () => {
    return (
      <div className="w-1/6 flex justify-end pr-9 ">
        <div className="flex w-28 justify-between items-center">
          <Language
            
            showDropdown={showDropdown}
            onToggleDropdown={toggleDropdown}
            handleShowToast={handleShowToast}
            handleCloseToast={handleCloseToast}
            showToast={showToast}
          />
          <Likes
            isScrolled={isScrolled}
            
          />
          <Notification
            isScrolled={isScrolled}
            showDropdown={showDropdown2}
            onToggleDropdown={toggleDropdown2}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full flex items-center justify-between  h-20 z-40 bg-contain bg-center ${
          isScrolled ? "bg-[#FCFAF7]" : "bg-black"
        }`}
        style={{
          boxShadow: "0px 4px 4px 10px rgba(0, 0,0, 0.104)",
          backgroundImage: isScrolled ? "none" : `url(${navbarbg})`,
          backgroundColor: isScrolled ? "#FCFAF7" : "none",
        }}
      >
        <Part1 />
        <Part2 />
        <Part3 />
      </div>
    </>
  );
};

export default NavBar;
