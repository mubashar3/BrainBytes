import React, { useEffect, useRef, useState } from 'react';
import images from '../../asstes/images';
import { useStateValue } from '../../state/StateProvider'
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [{ user }] = useStateValue();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = (event) => {
        event.stopPropagation();
        setIsDropdownOpen(!isDropdownOpen);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };


    const logout = () => {
        localStorage.removeItem('user');
    }


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                closeDropdown();
            }
        };

        window.addEventListener('click', handleClickOutside);

        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, []);


    return (
        <div>
            <nav className='flex justify-between items-center h-16 border-b-[1px] border-gray-600 px-10'>
                <h1 className='font-bold text-xl'>BrainBytes</h1>
                <button className='w-8 relative' onClick={toggleDropdown}>
                    <img src={images.profile} alt="profile" />
                </button>
            </nav >
            {
                isDropdownOpen && (
                    <div ref={dropdownRef} className='fixed py-5 z-50 right-0 w-80 mr-4 border border-[#3c4750] bg-[#282e33] flex flex-col gap-6 rounded-md'>
                        <div className='px-4 flex flex-col gap-4'>
                            <p className='text-sm font-bold'>Account</p>
                            <div className='flex items-center gap-1'>
                                <div className='w-8'>
                                    <img src={images.profile} alt="profile" />
                                </div>
                                <div>
                                    <h2 className='font-bold text-md'>
                                        {user.name}
                                    </h2>
                                    <h6 className='text-xs'>
                                        {user.email}
                                    </h6>
                                </div>
                            </div>
                            <div className='w-full p-[1px] bg-[#3c4750]'></div>
                            <div>
                                <Link to={'/profile'}>
                                    <div className='text-left p-2 cursor-pointer rounded-md hover:bg-[#3c475067]'>Profile</div>
                                </Link>
                                <div onClick={logout} className='text-left p-2 cursor-pointer rounded-md hover:bg-[#3c475067]'>Logout</div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Navbar;
