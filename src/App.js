import { Outlet, useNavigate } from "react-router-dom";
import "./App.css";
import { useStateValue } from "./state/StateProvider";
import { useEffect } from "react";
import { GET_PROJECTS } from "./routes/route";
import { actionTypes } from "./state/Reducer/Reducer";
import axios from "axios";
import { useState } from "react";

function App() {
  const [{ user, projects }, dispatch] = useStateValue();
  const [projectsLoader, setProjectsLoader] = useState(false);
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
    console.log("object");
    if (!projectsLoader && projects === null) {
      getProjects();
    }
  }, [user, projects]);

  return (
    <div className="App">
      {/* <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route
            path="/"
            element={user ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route path="/projects/:projectKey" element={<ProjectScreen />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter> */}
      <Outlet />
    </div>
  );
}

export default App;
