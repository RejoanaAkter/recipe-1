import User from "../model/userModel.js";
import bcrypt from 'bcryptjs'; 



export const createUser = async (req, res) => {
  try {
    const { name, email, address, password, about   } = req.body;
    let imageUrl = '';

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    if (!name || !email || !address || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ 
      name, 
      email, 
      address, 
      password: hashedPassword,  // Save hashed password
      image: imageUrl ,
      about  
    });

    const savedUser = await newUser.save();

    res.status(201).json({ message: "User created", userId: savedUser._id });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: error.message });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.password) {
      return res.status(500).json({ message: 'User password not set' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return res.status(200).json({
      message: 'Login successful',
      userId: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      image: user.image,
    });
  } catch (error) {
    console.error('Login error:', error.message, error.stack);
    return res.status(500).json({ message: 'Internal server error' });
  }
};




export const getAllUsers = async (req, res) => {
  try {
    const userData = await User.find();
    if (!userData || userData.length === 0) {
      return res.status(404).json({ message: "User data not found." });
    }
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const userExist = await User.findById(id);
    if (!userExist) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(userExist);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const id = req.params.id;
    const userExist = await User.findById(id);
    if (!userExist) {
      return res.status(404).json({ message: "User not found." });
    }
    const updatedData = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    // res.status(200).json(updatedData);
    res.status(200).json({ message: "User Updated successfully." });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const userExist = await User.findById(id);
    if (!userExist) {
      return res.status(404).json({ message: "User not found." });
    }
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};