import mongoose from "mongoose";

const ServiceProviderSchema = new mongoose.Schema(
  {
    fullName: { 
      type: String, 
      required: true,
      trim: true 
    },
    username: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true,
      lowercase: true // ઈમેલ હંમેશા lowercase માં સેવ થશે
    },
    password: { 
      type: String, 
      required: true 
    },
    mobile: { 
      type: String, 
      required: true 
    },
    whatsappNumber: { type: String }, // નવું ફિલ્ડ ઉમેર્યું
    providerName: { 
      type: String, 
      required: true,
      trim: true 
    },
    serviceCategory: { 
      type: String, 
      required: true 
    },
    experience: { 
      type: String 
    },
    location: { 
      type: String 
    },
    
    // ... બાકીનો કોડ સેમ ...
    // વેરિફિકેશન ફિલ્ડ્સ (Updated names to match API)
    gstNumber: { type: String, trim: true },
    aadharNumber: { type: String, trim: true },
    panNumber: { type: String, trim: true },
    
    // આ નામો API માં વપરાયા છે એટલે અહીં પણ આ જ રાખવા
    aadharDoc: { type: String }, 
    panDoc: { type: String },
    gstDoc: { type: String },
// ... બાકીનો કોડ સેમ ...
    panProof: { type: String },
    
    isVerified: { 
      type: Boolean, 
      default: false 
    }, // Email verification status
    isApproved: { 
      type: Boolean, 
      default: false 
    }, // Admin approval status
    isRejected: { 
      type: Boolean, 
      default: false 
    }, // Admin rejection status
    
    status: { 
      type: String, 
      enum: ["pending", "approved", "rejected"], // આના સિવાય બીજી કોઈ વેલ્યુ સેવ નહીં થાય
      default: "pending" 
    },
    
    role: { 
      type: String, 
      default: "serviceprovider" 
    },
  },
  { timestamps: true }
);

// જો મોડેલ પહેલેથી બનેલું હોય તો તેને વાપરો, નહીં તો નવું બનાવો
const ServiceProvider = mongoose.models.ServiceProvider || mongoose.model("ServiceProvider", ServiceProviderSchema);

export default ServiceProvider;