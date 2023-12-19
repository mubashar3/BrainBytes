import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import images from "../../asstes/images";
import CreateIssueBox from "./CreateIssueBox";
import axios from "axios";
import { GET_PROJECT, UPDATE_PROJECT_NAME } from "../../routes/route";
import { useStateValue } from "../../state/StateProvider";
import { actionTypes } from "../../state/Reducer/Reducer";
import Loader from "../Loader/Loader";

const ProjectScreen = () => {
  const [updateNameLoader, setUpdateNameLoader] = useState(false);
  const [{ projects }, dispatch] = useStateValue();
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
    console.log(project);
  }, [issues]);

  useEffect(() => {
    if (Object.keys(project).length === 0) {
      getProject();
    }
  }, [projectKey, projects, project]);

  const handleEditName = async () => {
    try {
      setUpdateNameLoader(true);
      let older = [...projects];
      console.log(older);
      const index = older.findIndex((project) => project.key === projectKey);
      let update = {};
      if (editedProjectName === project?.name) {
        setIsEditing(false);
        setUpdateNameLoader(false);
        return;
      }

      if (editedProjectName.trim() === "") {
        setUpdateNameLoader(false);
        setIsEditing(false);
        return;
      }

      const response = await axios.put(`${UPDATE_PROJECT_NAME}/${projectKey}`, {
        projectName: editedProjectName,
      });
      if (response.status === 200) {
        setUpdateNameLoader(false);
        setIsEditing(false);
      }

      update = {
        ...project,
        name: editedProjectName,
      };

      setProject(update);

      if (index !== -1) {
        const oldUser = older[index];
        older[index] = {
          ...oldUser,
          name: editedProjectName,
        };
        dispatch({ type: actionTypes.SET_PROJECTS, projects: older });
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
            /<span>{updateNameLoader ? <Loader /> : project?.name}</span>
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
            // issues={issues}
            projectkey={projectKey}
            project={project}
            setProject={setProject}
          />
          <CreateIssueBox
            title={"IN PROGRESS"}
            searchIssue={searchIssue}
            handleAddIssue={handleAddIssue}
            // issues={issues}
            projectkey={projectKey}
            setProject={setProject}
            project={project}
          />
          <CreateIssueBox
            title={"DONE ✔"}
            searchIssue={searchIssue}
            handleAddIssue={handleAddIssue}
            // issues={issues}
            projectkey={projectKey}
            setProject={setProject}
            project={project}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectScreen;
