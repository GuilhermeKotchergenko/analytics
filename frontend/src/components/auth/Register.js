import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Register = () => {
    const { setAuthData } = useContext(AuthContext);
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'athlete', // Default role
    });

    const navigate = useNavigate();

    const { name, email, password, role } = userData;

    const onChange = (e) =>
        setUserData({ ...userData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/auth/register', userData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', role); // Store role in localStorage
            setAuthData({ token: res.data.token, role });
            navigate('/dashboard');
        } catch (err) {
            console.error('Registration error:', err.response || err);
            const errorMessage =
                err.response?.data?.msg ||
                err.response?.statusText ||
                'Registration failed';
            alert(errorMessage);
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <input
                type='text'
                name='name'
                value={name}
                onChange={onChange}
                placeholder='Name'
                required
            />
            <input
                type='email'
                name='email'
                value={email}
                onChange={onChange}
                placeholder='Email'
                required
            />
            <input
                type='password'
                name='password'
                value={password}
                onChange={onChange}
                placeholder='Password'
                required
            />
            <select name='role' value={role} onChange={onChange}>
                <option value='coach'>Coach</option>
                <option value='athlete'>Athlete</option>
            </select>
            <button type='submit'>Register</button>
        </form>
    );
};

export default Register;
