// models/Student.js
const mongoose = require('mongoose');

const EmergencyContactSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  phone: { type: String, trim: true }
}, { _id: false }); // _id: false prevents Mongoose from creating an _id for subdocuments if not needed

const StudentSchema = new mongoose.Schema({
  // Basic Information
  fullName: { type: String, required: [true, 'Full Name is required'], trim: true },
  username: { type: String, required: [true, 'Username is required'], unique: true, trim: true }, // Added unique constraint
  email: { type: String, required: [true, 'Email is required'], unique: true, trim: true, lowercase: true }, // Added unique constraint and lowercase
  dateOfBirth: { type: Date, required: [true, 'Date of Birth is required'] },
  age: { type: Number, min: 0 }, // Optional, could be calculated
  gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'] }, // Use enum for specific choices
  phone: { type: String, required: [true, 'Phone Number is required'], trim: true },
  alternatePhone: { type: String, trim: true },
  height: { type: String, trim: true }, // Using String to allow units (e.g., '175 cm', '5 ft 9 in')
  weight: { type: String, trim: true }, // Using String to allow units (e.g., '70 kg', '154 lbs')
  // profileImage: { type: String }, // Store path or URL after upload - ADD LATER

  // Contact Details
  permanentAddress: { type: String, trim: true },
  currentAddress: { type: String, trim: true },

  // Address Details (Could be nested or separate)
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  zipCode: { type: String, trim: true },
  country: { type: String, trim: true },

  // Academic Info
  courseProgram: { type: String, trim: true },
  department: { type: String, trim: true },

  // Parent/Guardian Info
  fatherName: { type: String, trim: true },
  motherName: { type: String, trim: true },
  guardianName: { type: String, trim: true },
  guardianContact: { type: String, trim: true },

  // Emergency Contact (Using the subdocument schema)
  emergencyContact1: EmergencyContactSchema, // Based on the first emergency contact block in image
  emergencyContact2: EmergencyContactSchema, // Based on the second emergency contact block in image

  // Document Uploads - Store paths or identifiers - ADD LATER
  // photoIdPath: { type: String },
  // addressProofPath: { type: String },
  // marksheetPath: { type: String },

}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Add pre-save hook to calculate age if needed (optional)
StudentSchema.pre('save', function(next) {
  if (this.dateOfBirth && this.isModified('dateOfBirth')) {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    this.age = age;
  }
  next();
});


module.exports = mongoose.model('Student', StudentSchema);