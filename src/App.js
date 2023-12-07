import { Outlet, useNavigate } from "react-router-dom";
import "./App.css";
import { useStateValue } from "./state/StateProvider";
import { useEffect } from "react";

function App() {
  const [{ user }] = useStateValue();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      return navigate("/login");
    }
  }, [user]);

  return (
    <div className="App">
      {/* <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path='/projects/:projectName/:projectKey' element={<ProjectScreen />} />
          <Route path='/profile' element={<Profile />} />
        </Routes>
      </BrowserRouter> */}
      <Outlet />
    </div>
  );
}

export default App;
