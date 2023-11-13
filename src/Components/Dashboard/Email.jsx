import React from 'react';

const Email = ({ icon, email }) => {
    return (
        <div className='flex items-center gap-1'>
            {/* <img src={icon} alt="email" className='w-6' /> */}
            {email}
        </div>
    )
}

export default Email;
