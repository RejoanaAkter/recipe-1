import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    imageUrl: {
      type: String, // URL to the image (can be hosted or uploaded)
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model('Category', categorySchema);
