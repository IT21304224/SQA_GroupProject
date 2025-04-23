// src/pages/StudentForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // To redirect after success
import { createStudent } from '../services/studentApi';
import './StudentForm.css'; // We'll create this CSS file next

function StudentForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Initialize with empty strings or default values matching the backend model
    // Basic Info
    fullName: '',
    username: '',
    email: '',
    dateOfBirth: '', // Use 'YYYY-MM-DD' format for date input
    gender: '',
    phone: '',
    alternatePhone: '',
    height: '',
    weight: '',
    // Contact Details
    permanentAddress: '',
    currentAddress: '',
    // Address Details
    city: '',
    state: '',
    zipCode: '',
    country: '',
    // Academic Info
    courseProgram: '',
    department: '',
    // Parent/Guardian Info
    fatherName: '',
    motherName: '',
    guardianName: '',
    guardianContact: '',
    // Emergency Contact (Initialize nested objects)
    emergencyContact1: { name: '', phone: '' },
    emergencyContact2: { name: '', phone: '' },
    // --- Add fields for document uploads later ---
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // To display API errors
  const [success, setSuccess] = useState(false); // To display success message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Special handler for nested emergency contacts
  const handleEmergencyChange = (e, contactNumber) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
        ...prevState,
        [`emergencyContact${contactNumber}`]: {
            ...prevState[`emergencyContact${contactNumber}`],
            [name]: value
        }
    }));
};

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Optional: Add frontend validation here before sending
      console.log("Submitting Data: ", formData); // Debugging line
      const createdStudent = await createStudent(formData);
      console.log('Student Created:', createdStudent);
      setSuccess(true);
      // Optionally reset form:
      // setFormData({ ...initial state... });
      setLoading(false);
      // Redirect to the newly created student's profile page
      // The backend response 'createdStudent' should contain the _id
      if (createdStudent && createdStudent._id) {
         // Give a moment for the success message to be seen
         setTimeout(() => {
             navigate(`/profile/${createdStudent._id}`);
         }, 1500);
      } else {
          // Handle case where _id is missing in response (shouldn't happen if backend is correct)
          setError("Student created, but could not get ID for redirection.");
      }

    } catch (err) {
      console.error("Submission Error:", err);
      // Extract specific error messages if available from backend response
      const errorMsg = err.errors ? err.errors.map(e => e.msg).join(', ') : (err.message || 'Failed to create student. Please check console.');
      setError(errorMsg);
      setLoading(false);
      setSuccess(false);
    }
  };

  // --- Render the Form ---
  // NOTE: This is a basic structure. You need to add ALL form fields
  // based on your initial image and the `formData` state.
  return (
    <div className="form-container">
      <h2>Student Personal Information</h2>
      <form onSubmit={handleSubmit}>

        {/* Basic Information Section */}
        <fieldset>
          <legend>Basic Information</legend>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
              <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="username">Username *</label>
              <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth *</label>
              <input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
            </div>
             <div className="form-group">
              <label htmlFor="age">Age</label>
              <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} />
            </div>
             <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="">-- Select --</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                </select>
            </div>
             <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
             <div className="form-group">
              <label htmlFor="alternatePhone">Alternate Phone Number</label>
              <input type="tel" id="alternatePhone" name="alternatePhone" value={formData.alternatePhone} onChange={handleChange} />
            </div>
             <div className="form-group">
              <label htmlFor="height">Height</label>
              <input type="text" id="height" name="height" value={formData.height} onChange={handleChange} placeholder="e.g., 175 cm / 5 ft 9 in" />
            </div>
            <div className="form-group">
              <label htmlFor="weight">Weight</label>
              <input type="text" id="weight" name="weight" value={formData.weight} onChange={handleChange} placeholder="e.g., 70 kg / 154 lbs" />
            </div>
          </div>
        </fieldset>

        {/* Contact Details Section */}
        <fieldset>
            <legend>Contact Details</legend>
             <div className="form-group form-group-full">
                <label htmlFor="permanentAddress">Permanent Address</label>
                <textarea id="permanentAddress" name="permanentAddress" value={formData.permanentAddress} onChange={handleChange}></textarea>
            </div>
             <div className="form-group form-group-full">
                <label htmlFor="currentAddress">Current Address</label>
                <textarea id="currentAddress" name="currentAddress" value={formData.currentAddress} onChange={handleChange}></textarea>
            </div>
        </fieldset>

        {/* Address Details Section */}
         <fieldset>
            <legend>Address Details</legend>
            <div className="form-grid">
               <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} />
                </div>
                 <div className="form-group">
                    <label htmlFor="state">State</label>
                    <input type="text" id="state" name="state" value={formData.state} onChange={handleChange} />
                </div>
                 <div className="form-group">
                    <label htmlFor="zipCode">Zip Code</label>
                    <input type="text" id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} />
                </div>
                 <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <input type="text" id="country" name="country" value={formData.country} onChange={handleChange} />
                </div>
            </div>
        </fieldset>

        {/* --- ADD OTHER SECTIONS SIMILARLY --- */}
        {/* Academic Info, Parent/Guardian, Emergency Contacts */}

         <fieldset>
            <legend>Emergency Contact 1</legend>
             <div className="form-grid">
                 <div className="form-group">
                    <label htmlFor="emergency1Name">Name</label>
                    <input type="text" id="emergency1Name" name="name" value={formData.emergencyContact1.name} onChange={(e) => handleEmergencyChange(e, 1)} />
                </div>
                 <div className="form-group">
                    <label htmlFor="emergency1Phone">Phone</label>
                    <input type="tel" id="emergency1Phone" name="phone" value={formData.emergencyContact1.phone} onChange={(e) => handleEmergencyChange(e, 1)} />
                </div>
            </div>
        </fieldset>

         <fieldset>
            <legend>Emergency Contact 2</legend>
             <div className="form-grid">
                 <div className="form-group">
                    <label htmlFor="emergency2Name">Name</label>
                    <input type="text" id="emergency2Name" name="name" value={formData.emergencyContact2.name} onChange={(e) => handleEmergencyChange(e, 2)} />
                </div>
                 <div className="form-group">
                    <label htmlFor="emergency2Phone">Phone</label>
                    <input type="tel" id="emergency2Phone" name="phone" value={formData.emergencyContact2.phone} onChange={(e) => handleEmergencyChange(e, 2)} />
                </div>
            </div>
        </fieldset>


        {/* --- Document Uploads (Placeholder) --- */}
        {/* File inputs require different handling - add later */}
        {/* <fieldset>
            <legend>Document Uploads</legend>
            <div className="form-group"><label>Photo ID:</label> Not Implemented</div>
            <div className="form-group"><label>Address Proof:</label> Not Implemented</div>
            <div className="form-group"><label>Marksheet/Certificate:</label> Not Implemented</div>
        </fieldset> */}


        {/* Submission Feedback */}
        {error && <div className="error-message">Error: {error}</div>}
        {success && <div className="success-message">Student created successfully! Redirecting...</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default StudentForm;