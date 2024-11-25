import React, { useState,useContext } from "react";
import notification from "../assets/icons/noti1.svg";
import notificationblack from "../assets/icons/noti1black.svg";
import notificationdesign from "../assets/icons/notificationdesign.png";
import Connect from "../pages/connecter/connect";
import { AuthContext } from '../AuthProvider';
import tunisiaFlag from "../assets/icons/tunisiaFlag.png";
const Notification = ({ isScrolled, showDropdown, onToggleDropdown }) => {
  const handleDropdownClick = (e) => {
    e.stopPropagation(); // Prevent click event from propagating to the background
  };
  const { user } = useContext(AuthContext);
  const [connect,setConnect] = useState(false);
  const handleToggle=()=>{
    if(user){
      onToggleDropdown();
    }else{
      setConnect(true);
    }
  }
  return (
    <div className="relative">
      <div className="relative cursor-pointer py-2" onClick={handleToggle}>
        <img
          className="h-[25px] w-[25px] rounded-full"
          src={isScrolled ? notificationblack : notification}
        />
      </div>
      {showDropdown && (
        <div
          className="fixed inset-0"
          onClick={onToggleDropdown} // Close dropdown on background click
        >
          <div
            className="fixed right-0 mt-20 w-80 h-[550px] bg-white border border-gray-900 rounded-lg shadow-lg z-50"
            onClick={handleDropdownClick}
          >
            <div className="py-2 px-3 bg-gray-200 rounded-lg">
              Notifications
            </div>
            <div className="flex flex-col h-64 justify-center items-center border gap-2">
              <img src={notificationdesign} className="w-10 h-10" />
              <h1 className="font-medium text-center">
                Aucune notifications
                <br />
                pour le moment
              </h1>
            </div>
          </div>
        </div>
      )}
            {connect && <Connect onClose={() => setConnect(false)}/>}

    </div>
  );
};

export default Notification;
