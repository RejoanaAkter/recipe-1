import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRouter from './routes/userRoute.js';
import receipeRoute from './routes/receipeRoute.js';
import categoryRoute from './routes/catRoute.js';
import path from 'path'; 

dotenv.config();

const app = express();
app.use(cors());
app.use('/uploads', express.static(path.resolve('uploads')));
// ✅ Serve uploaded files statically
app.use(bodyParser.json());
// ✅ Routes that use multer (multipart/form-data) — put before bodyParser.json()
app.use("/users", userRouter);
app.use("/recipes", receipeRoute);
app.use("/cat", categoryRoute);

// ✅ JSON parsing (used only for non-file routes)


const PORT = process.env.PORT || 8000;
const MONGOURL = process.env.MONGO_URL;

mongoose
  .connect(MONGOURL)
  .then(() => {
    console.log("DB connected successfully.");
    app.listen(PORT, () => {
      console.log(`Server is running on port :${PORT} `);
    });
  })
  .catch((error) => console.log(error));
