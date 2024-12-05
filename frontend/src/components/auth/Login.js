import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const Login = (props) => {
    const { setAuthData } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            setAuthData({ token: res.data.token });
            props.history.push('/dashboard');
        } catch (err) {
            console.error(err.response.data);
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' />
            <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
            <button type='submit'>Login</button>
        </form>
    );
};

export default Login;
