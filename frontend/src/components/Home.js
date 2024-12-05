import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            <h1>Welcome to Fitness Analytics</h1>
            <p>This is the home page.</p>
            <nav>
                <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
            </nav>
        </div>
    );
};

export default Home;
