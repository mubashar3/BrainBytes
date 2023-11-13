import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import images from '../../asstes/images';
import CreateIssueBox from './CreateIssueBox';
import axios from 'axios';

const ProjectScreen = () => {
    const URL = 'http://localhost:3001';
    const { projectName } = useParams();
    const [editedProjectName, setEditedProjectName] = useState(projectName);
    const [isEditing, setIsEditing] = useState(false);
    const [issues, setIssues] = useState([]);
    const [project, setProject] = useState({});
    const projectData = useParams();
    const key = projectData.projectKey;


    const handleAddIssue = (issueText) => {
        setIssues([...issues, issueText]);
    };


    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(`${URL}/api/getproject/${key}`);
                const project = response.data;
                setProject(project);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        })();
    }, []);


    const handleEditName = async () => {
        try {
            if (editedProjectName.trim() === '') {
                setIsEditing(false);
                return;
            }
            const response = await axios.put(`${URL}/api/updateprojectname/${key}`, {
                projectName: editedProjectName
            });
            if (response.status === 200) {
                console.log('Project Updated Successfully');
                setIsEditing(false);
            }
        } catch (e) {
            console.error('Error updating project name:', e.message);
        }
    }


    return (
        <div className='flex flex-col gap-8'>
            <Navbar />
            <div className='w-[90%] m-auto flex flex-col gap-6'>
                <div className='w-full flex flex-col gap-4'>
                    <p className='font-bold flex gap-1'>
                        <Link to={'/'} className='hover:underline'>
                            Projects
                        </Link>/
                        <span>
                            {projectName}
                        </span>
                    </p>
                    <div onBlur={handleEditName}>
                        <input className='bg-transparent p-1 border-2 border-transparent focus:rounded-md focus:border-2 focus:border-[#85b8ff] focus:outline-none' type="text" disabled={isEditing} value={editedProjectName} onChange={(e) => setEditedProjectName(e.target.value)} />
                    </div>
                </div>
                <div className='w-full flex gap-3 items-center'>
                    <div className='flex w-[150px] border-[1px] border-gray-600 justify-between items-center rounded-md'>
                        <input type="text" className='p-2 w-[80%] bg-transparent focus:outline-none' />
                        <button>
                            <img src={images.search} alt="search" className='h-6' />
                        </button>
                    </div>
                    <button className='w-8'>
                        <img src={images.profile} alt="" />
                    </button>
                    <button className='p-1 bg-[#252a2e] rounded-full'>
                        <img src={images.addFriend} alt="" className='w-6' />
                    </button>
                </div>
                <div className='flex gap-8'>
                    <CreateIssueBox
                        title={'TODO'}
                        handleAddIssue={handleAddIssue}
                        issues={issues}
                        projectkey={key}
                        project={project}
                    />
                    <CreateIssueBox
                        title={'IN PROGRESS'}
                        handleAddIssue={handleAddIssue}
                        issues={issues}
                        projectkey={key}
                        project={project}
                    />
                    <CreateIssueBox
                        title={'DONE ✔'}
                        handleAddIssue={handleAddIssue}
                        issues={issues}
                        projectkey={key}
                        project={project}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProjectScreen;
