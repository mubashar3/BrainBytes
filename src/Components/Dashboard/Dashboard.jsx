import React, { useEffect, useState } from 'react';
import Email from './Email';
import ProjectName from './ProjectName';
import MoreLine from './MoreLine';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import AddProjectModal from './AddProjectModal';
import { v4 as uuid4 } from 'uuid';
import axios from 'axios';
import { useStateValue } from '../../state/StateProvider';
import { actionTypes } from '../../state/Reducer/Reducer';


const Dashboard = () => {
    const URL = 'http://localhost:3001';
    const [projectKey, setProjectKey] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [{ user, projects }, dispatch] = useStateValue();



    const handleProjectSubmit = async (e) => {
        e.preventDefault();
        if (projectName.length === 0) {
            alert('Project name is required');
            return;
        }
        const projectData = {
            projectKey,
            projectName,
            email: user.email
        }
        try {
            const response = axios.post(`${URL}/api/addproject`, projectData)
            if ((await response).status === 200) {
                setProjectName('');
            }
        } catch (error) {
            console.log("server error: ", error.message)
        }
    };


    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(`${URL}/api/getprojects`);
                const projects = response.data;
                dispatch({
                    type: actionTypes.SET_PROJECTS,
                    projects: projects
                })
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        })();
    }, [dispatch]);


    const deleteProject = async (key) => {
        try {
            await axios.delete(`${URL}/api/deleteproject/${key}`);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };


    useEffect(() => {
        setProjectKey(uuid4());
    }, [isActive])

    return (
        <div className='flex flex-col gap-8'>
            <Navbar />
            <div className='w-[95%] m-auto'>
                <div className='flex items-center justify-between'>
                    <p className='font-bold text-2xl'>Projects</p>
                    <button className='btn btn-accent' onClick={() => document.getElementById('AddProjectModal').showModal()}>Create Project</button>
                    <AddProjectModal
                        projectKey={projectKey}
                        isActive={isActive}
                        setIsActive={setIsActive}
                        projectName={projectName}
                        setProjectName={(e) => setProjectName(e.target.value)}
                        handleProjectSubmit={handleProjectSubmit}
                    />
                </div>
                <table border={1} className='text-left w-full'>
                    <thead className='h-12 border-b-[1px] border-gray-600'>
                        <tr>
                            <th>Name</th>
                            <th>KeyId</th>
                            <th>Type</th>
                            <th>Lead</th>
                        </tr>
                    </thead>
                    <tbody className='border-gray-600' style={{ columnSpan: "2" }}>
                        {
                            projects === null ?
                                <tr>
                                    <td className='h-40 text-center' colSpan={4}>
                                        <span className="loading loading-spinner loading-lg"></span>
                                    </td>
                                </tr> :
                                projects.length === 0 ?
                                    <tr>
                                        <td className='h-40 text-center' colSpan={4}>
                                            <p className='text-gray-600 text-3xl'>Empty Projects</p>
                                        </td>
                                    </tr> :
                                    projects.map((item, index) => {
                                        return (
                                            <tr key={index} className='h-12' >
                                                <td>
                                                    <Link to={`/projects/${item.name}/${item.key}`} className='hover:underline'>
                                                        <ProjectName projectName={item.name} />
                                                    </Link>
                                                </td>
                                                <td>
                                                    {item.key}
                                                </td>
                                                <td>
                                                    {item.type}
                                                </td>
                                                <td>
                                                    <Email icon={item.lead.icon} email={item.lead} />
                                                </td>
                                                <td>
                                                    <MoreLine deleteProject={() => deleteProject(item.key)} />
                                                </td>
                                            </tr>
                                        )
                                    })
                        }
                    </tbody>
                </table>
            </div>
        </div >
    )
}

export default Dashboard;
