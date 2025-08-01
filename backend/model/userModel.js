import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  address: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  image: {
    type: String, // Store image URL or base64 string
    required: false
  },
    about: {
    type: String,
    required: false, 
    trim: true
  }
});

export default mongoose.model("User", userSchema)

