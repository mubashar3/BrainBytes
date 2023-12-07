import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { StateProvider } from "./state/StateProvider";
import reducer, { initialState } from "./state/Reducer/Reducer";
import {
  Navigate,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Dashboard from "./Components/Dashboard/Dashboard";
import LoginScreen from "./Components/LoginScreen/LoginScreen";
import ProjectScreen from "./Components/ProjectScreen/ProjectScreen.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<Dashboard />} />
      <Route
        path="/projects/:projectName/:projectKey"
        element={<ProjectScreen />}
      />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/*" element={<Navigate to={"/"} replace />} />
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <StateProvider initialState={initialState} reducer={reducer}>
      <RouterProvider router={router} />
    </StateProvider>
  </React.StrictMode>
);

reportWebVitals();
