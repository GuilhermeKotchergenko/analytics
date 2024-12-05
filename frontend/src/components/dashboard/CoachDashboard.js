import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const CoachDashboard = () => {
    const [athletes, setAthletes] = useState([]);

    useEffect(() => {
        fetchAthletes();
    }, []);

    const fetchAthletes = async () => {
        try {
            const res = await axios.get('/api/coach/athletes', {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setAthletes(res.data);
        } catch (err) {
            console.error(err.response.data);
        }
    };

    return (
        <div>
            <h1>Coach Dashboard</h1>
            {athletes.map(athlete => (
                <div key={athlete._id}>
                    <h2>{athlete.name}</h2>
                    {/* Display graphs */}
                    {athlete.athleteData && athlete.athleteData.internalLoad && athlete.athleteData.internalLoad.length > 0 ? (
                        <LineChart width={600} height={300} data={athlete.athleteData.internalLoad}>
                            <CartesianGrid strokeDasharray='3 3' />
                            <XAxis dataKey='date' />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type='monotone' dataKey='sessionRPE' name='Session RPE' stroke='#8884d8' />
                        </LineChart>
                    ) : (
                        <p>No internal load data available for this athlete.</p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default CoachDashboard;
