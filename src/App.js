import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { useStateValue } from "./state/StateProvider";
import { useEffect } from "react";
import { GET_PROJECTS } from "./routes/route";
import { actionTypes } from "./state/Reducer/Reducer";
import axios from "axios";
import { useState } from "react";
import LoginScreen from "./Components/LoginScreen/LoginScreen";
import Dashboard from "./Components/Dashboard/Dashboard";
import ProjectScreen from "./Components/ProjectScreen/ProjectScreen";
import Profile from "./Components/Profile/Profile";

function App() {
  const [{ user, projects }, dispatch] = useStateValue();
  const [projectsLoader, setProjectsLoader] = useState(false);

  const Authentication = ({ children }) => {
    return user ? children : <Navigate to={"/login"} />;
  };

  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (!user) {
  //     return navigate("/login");
  //   }
  // }, [user]);

  const getProjects = async () => {
    if (
      projects === undefined ||
      projectsLoader ||
      user === undefined ||
      user?.id === undefined
    ) {
      return;
    }
    try {
      setProjectsLoader(true);
      const response = await axios.get(`${GET_PROJECTS}/${user?.id}`);
      const proj = response.data;
      if (response.status === 200) {
        dispatch({
          type: actionTypes.SET_PROJECTS,
          projects: proj,
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
    if (!projectsLoader && projects === null) {
      getProjects();
    }
  }, [user, projects]);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route
            path="/"
            element={
              <Authentication>
                <Dashboard />
              </Authentication>
            }
          />
          <Route
            path="/projects/:projectKey"
            element={
              <Authentication>
                <ProjectScreen />
              </Authentication>
            }
          />
          <Route
            path="/profile"
            element={
              <Authentication>
                <Profile />
              </Authentication>
            }
          />
        </Routes>
      </BrowserRouter>
      {/* <Outlet /> */}
    </div>
  );
}

export default App;
