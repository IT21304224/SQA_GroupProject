// client/src/App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [name, setName] = useState('');
    const [marks, setMarks] = useState('');
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/marks')
            .then(response => setData(response.data))
            .catch(error => console.error(error));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || marks.length === 0) return;

        const parsedMarks = marks.split(',').map(Number);
        await axios.post('http://localhost:5000/api/marks', { name, marks: parsedMarks });

        setName('');
        setMarks('');
        window.location.reload();
    };

    const calculateTotal = (marks) => marks.reduce((a, b) => a + b, 0);
    const calculateAverage = (marks) => (calculateTotal(marks) / marks.length).toFixed(2);
    const calculatePercentage = (marks) => ((calculateTotal(marks) / (marks.length * 100)) * 100).toFixed(2);

    const calculateGrade = (percentage) => {
        if (percentage >= 90) return 'A';
        if (percentage >= 80) return 'B';
        if (percentage >= 70) return 'C';
        if (percentage >= 60) return 'D';
        return 'F';
    };

    return (
        <div className="container">
            <h1>Marks Calculation</h1>
            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter Name"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="marks">Marks (comma-separated)</label>
                    <input
                        type="text"
                        id="marks"
                        value={marks}
                        onChange={(e) => setMarks(e.target.value)}
                        placeholder="Enter Marks"
                        required
                    />
                </div>
                <button type="submit">Submit</button>
            </form>

            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Total Marks</th>
                        <th>Average</th>
                        <th>Percentage</th>
                        <th>Grade</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((entry, index) => {
                        const total = calculateTotal(entry.marks);
                        const average = calculateAverage(entry.marks);
                        const percentage = calculatePercentage(entry.marks);
                        const grade = calculateGrade(percentage);

                        return (
                            <tr key={index}>
                                <td>{entry.name}</td>
                                <td>{total}</td>
                                <td>{average}</td>
                                <td>{percentage}%</td>
                                <td>{grade}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default App;
