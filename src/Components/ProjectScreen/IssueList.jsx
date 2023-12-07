import React, { useState } from "react";
import images from "../../asstes/images";
import DropDown from "./DropDown";
import axios from "axios";
import { UPDATE_ISSUE_TEXT } from "../../routes/route";

const IssueList = ({ issue, index, title, projectkey }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedIssueText, setEditedIssueText] = useState("");

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      if (editedIssueText.trim() === "") {
        handleCancel();
        return;
      }
      const response = await axios.put(
        `${UPDATE_ISSUE_TEXT}/${projectkey}/${issue._id}`,
        {
          issueText: editedIssueText,
        }
      );
      if (response.status === 200) {
        console.log("Issue Updated Successfully");
        setEditedIssueText("");
        setIsEditing(false);
      }
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  return (
    <div
      className={`bg-[#252a2e] px-2 rounded-md h-24 cursor-pointer ${
        isEditing ? "" : "bg-[#252a2e]"
      } `}
    >
      {isEditing ? (
        <div className="py-3 flex flex-col gap-2 ">
          <input
            className="bg-transparent p-1 focus:outline-none rounded-md w-full text-sm"
            type="text"
            value={editedIssueText}
            onChange={(e) => setEditedIssueText(e.target.value)}
            placeholder={issue.issueText}
            autoFocus={true}
          />
          <div className="flex justify-end gap-[4px]">
            <button
              onClick={handleCancel}
              className={`${
                !isEditing
                  ? ""
                  : "bg-[#252a2e] p-[6px] shadow-[#161a1d] shadow-lg"
              }`}
            >
              <img src={images.cancel} alt="cancel" className="w-6" />
            </button>
            <button
              onClick={handleSave}
              className={`${
                !isEditing
                  ? ""
                  : "bg-[#252a2e] p-[6px] shadow-[#161a1d] shadow-lg"
              }`}
            >
              <img src={images.save} alt="save" className="w-6" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col relative">
          <div className="flex justify-between items-center py-2">
            <div className="flex gap-[5px] items-center">
              <div className="cursor-pointer hover:underline text-sm">
                {issue.issueText}
              </div>
              <button
                className="tooltip tooltip-bottom p-[4px] rounded-sm hover:bg-[#6f7477]"
                data-tip="Edit Summary"
                onClick={handleEdit}
              >
                <img src={images.pen} alt="edit" className="w-3" />
              </button>
            </div>
            <DropDown title={title} issue={issue} projectkey={projectkey} />
          </div>
          <div className="flex justify-end">
            <button
              className="p-1 bg-[#6f7477] rounded-full hover:bg-[#969797] tooltip tooltip-bottom"
              data-tip="Unassigned"
            >
              <img src={images.auser} alt="" className="w-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueList;
