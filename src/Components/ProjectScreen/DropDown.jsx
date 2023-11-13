import React, { useState, useRef, useEffect } from 'react';
import images from '../../asstes/images';
import axios from 'axios';

const DropDown = ({ title, issue, projectkey }) => {
    const URL = 'http://localhost:3001';
    const [showDropDown, setShowDropDown] = useState(false);
    const dropdownRef = useRef(null);

    const updateStatus = async () => {
        let newStatus;
        if (issue.status === 'TODO') {
            newStatus = 'IN PROGRESS';
        } else if (issue.status === 'IN PROGRESS') {
            newStatus = 'DONE ✔'
        }
        try {
            const response = axios.put(`${URL}/api/updatestatus/${projectkey}/${issue._id}`, { status: newStatus });
            if ((await response).status === 200) {
                console.log('Issue Added Successfully');
                setShowDropDown(false);
            }
        }
        catch (e) {
            console.log('Error: ', e);
        }
    }

    const deleteIssue = async () => {
        try {
            const response = axios.delete(`${URL}/api/deleteissue/${projectkey}/${issue._id}`);
            if ((await response).status === 200) {
                console.log('Issue Deleted Successfully');
                setShowDropDown(false);
            }
        }
        catch (e) {
            console.log('Error: ', e);
        }
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropDown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div>
            <button onClick={() => setShowDropDown(!showDropDown)} className={`p-2 hover:bg-[#6f7477] rounded-md`}>
                <img src={images.moreLine} alt="options" className='w-5' />
            </button>
            {
                showDropDown &&
                <div ref={dropdownRef} className='absolute right-1 z-50 flex flex-col gap-2 bg-[#282e33] rounded-md border border-[#3c4750] p-3 w-48'>
                    <button onClick={deleteIssue} className='text-left'>Delete</button>
                    <button onClick={updateStatus} className={`${issue.status === 'DONE ✔' ? 'hidden' : null} text-left`}>
                        {issue.status === 'TODO' ? 'Move to progress' : issue.status === 'IN PROGRESS' ? 'Done' : null}
                    </button>

                </div>
            }
        </div>
    )
}

export default DropDown;
