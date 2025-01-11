import User from '../models/User.js';

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }); 

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({ 
        message: 'Your account has been blocked. Please contact administrator.' 
      });
    }

    const isMatch = await user.matchPassword(password); 

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Authentication successful:
    const sanitizedUser = user.toObject(); 
    delete sanitizedUser.password; 
    res.status(200).json({ user: sanitizedUser }); 
  } catch (error) {
    res.status(500).json({ message: 'Error logging in user', error });
  }
};

export const registerUser = async (req, res) => {
  console.log('Register User Controller Called');
  console.log('Full Request Body:', req.body);

  try {
    const { 
      username, 
      place, 
      age, 
      email, 
      education, 
      phone, 
      password 
    } = req.body;

    // Validate input
    if (!username || !place || !age || !email || !education || !phone || !password) {
      console.log('Missing fields', req.body);
      return res.status(400).json({ 
        message: 'All fields are required',
        receivedFields: Object.keys(req.body)
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const newUser = new User({
      username,
      place,
      age: Number(age),
      email,
      education,
      phone,
      password
    });

    // Save user
    await newUser.save();

    // Prepare response (remove sensitive data)
    const userResponse = newUser.toObject();
    delete userResponse.password;

    // Redirect to homepage after registration
    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Full Registration Error:', error);
    
    // Handle specific mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation Error', 
        errors 
      });
    }

    res.status(500).json({ 
      message: 'Registration failed', 
      error: error.message,
      errorStack: error.stack
    });
  }
};
export const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    // Validate input
    const validationErrors = {};
    if (!updateData.username) validationErrors.username = "Name is required.";
    if (!updateData.email || !/\S+@\S+\.\S+/.test(updateData.email)) {
      validationErrors.email = "Please enter a valid email.";
    }
    if (!updateData.phone || updateData.phone.length !== 10) {
      validationErrors.phone = "Contact number should be 10 digits.";
    }
    if (!updateData.age || updateData.age <= 0) {
      validationErrors.age = "Please enter a valid age.";
    }

    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    // Find and update user
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      updateData, 
      { 
        new: true,  // Return the updated document
        runValidators: true  // Run model validation
      }
    ).select('-password');  // Exclude password from response

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Profile Update Error:', error);
    res.status(500).json({ 
      message: 'Error updating profile', 
      error: error.message 
    });
  }
};

// In userController.js
export const getUserProfile = async (req, res) => {
  try {
    const { email } = req.body;
    
    console.log("Received getUserProfile request for email:", email);
    
    // Find user by email and exclude password
    const user = await User.findOne({ email }).select('-password');
    
    if (!user) {
      console.log(`User not found with email: ${email}`);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log("User profile found:", user);
    res.status(200).json(user);
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ 
      message: 'Error fetching profile', 
      error: error.message 
    });
  }
};

// In userController.js
export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users, excluding sensitive fields like password
    const users = await User.find({}).select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching users', 
      error: error.message 
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find and delete the user
    const deletedUser = await User.findByIdAndDelete(userId);
    
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ 
      message: 'User deleted successfully', 
      user: deletedUser 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting user', 
      error: error.message 
    });
  }
};

export const unblockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find user and update their blocked status
    const user = await User.findByIdAndUpdate(
      userId, 
      { 
        isBlocked: false, 
        blockedAt: null 
      }, 
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ 
      message: 'User unblocked successfully', 
      user 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error unblocking user', 
      error: error.message 
    });
  }
};

// Modify blockUser to include timestamp
export const blockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find user and update their blocked status
    const user = await User.findByIdAndUpdate(
      userId, 
      { 
        isBlocked: true, 
        blockedAt: new Date() 
      }, 
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ 
      message: 'User blocked successfully', 
      user 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error blocking user', 
      error: error.message 
    });
  }
};