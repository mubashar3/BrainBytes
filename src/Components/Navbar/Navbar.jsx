import React, { useEffect, useRef, useState } from "react";
import images from "../../asstes/images";
import { useStateValue } from "../../state/StateProvider";
import { Link, useNavigate } from "react-router-dom";
import { actionTypes } from "../../state/Reducer/Reducer";
import Confirm from "../Confirm_Modal/Confirm";

const Navbar = () => {
  const [{ user }, dispatch] = useStateValue();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    dispatch({ type: actionTypes.SET_USER, user: null });
    navigate("/login");
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const toggleDropdown = (event) => {
    event.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <nav className="flex justify-between items-center h-16 border-b-[1px] border-gray-600 px-10">
        <h1 className="font-bold text-xl">AVISA DEV</h1>
        <button className="w-8 relative" onClick={toggleDropdown}>
          <img src={images.profile} alt="profile" />
        </button>
      </nav>
      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="fixed py-5 z-50 right-0 w-80 mr-4 border border-[#3c4750] bg-[#282e33] flex flex-col gap-6 rounded-md"
        >
          <div className="px-4 flex flex-col gap-4">
            <p className="text-sm font-bold">Account</p>
            <div className="flex items-center gap-1">
              <div className="w-8">
                <img src={images.profile} alt="profile" />
              </div>
              <div>
                <h2 className="font-bold text-md">{user.name}</h2>
                <h6 className="text-xs">{user.email}</h6>
              </div>
            </div>
            <div className="w-full p-[1px] bg-[#3c4750]"></div>
            <div>
              <Link to={"/"} onClick={closeDropdown}>
                <div className="text-left p-2 cursor-pointer rounded-md hover:bg-[#3c475067]">
                  Dashboard
                </div>
              </Link>
              <Link to={"/profile"} onClick={closeDropdown}>
                <div className="text-left p-2 cursor-pointer rounded-md hover:bg-[#3c475067]">
                  Profile
                </div>
              </Link>
              <button
                onClick={handleOpenModal}
                className="text-left w-full p-2 cursor-pointer rounded-md hover:bg-[#3c475067]"
              >
                Logout
              </button>
            </div>
          </div>
          {openModal && (
            <Confirm
              handleClose={handleCloseModal}
              handleLogout={handleLogout}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
