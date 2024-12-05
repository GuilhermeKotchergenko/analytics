import React, { useContext } from 'react';
import CoachDashboard from './dashboard/CoachDashboard';
import AthleteDashboard from './dashboard/AthleteDashboard';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
    const { authData } = useContext(AuthContext);

    // Assuming authData includes user role
    const role = authData ? authData.role : null;

    if (role === 'coach') {
        return <CoachDashboard />;
    } else if (role === 'athlete') {
        return <AthleteDashboard />;
    } else {
        return <div>Loading...</div>;
    }
};

export default Dashboard;
