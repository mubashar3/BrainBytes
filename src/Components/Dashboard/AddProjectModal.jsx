import React from 'react';
import images from '../../asstes/images';

const AddProjectModal = ({ projectKey, setProjectKey, isActive, setIsActive, projectName, setProjectName, handleProjectSubmit }) => {

    return (
        <dialog id="AddProjectModal" className="modal">
            <div className="modal-box min-w-[50%]">
                <p className="font-bold text-lg">Add project details</p>
                <p className="py-4 text-sm">Explore what's pssible when you collaborate with your team. Edit project details anytime in project settings.</p>
                <div className='flex flex-col gap-4'>
                    <div className='flex flex-col gap-1 text-sm'>
                        <label htmlFor="projectName" className='font-bold'>Name <span className='text-[#CE817C]'>*</span>
                        </label>
                        <input
                            required
                            autoFocus={isActive}
                            value={projectName}
                            onChange={setProjectName}
                            placeholder='Try a team name, project goal, milestone...'
                            type="text" id='projectName' className={`w-96 border-2 border-[#3D474F] bg-[#282e33] p-[6px] ${projectName.length === 0 ? 'focus:border-[#f15b50] border-[#f15b50]' : 'focus:border-[#85b8ff]'} focus:outline-none rounded-sm`}
                        />
                        {
                            isActive && projectName.length === 0 && (<div className='flex gap-1'>
                                <img src={images.warning} alt="" className='w-3' />
                                <p className='text-xs text-[#CE817C]'>Your new project needs a name</p>
                            </div>)
                        }
                    </div>
                    <div className='flex flex-col gap-1 text-sm'>
                        <label className='flex items-center gap-1' htmlFor='key'>
                            Key
                            <div className='flex items-center gap-[1px]'><img src={images.info} alt="info" className='w-4' /><span className='text-[#CE817C]'>*</span></div>
                        </label>
                        <input
                            disabled
                            value={projectKey}
                            onChange={setProjectKey}
                            type="text" id='key' className={`w-40 border-2 border-[#3D474F] bg-[#282e33] p-[6px] focus:border-[#85b8ff] focus:outline-none rounded-sm`}
                        />
                    </div>
                </div>
                <div className="modal-action">
                    <button className='btn btn-accent' onClick={handleProjectSubmit}>Create project</button>
                    <form method="dialog">
                        <button onClick={setIsActive} className="btn">Close</button>
                    </form>
                </div>
            </div>
        </dialog >
    )
}

export default AddProjectModal;
