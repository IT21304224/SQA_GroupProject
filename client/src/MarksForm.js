import React, { useState } from 'react';
import axios from 'axios';

function MarksForm({ onDataUpdate }) {
    const [studentId, setStudentId] = useState('');
    const [name, setName] = useState('');
    const [subjects, setSubjects] = useState([{ subject: '', mark: '' }]);
    const [editingId, setEditingId] = useState(null);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [formErrors, setFormErrors] = useState('');

    const styles = {
        container: {
            maxWidth: '600px',
            margin: '0 auto',
            padding: '20px',
            background: '#f9f9f9',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            fontFamily: 'Arial, sans-serif'
        },
        label: {
            display: 'block',
            marginBottom: '5px',
            fontWeight: 'bold',
        },
        input: {
            width: '100%',
            padding: '8px',
            marginBottom: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            fontSize: '14px'
        },
        error: {
            color: 'red',
            marginBottom: '10px',
            fontSize: '14px',
        },
        button: {
            padding: '10px 15px',
            margin: '5px 5px 10px 0',
            backgroundColor: '#007BFF',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
        },
        removeButton: (isHovered) => ({
            padding: '5px 10px',
            backgroundColor: isHovered ? '#dc3545' : '#f8d7da',
            color: isHovered ? 'white' : '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '5px',
            cursor: 'pointer',
            marginLeft: '10px',
            transition: 'all 0.2s ease'
        }),
        modalOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        },
        modalContent: {
            background: '#fff',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            minWidth: '300px',
            textAlign: 'center'
        }
    };

    const handleSubjectChange = (index, field, value) => {
        const updatedSubjects = [...subjects];
        updatedSubjects[index][field] = value;
        setSubjects(updatedSubjects);
    };

    const addSubject = () => {
        setSubjects([...subjects, { subject: '', mark: '' }]);
    };

    const removeSubject = (index) => {
        const updatedSubjects = subjects.filter((_, i) => i !== index);
        setSubjects(updatedSubjects);
    };

    const validateForm = () => {
        if (!studentId.trim() || !name.trim()) {
            setFormErrors('Student ID and Name are required.');
            return false;
        }

        if (!/^[A-Za-z0-9]+$/.test(studentId)) {
            setFormErrors("Student ID must be alphanumeric.");
            return false;
        }

        if (name.length < 3) {
            setFormErrors("Name should be at least 3 characters long.");
            return false;
        }

        const subjectNames = subjects.map(s => s.subject.trim());
        const uniqueSubjects = new Set(subjectNames);
        if (uniqueSubjects.size !== subjectNames.length) {
            setFormErrors("Subject names must be unique.");
            return false;
        }

        if (subjects.length > 10) {
            setFormErrors("You can only add up to 10 subjects.");
            return false;
        }

        for (let i = 0; i < subjects.length; i++) {
            const { subject, mark } = subjects[i];
            if (subject.trim() === '') {
                setFormErrors(`Subject name at row ${i + 1} cannot be empty.`);
                return false;
            }

            if (mark === '' || isNaN(mark) || mark < 0 || mark > 100 || !Number.isInteger(Number(mark))) {
                setFormErrors(`Mark at row ${i + 1} must be an integer between 0 and 100.`);
                return false;
            }
        }

        setFormErrors('');
        return true;
    };

    const handleFinalSubmit = async () => {
        if (!validateForm()) return;

        const marks = subjects.map(s => Number(s.mark));
        const payload = { studentId, name, marks };

        try {
            if (editingId) {
                await axios.put(`http://localhost:5000/api/marks/${editingId}`, payload);
            } else {
                await axios.post('http://localhost:5000/api/marks', payload);
            }

            setShowModal(false);
            setShowConfirmation(true);
            setTimeout(() => setShowConfirmation(false), 3000); // auto-close after 3s
            onDataUpdate();
            resetForm();
        } catch (error) {
            console.error("Submission failed:", error);
            setFormErrors("Submission failed. Please try again.");
        }
    };

    const resetForm = () => {
        setStudentId('');
        setName('');
        setSubjects([{ subject: '', mark: '' }]);
        setEditingId(null);
    };

    return (
        
        <form style={styles.container} onSubmit={(e) => e.preventDefault()}>
            {formErrors && <div style={styles.error}>{formErrors}</div>}
            <div>
                <h1>Marks Calculation</h1>
                <label style={styles.label}>Student ID</label>
                <input
                    style={styles.input}
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                />
            </div>
            <div>
                <label style={styles.label}>Name</label>
                <input
                    style={styles.input}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            {subjects.map((subject, index) => (
                <div key={index}>
                    <input
                        style={styles.input}
                        type="text"
                        placeholder="Subject Name"
                        value={subject.subject}
                        onChange={(e) => handleSubjectChange(index, 'subject', e.target.value)}
                    />
                    <input
                        style={styles.input}
                        type="number"
                        placeholder="Mark"
                        value={subject.mark}
                        onChange={(e) => handleSubjectChange(index, 'mark', e.target.value)}
                    />
                    {subjects.length > 1 && (
                        <button
                            type="button"
                            style={styles.removeButton(hoveredIndex === index)}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            onClick={() => removeSubject(index)}
                        >
                            Remove
                        </button>
                    )}
                </div>
            ))}

            <div>
                <button type="button" style={styles.button} onClick={addSubject}>Add Subject</button>
                <button type="button" style={styles.button} onClick={() => {
                    if (validateForm()) setShowModal(true);
                }}>
                    {editingId ? 'Update' : 'Submit'}
                </button>
                <button type="button" style={styles.button} onClick={resetForm}>Clear</button>
            </div>

            {showModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h3>Please confirm</h3>
                        <p>Are you sure you want to submit changes?</p>
                        <div style={{ marginTop: '20px' }}>
                            <button
                                type="button"
                                style={{ ...styles.button, backgroundColor: '#6c757d' }}
                                onClick={() => setShowModal(false)}
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                style={{ ...styles.button, backgroundColor: '#28a745', marginLeft: '10px' }}
                                onClick={handleFinalSubmit}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showConfirmation && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h3 style={{ color: '#28a745' }}>✅ Success!</h3>
                        <p>Your submission was successful.</p>
                    </div>
                </div>
            )}
        </form>
    );
}

export default MarksForm;
