import React, { useState, useRef, useEffect } from "react";
import images from "../../asstes/images";
import axios from "axios";
import { DELETE_ISSUE, UPDATE_STATUS } from "../../routes/route";

const DropDown = ({ issue, projectkey, setProject, project }) => {
  const [showDropDown, setShowDropDown] = useState(false);
  const dropdownRef = useRef(null);

  const updateStatus = async () => {
    try {
      let newStatus;
      if (issue.status === "TODO") {
        newStatus = "IN PROGRESS";
      } else if (issue.status === "IN PROGRESS") {
        newStatus = "DONE ✔";
      }
      const response = axios.put(
        `${UPDATE_STATUS}/${projectkey}/${issue._id}`,
        {
          status: newStatus,
        }
      );
      if ((await response).status === 200) {
        console.log("Issue Moved Successfully");
        setShowDropDown(false);
      }
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  const deleteIssue = async () => {
    try {
      const updateIssues = project.issue.filter(
        (projIssue) => projIssue.key !== issue.key
      );
      console.log(updateIssues);
      const response = axios.delete(
        `${DELETE_ISSUE}/${projectkey}/${issue.key}`
      );
      if ((await response).status === 200) {
        setShowDropDown(false);
      }
      setProject((prev) => ({
        ...prev,
        issue: updateIssues,
      }));
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropDown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <button
        onClick={() => setShowDropDown(!showDropDown)}
        className={`p-2 hover:bg-[#6f7477] rounded-md`}
      >
        <img src={images.moreLine} alt="options" className="w-5" />
      </button>
      {showDropDown && (
        <div
          ref={dropdownRef}
          className="absolute right-1 z-50 flex flex-col gap-2 bg-[#282e33] rounded-md border border-[#3c4750] p-3 w-48"
        >
          <button onClick={deleteIssue} className="text-left">
            Delete
          </button>
          <button
            onClick={updateStatus}
            className={`${
              issue.status === "DONE ✔" ? "hidden" : null
            } text-left`}
          >
            {issue.status === "TODO"
              ? "Move to progress"
              : issue.status === "IN PROGRESS"
              ? "Done"
              : null}
          </button>
        </div>
      )}
    </div>
  );
};

export default DropDown;
