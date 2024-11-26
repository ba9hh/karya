import React, { useState,useContext } from 'react'
import heart from "../assets/icons/heart1.svg";
import { useNavigate } from 'react-router-dom';
import heartblack from "../assets/icons/heart1black.svg";
import Connect from '../pages/connecter/connect';
import { AuthContext } from '../AuthProvider';

const Likes = ({isScrolled}) => {
  const { user } = useContext(AuthContext);
  const [connect,setConnect] = useState(false)
  const navigate = useNavigate();
  const goToLikedPosts = () => {
    // Navigate to the account page and pass the state
    if(user){
      navigate('/account', { state: { openedWindow: 'likedPosts' } });
    }else{
      setConnect(true)
    }
  };
    return (
      <div className="relative">
        {/* Notification Icon */}
        <div
          className="relative cursor-pointer py-2"
          onClick={goToLikedPosts}
        >
          <img
                className="h-[25px] w-[25px] rounded-full"
                src={isScrolled?heartblack:heart}
              />
        </div>
      {connect && <Connect onClose={() => setConnect(false)}/>}
      </div>
    );
  };

export default Likes