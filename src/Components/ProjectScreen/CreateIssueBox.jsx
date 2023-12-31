import React, { useEffect, useState } from "react";
import images from "../../asstes/images";
import IssueList from "./IssueList";
import axios from "axios";
import { ADD_ISSUE } from "../../routes/route";
import { v4 as uuid4 } from "uuid";
import { useStateValue } from "../../state/StateProvider";

const CreateIssueBox = ({
  handleAddIssue,
  projectkey,
  project,
  title,
  searchIssue,
  setProject,
}) => {
  const [isMoreLineVisible, setIsMoreLineVisible] = useState(false);
  const [issueText, setIssueText] = useState("");
  const [isCreatingIssue, setIsCreatingIssue] = useState(false);
  const [key, setKey] = useState("");
  const [{ user }] = useStateValue();

  useEffect(() => {
    setKey(uuid4());
  }, [isCreatingIssue]);

  const resetBox = () => {
    setIsCreatingIssue(false);
    setIsMoreLineVisible(false);
  };

  const submitIssue = async (event) => {
    try {
      event.preventDefault();
      let data = {};
      if (issueText.trim() === "") {
        resetBox();
        return;
      }

      data = {
        issueText: issueText,
        status: title,
        key: key,
      };
      axios.post(`${ADD_ISSUE}/${projectkey}`, data);
      handleAddIssue(issueText);
      setIssueText("");
      resetBox();
      setProject((prev) => ({
        ...prev,
        issue: [...(prev.issue || []), data],
      }));
    } catch (e) {
      console.error("Error adding issue:", e.message);
    }
  };

  return (
    <div
      onBlur={resetBox}
      className="flex flex-col w-[300px] rounded-lg px-2 py-3 gap-3 bg-[#161a1d] min-h-[144px] mb-8"
    >
      <div
        className="flex justify-between text-xs cursor-pointer h-9"
        onMouseEnter={() => setIsMoreLineVisible(true)}
        onMouseLeave={() => setIsMoreLineVisible(false)}
      >
        <button className="hover:bg-[#252a2e] flex-1 text-left mr-2 px-2 py-1 rounded-md h-6">
          {title}
        </button>
        {isMoreLineVisible && user?.status !== "employee" && (
          <button className="w-6 p-1 hover:bg-[#252a2e] rounded-md h-6">
            <img src={images.moreLine} alt="more" />
          </button>
        )}

        {/* <div className="dropdown dropdown-bottom">
  <div tabIndex={0} role="button" className="btn m-1">Click</div>
  <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
    <li><a>Item 1</a></li>
    <li><a>Item 2</a></li>
  </ul>
</div> */}
      </div>
      {/* Display the list of issues */}
      <div className="flex flex-col gap-1">
        {project.issue === undefined ? (
          <div className="flex justify-center">
            <span className="loading loading-dots loading-sm"></span>
          </div>
        ) : (
          project.issue
            .filter(
              (issue) =>
                issue.status === title &&
                issue.issueText
                  .toLowerCase()
                  .includes(searchIssue.toLowerCase())
            )
            .map((issue, index) => (
              <IssueList
                setProject={setProject}
                key={index}
                project={project}
                issue={issue}
                id={issue.key}
                index={index}
                title={title}
                projectkey={projectkey}
              />
            ))
        )}
      </div>
      {isCreatingIssue ? (
        <form
          onSubmit={submitIssue}
          className="bg-[#252a2e] flex flex-col rounded-md border-2 border-[#85b8ff]"
        >
          <textarea
            placeholder="What needs to be done?"
            onChange={(e) => setIssueText(e.target.value)}
            value={issueText}
            autoFocus={true}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submitIssue(e);
              }
            }}
            className="resize-none focus:outline-none bg-transparent rounded-md p-2 text-sm"
          />
          <input
            type="submit"
            value="Press enter to submit issue"
            className="text-left px-2 text-sm"
          />
        </form>
      ) : (
        <button
          hidden={title === "DONE ✔" || user?.status === "employee"}
          onClick={() => setIsCreatingIssue(true)}
          className="px-2 hover:bg-[#252a2e] py-2 rounded-md cursor-pointer"
        >
          <p className="w-full flex items-center gap-1">
            <img src={images.plusIcon} alt="add" className="w-4" />
            <span>Create issue</span>
          </p>
        </button>
      )}
    </div>
  );
};

export default CreateIssueBox;
