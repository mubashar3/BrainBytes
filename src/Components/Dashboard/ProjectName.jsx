import React from 'react';

const ProjectName = ({ image, projectName }) => {
    return (
        <div className='flex items-center gap-1'>
            {/* <img src={image} alt="project" className='w-6' /> */}
            {projectName}
        </div>
    )
}

export default ProjectName;
