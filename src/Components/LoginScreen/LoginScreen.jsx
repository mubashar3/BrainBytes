import React, { useEffect, useState } from 'react';
import images from '../../asstes/images';
import { useStateValue } from '../../state/StateProvider';
import { actionTypes } from '../../state/Reducer/Reducer'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginScreen = () => {
    const url = 'http://localhost:3001/api/signin';
    const navigate = useNavigate();
    const [visiblePassword, setVisiblePassword] = useState(false);
    const [{ user }, dispatch] = useStateValue();
    const [loginData, setLoginData] = useState(
        {
            email: '',
            password: ''
        }
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData(
            {
                ...loginData,
                [name]: value,
            },
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(url, loginData);

            if (response.status === 200) {
                const userData = response.data.user;
                await dispatch({
                    type: actionTypes.SET_USER,
                    user: userData,
                });
            } else {
                console.log('Login Failed');
            }
        } catch (error) {
            console.log("Server error: ", error.message);
        }
    };



    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            navigate('/');
        }
    }, [user, navigate]);

    return (
        <div className=" p-16 relative min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${images.loginBg})` }}>
            <div className='p-7 rounded-2xl w-[400px] gap-4 m-auto bg-[#121314] flex flex-col items-center'>
                <p className='font-bold'>Welcome to BrainBytes</p>
                <p className='font-bold text-2xl text-accent'>Login Here</p>
                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                    <label htmlFor="email" className='flex flex-col'>Email:
                        <input
                            type="text"
                            id='email'
                            name='email'
                            className='p-2 bg-transparent border-b-[1px] focus:outline-none'
                            value={loginData.email}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label htmlFor="password" className='flex flex-col relative'>Password:
                        <input
                            type={`${!visiblePassword ? "password" : "text"}`}
                            name='password'
                            id='password'
                            className='p-2 pr-6 bg-transparent border-b-[1px] focus:outline-none'
                            autoComplete='off'
                            value={loginData.password}
                            onChange={handleChange}
                            required
                        />
                        <div onClick={() => { setVisiblePassword((prev) => !prev) }} className='absolute right-1 bottom-2'><img className='w-4' src={`${!visiblePassword ? images.visibility : images.visibilityHide}`} alt="" /></div>
                    </label>
                    <button type="submit" className='btn-accent btn'>Login</button>
                </form>
            </div>
        </div>
    );
};

export default LoginScreen;
