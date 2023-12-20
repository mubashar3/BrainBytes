import React, { useEffect, useState } from "react";
import images from "../../asstes/images";
import { useStateValue } from "../../state/StateProvider";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import { UPDATE_USER } from "../../routes/route";
import Loader from "../Loader/Loader";
import { actionTypes } from "../../state/Reducer/Reducer";
import { ToastContainer, toast } from "react-toastify";

const Profile = () => {
  const [loader, setLoader] = useState(false);
  const [{ user }, dispatch] = useStateValue();
  const [newName, setNewName] = useState("");
  const [profile, setProfile] = useState(null);

  const toastDesign = {
    position: "bottom-left",
    draggable: false,
    autoClose: 3000,
    theme: "dark",
  };

  useEffect(() => {
    if (user !== null) {
      setNewName(user?.name);
      setProfile(user?.profile);
    }
  }, [user]);

  const uploadProfile = (e) => {
    const imageFile = e.target.files[0];
    if (imageFile) {
      //! Set the selected image to the state variable
      setProfile(imageFile);
    }
    // console.log(profile);
  };

  const updateUser = async () => {
    try {
      setLoader(true);
      const oldUser = JSON.parse(localStorage.getItem("user"));
      const update = {
        ...oldUser,
        name: newName,
      };
      const response = await axios.post(`${UPDATE_USER}`, {
        _id: user?.id,
        name: newName,
      });
      if (response.status === 200) {
        console.log("user updated successfully");
      }

      dispatch({ type: actionTypes.SET_USER, user: update });

      localStorage.setItem("user", JSON.stringify(update));
    } catch (error) {
      if (error.response.status === 400) {
        toast.error("Invalid user", toastDesign);
      }
      console.log("Error", error.message);
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      {user === null ? (
        <div className="h-screen w-full flex flex-col items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <Navbar />
          <div className="w-[600px] m-auto gap-4 flex flex-col items-center mt-12">
            <div className="text-xl font-bold">Edit Profile</div>
            <div className="relative">
              <div className="h-40 w-40 rounded-full overflow-hidden border-2 border-[#3c4750] object-contain">
                <img src={user?.profile || images.download} alt="profile" />
              </div>
              <label
                htmlFor="upload"
                className="absolute cursor-pointer right-0 bottom-4"
              >
                <img
                  src={images.camera}
                  alt="upload"
                  className="w-8 filter:drop-shadow-xl"
                />
              </label>
              <input
                type="file"
                id="upload"
                className="hidden"
                accept="image/*"
                onChange={uploadProfile}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="name" className="flex flex-col text-lg font-bold">
                Name:
              </label>
              <input
                type="text"
                id="name"
                value={newName}
                autoComplete="off"
                onChange={(e) => setNewName(e.target.value)}
                className={`p-2 rounded-md bg-[transparent] focus:outline-none border-2 ${
                  newName.length === 0 ? "border-[#f15b50]" : "border-[#85b8ff]"
                } `}
              />
              {newName.length === 0 && (
                <p className="text-xs text-[#f15b50] px-2 mt-1">
                  please enter your name
                </p>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="name" className="flex flex-col text-lg font-bold">
                Email:
              </label>
              <input
                type="text"
                id="name"
                value={user.email}
                readOnly
                className="p-2 rounded-md bg-[transparent] focus:outline-none border-2 border-[#85b8ff]"
              />
            </div>
            <button
              disabled={newName.length === 0 || newName === user?.name}
              onClick={updateUser}
              className="btn btn-accent w-32"
            >
              {loader ? <Loader /> : "Save changes"}
            </button>
          </div>
          <ToastContainer />
        </div>
      )}
    </>
  );
};

export default Profile;
