import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MarksForm from './MarksForm';
import MarksTable from './MarksTable';

function App() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        axios.get('http://localhost:5000/api/marks')
            .then(response => setData(response.data))
            .catch(error => console.error(error));
    };

    const handleDataUpdate = () => {
        fetchData();
    };

    return (
        <div className="container">
            <MarksForm onDataUpdate={handleDataUpdate} />
            <MarksTable data={data} onDataUpdate={handleDataUpdate} />
        </div>
    );
}

export default App;
