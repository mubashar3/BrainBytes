import React, { useState, useEffect, useRef } from "react";
import images from "../../asstes/images";

const MoreLine = ({ isOpen, onToggle, deleteProject }) => {
  const [isComponentOpen, setIsComponentOpen] = useState(isOpen);
  const componentRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target)
      ) {
        setIsComponentOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsComponentOpen(isOpen);
  }, [isOpen]);

  const handleButtonClick = () => {
    setIsComponentOpen(!isComponentOpen);
    if (onToggle) {
      onToggle(!isComponentOpen);
    }
  };

  const handleDelete = () => {
    handleButtonClick();
    deleteProject();
  };

  return (
    <div ref={componentRef}>
      <button
        onClick={handleButtonClick}
        className={`p-1 relative ${
          isComponentOpen ? "rounded-lg bg-[#323940] " : ""
        }`}
      >
        <img className="w-6" src={images.moreLine} alt="more" />
      </button>
      {isComponentOpen && (
        <>
          <div className="flex flex-col gap-4 absolute w-32 border border-gray-700 p-2 rounded-md bg-[#323940] z-10">
            <button>Project Setting</button>
            <button onClick={handleDelete}>Move to Trash</button>
          </div>
        </>
      )}
    </div>
  );
};

export default MoreLine;
