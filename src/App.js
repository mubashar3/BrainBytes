import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginScreen from './Components/LoginScreen/LoginScreen';
import { useStateValue } from './state/StateProvider'
import { useEffect } from 'react';
import { actionTypes } from './state/Reducer/Reducer';
import Dashboard from './Components/Dashboard/Dashboard';
import ProjectScreen from './Components/ProjectScreen/ProjectScreen';
import Profile from './Components/Profile/Profile';
function App() {

  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parseUserData = JSON.parse(userData);
        dispatch({
          type: actionTypes.SET_USER,
          user: parseUserData
        });
      }
    } catch (error) {
      console.error('Error parsing user data from local storage:', error);
    }
  }, [dispatch]);


  return (
    < div className="App" >
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path='/projects/:projectName/:projectKey' element={<ProjectScreen />} />
          <Route path='/profile' element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </ div>
  );
}

export default App;
