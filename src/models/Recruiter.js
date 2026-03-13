// //src/models/Recruiter.js
// import mongoose from "mongoose";

// const RecruiterSchema = new mongoose.Schema(
//   {
//     /* =============================
//        🔐 ACCOUNT DETAILS
//     ============================= */
//     fullName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
    
//     username: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },

//     password: {
//       type: String,
//       required: true,
//     },

//     mobile: {
//       type: String,
//       required: true,
//     },

//     role: {
//       type: String,
//       default: "recruiter",
//     },

//     /* =============================
//        🏢 COMPANY DETAILS
//     ============================= */
//     companyName: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     designation: {
//       type: String,
//       required: true,
//     },

//     location: {
//       type: String,
//       required: true,
//     },

//     /* =============================
//        📂 FILE UPLOADS (PATHS)
//     ============================= */
//     companyLogo: {
//       type: String,
//       default: null, // /uploads/logo.png
//     },

//     businessLicense: {
//       type: String,
//       default: null,
//     },

//     gstProof: {
//       type: String,
//       default: null,
//     },

//     /* =============================
//        🔐 VERIFICATION & STATUS
//     ============================= */
//     isEmailVerified: {
//       type: Boolean,
//       default: false,
//     },

//     isApproved: {
//       type: Boolean,
//       default: false, // Admin approval
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// /* =============================
//    ✅ SAFE EXPORT (Next.js)
// ============================= */
// export default mongoose.models.Recruiter ||
//   mongoose.model("Recruiter", RecruiterSchema);
import mongoose from "mongoose";

const RecruiterSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true },
    role: { type: String, default: "recruiter" },

    companyName: { type: String, required: true, trim: true },
    gstNumber: { type: String, required: true },
    designation: { type: String, required: true },
    location: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    pincode: { type: String, default: "" },
    country: { type: String, default: "" },

    registrationType: { type: String, enum: ['company', 'individual'], default: 'company' },
    aadharNumber: { type: String, default: null },
    panNumber: { type: String, default: null },

    companyLogo: { type: String, default: null },
    businessLicense: { type: String, default: null },
    gstProof: { type: String, default: null },
    aadharProof: { type: String, default: null }, 
    panProof: { type: String, default: null },    

    // --- પ્રોફાઇલ પેજ માટે નવા ફિલ્ડ્સ (ઉમેર્યા છે) ---
    tagline: { type: String, default: "" },
    industry: { type: String, default: "" },
    website: { type: String, default: "" },
    founded: { type: String, default: "" },
    description: { type: String, default: "" },
    profession: {
      type: String,
      default: ""
    },
    department: {
      type: String,
      default: ""
    },
    designation: { type: String, default: "" },
    specialties: { type: [String], default: [] },
    companySize: { type: String, default: "11-50 employees" },
    logo: { type: String, default: null }, // પ્રોફાઇલ પિક્ચર/લોગો માટે

    // ✅ આ નવા ફિલ્ડ્સ ઉમેરો
    contactPersonName: { type: String, default: "" },
    contactPersonNumber: { type: String, default: "" },
    contactPersonEmail: { type: String, default: "" },
    ownerName: { type: String, default: "" },
    ownerNumber: { type: String, default: "" },
    ownerEmail: { type: String, default: "" },

    isEmailVerified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    isRejected: { type: Boolean, default: false }, 
    status: { type: String, default: "pending" },  
  },
  { timestamps: true }
);

export default mongoose.models.Recruiter || mongoose.model("Recruiter", RecruiterSchema);