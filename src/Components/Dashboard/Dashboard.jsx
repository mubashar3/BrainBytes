import React, { useEffect, useState } from "react";
import Email from "./Email";
import ProjectName from "./ProjectName";
import MoreLine from "./MoreLine";
import { Link, redirect, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import AddProjectModal from "./AddProjectModal";
import { v4 as uuid4 } from "uuid";
import axios from "axios";
import { useStateValue } from "../../state/StateProvider";
import { actionTypes } from "../../state/Reducer/Reducer";
import { ADD_PROJECT, DELETE_PROJECT, GET_PROJECTS } from "../../routes/route";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [{ user, projects }, dispatch] = useStateValue();
  const [projectsLoader, setProjectsLoader] = useState(false);
  const [projectKey, setProjectKey] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [addProjectModal, setAddProjectModal] = useState(false);
  const navigate = useNavigate();

  const toastDesign = {
    position: "bottom-left",
    draggable: false,
    autoClose: 3000,
    theme: "dark",
  };

  const getProjects = async () => {
    if (projects === undefined || projectsLoader || user === undefined) {
      return;
    }
    try {
      setProjectsLoader(true);
      const response = await axios.get(`${GET_PROJECTS}/${user?.id}`);
      const projects = response.data;
      if (response.status === 200) {
        dispatch({
          type: actionTypes.SET_PROJECTS,
          projects: projects,
        });
      }
    } catch (error) {
      if (error.response.status === 400) {
        console.log("invalid user");
        return;
      }
      console.error("server error:", error);
    } finally {
      setProjectsLoader(false);
    }
  };

  useEffect(() => {
    if (!projectsLoader) {
      getProjects();
    }
  }, [user]);

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      if (projectName.length === 0) {
        return;
      }
      const projectData = {
        projectKey,
        projectName,
        email: user.email,
      };
      const response = axios.post(ADD_PROJECT, projectData);
      if ((await response).status === 200) {
        setProjectName("");
      }
      projects?.push({
        createdBy: user.email,
        name: projectName,
        key: projectKey,
      });
      setAddProjectModal(false);
    } catch (error) {
      if (error.response.status === 400) {
        toast.error("project already available", toastDesign);
        return;
      }
      console.log("server error: ", error.message);
    }
  };

  const deleteProject = async (key) => {
    try {
      await axios.delete(`${DELETE_PROJECT}/${key}`);
      const filteredProjects = projects?.filter(
        (project) => project.key !== key
      );
      dispatch({
        type: actionTypes.SET_PROJECTS,
        projects: filteredProjects,
      });
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    setProjectKey(uuid4());
  }, [addProjectModal]);

  return (
    <div className="flex flex-col gap-8">
      <Navbar handleLogout={handleLogout} />
      <div className="w-[95%] m-auto flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <p className="font-bold text-2xl">Projects</p>
          <button
            className="btn btn-accent"
            onClick={() => setAddProjectModal(true)}
          >
            Create Project
          </button>
          {addProjectModal && (
            <AddProjectModal
              projectKey={projectKey}
              isActive={isActive}
              setIsActive={setIsActive}
              projectName={projectName}
              setProjectName={(e) => setProjectName(e.target.value)}
              handleProjectSubmit={handleProjectSubmit}
              closeModel={() => {
                setAddProjectModal(false);
                setProjectName("");
              }}
            />
          )}
        </div>
        <table className="table w-[95%] table-pin-cols table-pin-rows">
          <thead>
            <tr>
              <th>Name</th>
              <th>KeyId</th>
              <th>Type</th>
              <th>Lead</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {projects === null || projectsLoader ? (
              <tr>
                <td className="text-center" colSpan={5}>
                  <span className="loading loading-spinner loading-lg"></span>
                </td>
              </tr>
            ) : projects?.length === 0 ? (
              <tr>
                <td>
                  <p>Empty Projects</p>
                </td>
              </tr>
            ) : (
              projects?.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <Link
                        to={`/projects/${item?.name}/${item?.key}`}
                        className="hover:underline"
                      >
                        <ProjectName projectName={item?.name} />
                      </Link>
                    </td>
                    <td>{item?.key}</td>
                    <td>{item?.type || "Team managed software"}</td>
                    <td>
                      <Email
                        icon={item?.lead?.icon}
                        email={item?.lead || user.email}
                      />
                    </td>
                    <td>
                      <MoreLine
                        deleteProject={() => deleteProject(item?.key)}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
