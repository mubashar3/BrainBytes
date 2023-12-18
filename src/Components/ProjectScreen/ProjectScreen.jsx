import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import images from "../../asstes/images";
import CreateIssueBox from "./CreateIssueBox";
import axios from "axios";
import { GET_PROJECT, UPDATE_PROJECT_NAME } from "../../routes/route";
import { useStateValue } from "../../state/StateProvider";

const ProjectScreen = () => {
  const [{ projects }] = useStateValue();
  const [editedProjectName, setEditedProjectName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [issues, setIssues] = useState([]);
  const [project, setProject] = useState({});
  const [searchIssue, setSearchIssue] = useState("");
  const projectKey = useParams()?.projectKey;

  const handleAddIssue = (issueText) => {
    setIssues([...issues, issueText]);
  };

  const getProject = async () => {
    try {
      const response = await axios.get(`${GET_PROJECT}/${projectKey}`);
      const project = response.data;
      setProject(project);
      setEditedProjectName(project?.name);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    if (Object.keys(project).length === 0) {
      getProject();
    }
  }, [projectKey, projects, project]);

  const handleEditName = async () => {
    try {
      if (editedProjectName === project?.name) {
        setIsEditing(false);
        return;
      }

      if (editedProjectName.trim() === "") {
        setIsEditing(false);
        return;
      }

      const response = await axios.put(`${UPDATE_PROJECT_NAME}/${projectKey}`, {
        projectName: editedProjectName,
      });

      if (response.status === 200) {
        console.log("Project Updated Successfully");
        setIsEditing(false);
      }
    } catch (e) {
      console.error("Error updating project name:", e.message);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <Navbar />
      <div className="w-[90%] m-auto flex flex-col gap-6">
        <div className="w-full flex flex-col gap-4">
          <p className="font-bold flex gap-1">
            <Link to={"/"} className="hover:underline">
              Projects
            </Link>
            /<span>{project?.name}</span>
          </p>
          <div onBlur={handleEditName}>
            <input
              className="bg-transparent p-1 border-2 border-transparent focus:rounded-md focus:border-2 focus:border-[#85b8ff] focus:outline-none"
              type="text"
              disabled={isEditing}
              value={editedProjectName}
              onChange={(e) => setEditedProjectName(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full flex gap-3 items-center">
          <div className="flex w-[150px] border-[1px] border-gray-600 justify-between items-center rounded-md">
            <input
              value={searchIssue}
              onChange={(e) => setSearchIssue(e.target.value)}
              type="text"
              placeholder="search issue"
              className="p-2 w-[80%] bg-transparent focus:outline-none"
            />
            <button>
              <img src={images.search} alt="search" className="h-6" />
            </button>
          </div>
          <button className="w-8">
            <img src={images.profile} alt="" />
          </button>
          <button className="p-1 bg-[#252a2e] rounded-full">
            <img src={images.addFriend} alt="" className="w-6" />
          </button>
        </div>
        <div className="flex gap-8">
          <CreateIssueBox
            title={"TODO"}
            searchIssue={searchIssue}
            handleAddIssue={handleAddIssue}
            issues={issues}
            projectkey={projectKey}
            project={project}
          />
          <CreateIssueBox
            title={"IN PROGRESS"}
            searchIssue={searchIssue}
            handleAddIssue={handleAddIssue}
            issues={issues}
            projectkey={projectKey}
            project={project}
          />
          <CreateIssueBox
            title={"DONE ✔"}
            searchIssue={searchIssue}
            handleAddIssue={handleAddIssue}
            issues={issues}
            projectkey={projectKey}
            project={project}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectScreen;
