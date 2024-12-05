import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from 'recharts';

const AthleteDashboard = () => {
    const [athleteData, setAthleteData] = useState({});
    const [sessionRPE, setSessionRPE] = useState('');
    const [duration, setDuration] = useState('');
    const [effortRPE, setEffortRPE] = useState('');
    const [repetitions, setRepetitions] = useState('');
    const [wellBeing, setWellBeing] = useState({
        fatigue: '',
        sleepQuality: '',
        muscleSoreness: '',
        stress: '',
        mood: ''
    });
    const [externalLoadData, setExternalLoadData] = useState('');

    const [sessionActive, setSessionActive] = useState(false);
    const [sessionStartTime, setSessionStartTime] = useState(null);

    // Fetch athlete data when the component mounts
    useEffect(() => {
        fetchAthleteData();
    }, []);

    const fetchAthleteData = async () => {
        try {
            const res = await axios.get('/api/athlete/data', {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setAthleteData(res.data);
        } catch (err) {
            console.error(err.response.data);
        }
    };

    // Process athlete data
    const processAthleteData = useCallback(() => {
        if (athleteData.internalLoad) {
            athleteData.internalLoad.forEach((entry) => {
                entry.date = new Date(entry.date).toLocaleDateString();
            });
        }
        if (athleteData.wellBeing) {
            athleteData.wellBeing.forEach((entry) => {
                entry.date = new Date(entry.date).toLocaleDateString();
            });
        }
        if (athleteData.monotonyStrain) {
            athleteData.monotonyStrain.forEach((entry) => {
                entry.week = `Week ${entry.week}`;
            });
        }
    }, [
        athleteData.internalLoad,
        athleteData.wellBeing,
        athleteData.monotonyStrain
    ]);

    // Call processAthleteData whenever the dependencies change
    useEffect(() => {
        processAthleteData();
    }, [processAthleteData]);

    const submitInternalLoad = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                '/api/athlete/internal-load',
                {
                    sessionRPE,
                    duration,
                    effortRPE,
                    repetitions
                },
                {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                }
            );
            toast.success('Internal load data submitted!');
            setSessionRPE('');
            setDuration('');
            setEffortRPE('');
            setRepetitions('');
            fetchAthleteData();
        } catch (err) {
            console.error(err.response.data);
            toast.error('Error submitting internal load data');
        }
    };

    const submitWellBeing = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/athlete/well-being', wellBeing, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            toast.success('Well-being data submitted!');
            setWellBeing({
                fatigue: '',
                sleepQuality: '',
                muscleSoreness: '',
                stress: '',
                mood: ''
            });
            fetchAthleteData();
        } catch (err) {
            console.error(err.response.data);
            toast.error('Error submitting well-being data');
        }
    };

    const onWellBeingChange = (e) => {
        setWellBeing({ ...wellBeing, [e.target.name]: e.target.value });
    };

    const submitExternalLoad = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                '/api/athlete/external-load',
                {
                    data: externalLoadData
                },
                {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                }
            );
            toast.success('External load data submitted!');
            setExternalLoadData('');
            fetchAthleteData();
        } catch (err) {
            console.error(err.response.data);
            toast.error('Error submitting external load data');
        }
    };

    const startSession = () => {
        setSessionActive(true);
        setSessionStartTime(new Date());
    };

    const endSession = () => {
        setSessionActive(false);
        const sessionEndTime = new Date();
        const sessionDuration = (sessionEndTime - sessionStartTime) / 60000; // Duration in minutes
        setDuration(sessionDuration);
        toast.info('Please submit your Session RPE after 10 minutes.');
        // Set a timeout to remind the athlete
        setTimeout(() => {
            toast.info('Please submit your Session RPE now.');
        }, 10 * 60 * 1000); // 10 minutes
    };

    return (
        <div>
            <h1>Athlete Dashboard</h1>

            {/* Session Control Buttons */}
            {!sessionActive ? (
                <button onClick={startSession}>Start Training Session</button>
            ) : (
                <button onClick={endSession}>End Training Session</button>
            )}

            {/* Internal Load Form */}
            <h2>Submit Internal Load Data</h2>
            <form onSubmit={submitInternalLoad}>
                <input
                    type='number'
                    value={sessionRPE}
                    onChange={(e) => setSessionRPE(e.target.value)}
                    placeholder='Session RPE (0-10)'
                    min='0'
                    max='10'
                    required
                />
                <input
                    type='number'
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder='Duration (minutes)'
                    min='0'
                    required
                />
                <input
                    type='number'
                    value={effortRPE}
                    onChange={(e) => setEffortRPE(e.target.value)}
                    placeholder='Effort RPE (0-10)'
                    min='0'
                    max='10'
                />
                <input
                    type='number'
                    value={repetitions}
                    onChange={(e) => setRepetitions(e.target.value)}
                    placeholder='Repetitions'
                    min='0'
                />
                <button type='submit'>Submit Internal Load</button>
            </form>

            {/* External Load Form */}
            <h2>Submit External Load Data</h2>
            <form onSubmit={submitExternalLoad}>
                <textarea
                    value={externalLoadData}
                    onChange={(e) => setExternalLoadData(e.target.value)}
                    placeholder='Enter external load data (e.g., weight, reps, sets)'
                    required
                />
                <button type='submit'>Submit External Load</button>
            </form>

            {/* Well-being Form */}
            <h2>Submit Well-being Data</h2>
            <form onSubmit={submitWellBeing}>
                <input
                    type='number'
                    name='fatigue'
                    value={wellBeing.fatigue}
                    onChange={onWellBeingChange}
                    placeholder='Fatigue (1-7)'
                    min='1'
                    max='7'
                    required
                />
                <input
                    type='number'
                    name='sleepQuality'
                    value={wellBeing.sleepQuality}
                    onChange={onWellBeingChange}
                    placeholder='Sleep Quality (1-7)'
                    min='1'
                    max='7'
                    required
                />
                <input
                    type='number'
                    name='muscleSoreness'
                    value={wellBeing.muscleSoreness}
                    onChange={onWellBeingChange}
                    placeholder='Muscle Soreness (1-7)'
                    min='1'
                    max='7'
                    required
                />
                <input
                    type='number'
                    name='stress'
                    value={wellBeing.stress}
                    onChange={onWellBeingChange}
                    placeholder='Stress (1-7)'
                    min='1'
                    max='7'
                    required
                />
                <input
                    type='number'
                    name='mood'
                    value={wellBeing.mood}
                    onChange={onWellBeingChange}
                    placeholder='Mood (1-7)'
                    min='1'
                    max='7'
                    required
                />
                <button type='submit'>Submit Well-being</button>
            </form>

            {/* Display Graphs */}
            <div>
                <h2>Internal Load Over Time</h2>
                {athleteData.internalLoad && athleteData.internalLoad.length > 0 ? (
                    <LineChart width={600} height={300} data={athleteData.internalLoad}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='date' />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type='monotone'
                            dataKey='sessionRPE'
                            name='Session RPE'
                            stroke='#8884d8'
                        />
                        <Line
                            type='monotone'
                            dataKey='effortRPE'
                            name='Effort RPE'
                            stroke='#82ca9d'
                        />
                    </LineChart>
                ) : (
                    <p>No internal load data available.</p>
                )}
            </div>

            <div>
                <h2>Well-being Over Time</h2>
                {athleteData.wellBeing && athleteData.wellBeing.length > 0 ? (
                    <LineChart width={600} height={300} data={athleteData.wellBeing}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='date' />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type='monotone'
                            dataKey='fatigue'
                            name='Fatigue'
                            stroke='#8884d8'
                        />
                        <Line
                            type='monotone'
                            dataKey='sleepQuality'
                            name='Sleep Quality'
                            stroke='#82ca9d'
                        />
                        <Line
                            type='monotone'
                            dataKey='muscleSoreness'
                            name='Muscle Soreness'
                            stroke='#ffc658'
                        />
                        <Line
                            type='monotone'
                            dataKey='stress'
                            name='Stress'
                            stroke='#ff7300'
                        />
                        <Line
                            type='monotone'
                            dataKey='mood'
                            name='Mood'
                            stroke='#0088fe'
                        />
                    </LineChart>
                ) : (
                    <p>No well-being data available.</p>
                )}
            </div>

            {/* Monotony and Strain Graph */}
            <div>
                <h2>Monotony and Strain Over Weeks</h2>
                {athleteData.monotonyStrain &&
                    athleteData.monotonyStrain.length > 0 ? (
                    <LineChart
                        width={600}
                        height={300}
                        data={athleteData.monotonyStrain}
                    >
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='week' />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type='monotone'
                            dataKey='monotony'
                            name='Monotony'
                            stroke='#8884d8'
                        />
                        <Line
                            type='monotone'
                            dataKey='strain'
                            name='Strain'
                            stroke='#82ca9d'
                        />
                    </LineChart>
                ) : (
                    <p>No monotony and strain data available.</p>
                )}
            </div>
        </div>
    );
};

export default AthleteDashboard;
