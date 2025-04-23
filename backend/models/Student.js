const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  // Add profile picture
  profilePicture: String, // Store file path/URL
  // Basic Info
  fullName: String,
  username: String,
  email: { type: String, unique: true },
  dob: Date,
  age: Number,
  gender: String,
  phone: String,
  altPhone: String,
  
  // Address
  permanentAddress: String,
  currentAddress: String,
  city: String,
  zip: String,
  state: String,
  country: String,
  
  // Academic
  course: String,
  department: String,
  
  // Parent/Guardian
  fatherName: String,
  motherName: String,
  guardianName: String,
  parentContact: String,
  
  // Emergency Contact
  emergencyName: String,
  emergencyPhone: String,
  
  // Documents (store file paths)
  photoID: String,
  addressProof: String,
  certificates: [String]
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);