import React, { useState } from 'react';
import axios from 'axios';

function MarksTable({ data, onDataUpdate }) {
    const [editingEntryId, setEditingEntryId] = useState(null);
    const [editedName, setEditedName] = useState('');
    const [editedMarks, setEditedMarks] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [entryToDelete, setEntryToDelete] = useState(null);

    const calculateTotal = (marks) => marks.reduce((a, b) => a + b, 0);
    const calculateAverage = (marks) => (calculateTotal(marks) / marks.length).toFixed(2);
    const calculatePercentage = (marks) => ((calculateTotal(marks) / (marks.length * 100)) * 100).toFixed(2);

    const confirmDelete = (entry) => {
        setEntryToDelete(entry);
        setShowDeleteModal(true);
    };

    const handleFinalDelete = async () => {
        if (entryToDelete) {
            await axios.delete(`http://localhost:5000/api/marks/${entryToDelete._id}`);
            onDataUpdate();
            setShowDeleteModal(false);
            setEntryToDelete(null);
        }
    };

    const handleEdit = (entry) => {
        setEditingEntryId(entry._id);
        setEditedName(entry.name);
        setEditedMarks(entry.marks.join(','));
    };

    const handleCancel = () => {
        setEditingEntryId(null);
        setEditedName('');
        setEditedMarks('');
    };

    const handleSave = async (id) => {
        const updatedEntry = {
            name: editedName,
            marks: editedMarks.split(',').map(mark => parseInt(mark.trim()))
        };

        await axios.put(`http://localhost:5000/api/marks/${id}`, updatedEntry);
        onDataUpdate();
        setEditingEntryId(null);
    };

    const styles = {
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '20px',
            fontFamily: 'Arial, sans-serif',
        },
        th: {
            backgroundColor: '#007BFF',
            color: 'white',
            padding: '10px',
            textAlign: 'left',
        },
        td: {
            padding: '10px',
            borderBottom: '1px solid #ddd',
        },
        actionBtn: {
            marginRight: '10px',
            padding: '6px 12px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
        },
        editBtn: {
            backgroundColor: '#ffc107',
            color: 'black',
        },
        deleteBtn: {
            backgroundColor: '#dc3545',
            color: 'white',
        },
        saveBtn: {
            backgroundColor: '#28a745',
            color: 'white',
        },
        cancelBtn: {
            backgroundColor: '#6c757d',
            color: 'white',
        },
        input: {
            padding: '5px',
            width: '90%',
        },
        modalOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
        },
        modalContent: {
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '10px',
            width: '300px',
            textAlign: 'center',
            boxShadow: '0 0 10px rgba(0,0,0,0.25)',
        }
    };

    return (
        <>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Student ID</th>
                        <th style={styles.th}>Name</th>
                        <th style={styles.th}>Total</th>
                        <th style={styles.th}>Average</th>
                        <th style={styles.th}>Percentage</th>
                        <th style={styles.th}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((entry, index) => {
                        const isEditing = editingEntryId === entry._id;

                        const total = calculateTotal(entry.marks);
                        const average = calculateAverage(entry.marks);
                        const percentage = calculatePercentage(entry.marks);

                        return (
                            <tr key={index}>
                                <td style={styles.td}>{entry.studentId || 'N/A'}</td>
                                <td style={styles.td}>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editedName}
                                            onChange={(e) => setEditedName(e.target.value)}
                                            style={styles.input}
                                        />
                                    ) : (
                                        entry.name
                                    )}
                                </td>
                                <td style={styles.td}>
                                    {isEditing ? (
                                        calculateTotal(editedMarks.split(',').map(m => parseInt(m.trim()) || 0))
                                    ) : total}
                                </td>
                                <td style={styles.td}>
                                    {isEditing ? (
                                        calculateAverage(editedMarks.split(',').map(m => parseInt(m.trim()) || 0))
                                    ) : average}
                                </td>
                                <td style={styles.td}>
                                    {isEditing ? (
                                        calculatePercentage(editedMarks.split(',').map(m => parseInt(m.trim()) || 0))
                                    ) : `${percentage}%`}
                                </td>
                                <td style={styles.td}>
                                    {isEditing ? (
                                        <>
                                            <button
                                                style={{ ...styles.actionBtn, ...styles.saveBtn }}
                                                onClick={() => handleSave(entry._id)}
                                            >
                                                Save
                                            </button>
                                            <button
                                                style={{ ...styles.actionBtn, ...styles.cancelBtn }}
                                                onClick={handleCancel}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                style={{ ...styles.actionBtn, ...styles.editBtn }}
                                                onClick={() => handleEdit(entry)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                style={{ ...styles.actionBtn, ...styles.deleteBtn }}
                                                onClick={() => confirmDelete(entry)}
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {showDeleteModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h3>Confirm Deletion</h3>
                        <p>Are you sure you want to delete <strong>{entryToDelete?.name}</strong>'s record?</p>
                        <div style={{ marginTop: '20px' }}>
                            <button
                                type="button"
                                style={{ ...styles.actionBtn, ...styles.cancelBtn }}
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                style={{ ...styles.actionBtn, ...styles.deleteBtn, marginLeft: '10px' }}
                                onClick={handleFinalDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default MarksTable;
