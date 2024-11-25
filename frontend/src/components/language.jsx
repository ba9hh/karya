import { useState, useEffect } from "react";
import tunisiaFlag from "../assets/icons/tunisiaFlag.png";
const Toast = ({ message, onClose }) => {
  useEffect(() => {
    // Automatically close the toast after 3 seconds
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-gradient-to-r from-green-400 to-green-600 text-white py-3 px-6 rounded-lg shadow-xl transform transition-all duration-500 ease-in-out opacity-100 scale-100">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2 animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m0 0L9 12m4-4l4 4-4-4z"
            />
          </svg>
          {message}
        </div>
      </div>
    </div>
  );
};
const Language = ({
  showDropdown,
  onToggleDropdown,
  showToast,
  handleShowToast,
  handleCloseToast,
}) => {
  const handleDropdownClick = (e) => {
    e.stopPropagation(); // Prevent click event from propagating to the background
  };

  const handleItemClick = () => {
    handleShowToast();
    onToggleDropdown(); // Show toast
  };
  return (
    <div className="relative">
      {/* Notification Icon */}
      <div className="relative cursor-pointer py-2" onClick={onToggleDropdown}>
        <img className="h-[20px] w-[30px] rounded-[4px]" src={tunisiaFlag} />
      </div>
      {showDropdown && (
        <div
          className="fixed inset-0 z-50"
          onClick={onToggleDropdown} // Close dropdown on background click
        >
          <div
            className="fixed right-24 mt-[72px] w-fit h-fit bg-white border  rounded-lg shadow-lg z-50"
            onClick={handleDropdownClick}
          >
            {/* Example Notification Content */}
            <ul className="p-2">
              <li
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={handleItemClick}
              >
                Arabic
              </li>
              <li
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={handleItemClick}
              >
                francais
              </li>
              <li
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={handleItemClick}
              >
                Anglais
              </li>
            </ul>
          </div>
        </div>
      )}
      {showToast && (
        <Toast message="mazelna ga3din nekhdmou 3leha" onClose={handleCloseToast} />
      )}
    </div>
  );
};

export default Language;
