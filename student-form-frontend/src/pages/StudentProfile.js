// src/pages/StudentProfile.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getStudentById, updateStudent } from '../services/studentApi';
import './StudentProfile.css'; // Create this CSS file

function StudentProfile() {
  const { id } = useParams(); // Get student ID from URL parameter
  const navigate = useNavigate();
  const [student, setStudent] = useState(null); // To store fetched student data
  const [isEditing, setIsEditing] = useState(false); // To toggle between view and edit modes
  const [formData, setFormData] = useState({}); // To hold data while editing
  const [loading, setLoading] = useState(true); // Loading state for fetching
  const [error, setError] = useState(null); // Error state for fetching/updating
  const [updateSuccess, setUpdateSuccess] = useState(false); // Success message state

  // --- Fetch student data when component mounts or ID changes ---
  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getStudentById(id);
        setStudent(data);
        setFormData(data); // Initialize form data with fetched data
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch student data.');
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]); // Re-run effect if the ID parameter changes

  // --- Handle changes in the edit form ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Special handler for nested emergency contacts in edit mode
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

  // --- Handle switching to edit mode ---
  const handleEdit = () => {
    setFormData({ ...student }); // Reset form data to current student data
    setIsEditing(true);
    setUpdateSuccess(false); // Clear success message when starting edit
    setError(null); // Clear previous errors
  };

  // --- Handle cancelling edit mode ---
  const handleCancel = () => {
    setIsEditing(false);
    setError(null); // Clear errors on cancel
  };

  // --- Handle submitting the updated data ---
  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUpdateSuccess(false);

    // Basic validation check example (can be more comprehensive)
    if (!formData.fullName || !formData.email || !formData.username || !formData.phone || !formData.dateOfBirth) {
        setError("Please fill in all required fields (*).");
        setLoading(false);
        return;
    }

    try {
        // Remove fields that backend might auto-generate or shouldn't be sent directly in update
        // (like _id, createdAt, updatedAt, __v - Mongoose handles _id automatically in URL)
        const dataToUpdate = { ...formData };
        delete dataToUpdate._id;
        delete dataToUpdate.createdAt;
        delete dataToUpdate.updatedAt;
        delete dataToUpdate.__v;
        // Age is often calculated, so you might not need to send it
        delete dataToUpdate.age;

        console.log("Submitting Update Data:", dataToUpdate); // Debugging

        const updatedStudent = await updateStudent(id, dataToUpdate);
        setStudent(updatedStudent); // Update the displayed student data
        setFormData(updatedStudent); // Update form data state as well
        setIsEditing(false); // Switch back to view mode
        setUpdateSuccess(true); // Show success message
        setLoading(false);

        // Optionally hide success message after a few seconds
        setTimeout(() => setUpdateSuccess(false), 3000);

    } catch (err) {
        console.error("Update Error:", err);
        const errorMsg = err.errors ? err.errors.map(e => e.msg).join(', ') : (err.message || 'Failed to update student.');
        setError(errorMsg);
        setLoading(false);
    }
  };

  // --- Helper function to format date for display (optional) ---
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      // Adjust for potential timezone issues if needed, getUTCDate etc.
      // For simplicity, using toLocaleDateString
      return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      return 'Invalid Date';
    }
  };

    // --- Helper function to format date for input type="date" ---
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
        // Date needs to be in 'YYYY-MM-DD' for the input field
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    } catch (e) {
        return ''; // Return empty if date is invalid
    }
  };


  // --- Conditional Rendering based on loading, error, and edit state ---

  if (loading && !student) { // Show loading only on initial fetch
    return <div className="profile-container">Loading student data...</div>;
  }

  if (error && !isEditing) { // Show fetch error only if not in edit mode (edit errors shown near form)
     return <div className="profile-container error-message">Error: {error} <Link to="/">Go Back</Link></div>;
  }

  if (!student) {
     return <div className="profile-container">Student not found. <Link to="/">Go Back</Link></div>;
  }


  return (
    <div className="profile-container">
      <h2>Student Profile {isEditing ? '(Editing)' : ''}</h2>

       {/* Display Update Success Message */}
       {updateSuccess && <div className="success-message">Profile updated successfully!</div>}


      {isEditing ? (
        // --- EDIT FORM ---
        <form onSubmit={handleSubmitUpdate}>
          {/* Reuse the same structure as StudentForm, but bind to formData */}
          {/* Use formatDateForInput for date values */}
          <fieldset>
              <legend>Basic Information</legend>
               <div className="form-grid">
                   {/* Example: Full Name */}
                   <div className="form-group">
                      <label htmlFor="editFullName">Full Name *</label>
                      <input type="text" id="editFullName" name="fullName" value={formData.fullName || ''} onChange={handleChange} required />
                  </div>
                  {/* Example: Username (Potentially Read-only) */}
                  <div className="form-group">
                      <label htmlFor="editUsername">Username *</label>
                      {/* You might want to make username and email read-only or handle changes carefully */}
                      <input type="text" id="editUsername" name="username" value={formData.username || ''} onChange={handleChange} required /* readOnly */ />
                  </div>
                   {/* Example: Email */}
                    <div className="form-group">
                        <label htmlFor="editEmail">Email *</label>
                        <input type="email" id="editEmail" name="email" value={formData.email || ''} onChange={handleChange} required /* readOnly */ />
                    </div>
                     {/* Example: Date of Birth */}
                    <div className="form-group">
                        <label htmlFor="editDateOfBirth">Date of Birth *</label>
                        <input type="date" id="editDateOfBirth" name="dateOfBirth" value={formatDateForInput(formData.dateOfBirth)} onChange={handleChange} required />
                    </div>
                    {/* Example: Gender */}
                    <div className="form-group">
                        <label htmlFor="editGender">Gender</label>
                        <select id="editGender" name="gender" value={formData.gender || ''} onChange={handleChange}>
                           <option value="">-- Select --</option>
                           <option value="Male">Male</option>
                           <option value="Female">Female</option>
                           <option value="Other">Other</option>
                           <option value="Prefer not to say">Prefer not to say</option>
                       </select>
                   </div>
                    {/* Example: Phone */}
                   <div className="form-group">
                       <label htmlFor="editPhone">Phone Number *</label>
                       <input type="tel" id="editPhone" name="phone" value={formData.phone || ''} onChange={handleChange} required />
                   </div>
                   {/* ... Add ALL other fields similarly ... */}
                    {/* Example: Height */}
                    <div className="form-group">
                        <label htmlFor="editHeight">Height</label>
                        <input type="text" id="editHeight" name="height" value={formData.height || ''} onChange={handleChange} />
                    </div>
                     {/* Example: Weight */}
                    <div className="form-group">
                        <label htmlFor="editWeight">Weight</label>
                        <input type="text" id="editWeight" name="weight" value={formData.weight || ''} onChange={handleChange} />
                    </div>
               </div>
           </fieldset>

           {/* --- ADDRESS FIELDS --- */}
           <fieldset>
              <legend>Contact & Address</legend>
               <div className="form-group form-group-full">
                  <label htmlFor="editPermanentAddress">Permanent Address</label>
                  <textarea id="editPermanentAddress" name="permanentAddress" value={formData.permanentAddress || ''} onChange={handleChange}></textarea>
              </div>
               <div className="form-group form-group-full">
                  <label htmlFor="editCurrentAddress">Current Address</label>
                  <textarea id="editCurrentAddress" name="currentAddress" value={formData.currentAddress || ''} onChange={handleChange}></textarea>
              </div>
              <div className="form-grid">
                  <div className="form-group">
                      <label htmlFor="editCity">City</label>
                      <input type="text" id="editCity" name="city" value={formData.city || ''} onChange={handleChange} />
                  </div>
                  {/* ... State, Zip, Country ... */}
                   <div className="form-group">
                        <label htmlFor="editState">State</label>
                        <input type="text" id="editState" name="state" value={formData.state || ''} onChange={handleChange} />
                    </div>
                     <div className="form-group">
                        <label htmlFor="editZipCode">Zip Code</label>
                        <input type="text" id="editZipCode" name="zipCode" value={formData.zipCode || ''} onChange={handleChange} />
                    </div>
                     <div className="form-group">
                        <label htmlFor="editCountry">Country</label>
                        <input type="text" id="editCountry" name="country" value={formData.country || ''} onChange={handleChange} />
                    </div>
              </div>
           </fieldset>

           {/* --- ACADEMIC, PARENT/GUARDIAN --- */}
            <fieldset>
                <legend>Academic & Guardian Info</legend>
                 {/* ... Course, Department, Father, Mother, Guardian ... */}
                 <div className="form-grid">
                     <div className="form-group">
                        <label htmlFor="editCourseProgram">Course/Program</label>
                        <input type="text" id="editCourseProgram" name="courseProgram" value={formData.courseProgram || ''} onChange={handleChange} />
                    </div>
                     <div className="form-group">
                        <label htmlFor="editDepartment">Department</label>
                        <input type="text" id="editDepartment" name="department" value={formData.department || ''} onChange={handleChange} />
                    </div>
                     <div className="form-group">
                        <label htmlFor="editFatherName">Father's Name</label>
                        <input type="text" id="editFatherName" name="fatherName" value={formData.fatherName || ''} onChange={handleChange} />
                    </div>
                     <div className="form-group">
                        <label htmlFor="editMotherName">Mother's Name</label>
                        <input type="text" id="editMotherName" name="motherName" value={formData.motherName || ''} onChange={handleChange} />
                    </div>
                     <div className="form-group">
                        <label htmlFor="editGuardianName">Guardian's Name</label>
                        <input type="text" id="editGuardianName" name="guardianName" value={formData.guardianName || ''} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="editGuardianContact">Guardian's Contact</label>
                        <input type="text" id="editGuardianContact" name="guardianContact" value={formData.guardianContact || ''} onChange={handleChange} />
                    </div>
                 </div>
            </fieldset>


           {/* --- EMERGENCY CONTACTS --- */}
            <fieldset>
                <legend>Emergency Contact 1</legend>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="editEmergency1Name">Name</label>
                        <input type="text" id="editEmergency1Name" name="name" value={formData.emergencyContact1?.name || ''} onChange={(e) => handleEmergencyChange(e, 1)} />
                    </div>
                     <div className="form-group">
                        <label htmlFor="editEmergency1Phone">Phone</label>
                        <input type="tel" id="editEmergency1Phone" name="phone" value={formData.emergencyContact1?.phone || ''} onChange={(e) => handleEmergencyChange(e, 1)} />
                    </div>
                </div>
            </fieldset>
            {/* ... Emergency Contact 2 ... */}
            <fieldset>
                <legend>Emergency Contact 2</legend>
                 <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="editEmergency2Name">Name</label>
                        <input type="text" id="editEmergency2Name" name="name" value={formData.emergencyContact2?.name || ''} onChange={(e) => handleEmergencyChange(e, 2)} />
                    </div>
                     <div className="form-group">
                        <label htmlFor="editEmergency2Phone">Phone</label>
                        <input type="tel" id="editEmergency2Phone" name="phone" value={formData.emergencyContact2?.phone || ''} onChange={(e) => handleEmergencyChange(e, 2)} />
                    </div>
                </div>
            </fieldset>

          {/* Display Update Error Message */}
           {error && <div className="error-message">Error: {error}</div>}

          <div className="profile-actions">
            <button type="submit" className="button-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" className="button-secondary" onClick={handleCancel} disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        // --- VIEW MODE ---
        <div className="profile-details">
          {/* Display student details - Use the `student` state */}
          {/* Example: */}
          <div className="detail-section">
              <h3>Basic Information</h3>
              <p><strong>Full Name:</strong> {student.fullName}</p>
              <p><strong>Username:</strong> {student.username}</p>
              <p><strong>Email:</strong> {student.email}</p>
              <p><strong>Date of Birth:</strong> {formatDate(student.dateOfBirth)}</p>
              <p><strong>Age:</strong> {student.age !== undefined ? student.age : 'N/A'}</p>
              <p><strong>Gender:</strong> {student.gender || 'N/A'}</p>
              <p><strong>Phone:</strong> {student.phone}</p>
              <p><strong>Alternate Phone:</strong> {student.alternatePhone || 'N/A'}</p>
              <p><strong>Height:</strong> {student.height || 'N/A'}</p>
              <p><strong>Weight:</strong> {student.weight || 'N/A'}</p>
          </div>

            <div className="detail-section">
                <h3>Contact & Address</h3>
                <p><strong>Permanent Address:</strong> {student.permanentAddress || 'N/A'}</p>
                <p><strong>Current Address:</strong> {student.currentAddress || 'N/A'}</p>
                <p><strong>City:</strong> {student.city || 'N/A'}</p>
                <p><strong>State:</strong> {student.state || 'N/A'}</p>
                <p><strong>Zip Code:</strong> {student.zipCode || 'N/A'}</p>
                <p><strong>Country:</strong> {student.country || 'N/A'}</p>
            </div>

            <div className="detail-section">
                 <h3>Academic & Guardian Info</h3>
                  <p><strong>Course/Program:</strong> {student.courseProgram || 'N/A'}</p>
                  <p><strong>Department:</strong> {student.department || 'N/A'}</p>
                  <p><strong>Father's Name:</strong> {student.fatherName || 'N/A'}</p>
                  <p><strong>Mother's Name:</strong> {student.motherName || 'N/A'}</p>
                  <p><strong>Guardian's Name:</strong> {student.guardianName || 'N/A'}</p>
                  <p><strong>Guardian's Contact:</strong> {student.guardianContact || 'N/A'}</p>
            </div>

            <div className="detail-section">
                 <h3>Emergency Contacts</h3>
                 <p><strong>Contact 1:</strong> {student.emergencyContact1?.name || 'N/A'} - {student.emergencyContact1?.phone || 'N/A'}</p>
                 <p><strong>Contact 2:</strong> {student.emergencyContact2?.name || 'N/A'} - {student.emergencyContact2?.phone || 'N/A'}</p>
            </div>


          {/* ... Display ALL other student fields ... */}

          <div className="profile-actions">
            <button onClick={handleEdit} className="button-primary">Edit Profile</button>
            <Link to="/" className="button-secondary">Back to Form</Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentProfile;