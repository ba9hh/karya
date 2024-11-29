const jwt = require('jsonwebtoken');
const User = require('./models/User');
const bcrypt =require('bcryptjs');
const axios = require('axios');


require('dotenv').config();

const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


const bcryptSalt = bcrypt.genSaltSync(10);
// User registration function
const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const newUser =await User.create({
        name,
        email,
        signinMethod:"classic",
        password:bcrypt.hashSync(password, bcryptSalt),
      });

    // Create a JWT token for the new user
    const token = jwt.sign({ userId: newUser._id }, /*process.env.JWT_SECRET*/"Secret", {
      expiresIn: '7d', // Token valid for 7 days
    });

    // Set the token in an httpOnly cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expires in 7 days
      sameSite: 'Strict',
    });

    res.status(201).json({ message: 'User registered successfully', user: { id: newUser._id, name: newUser.name ,email : newUser.email,signinMethod:newUser.signinMethod } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if the password matches
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user._id }, /*process.env.JWT_SECRET*/"Secret", {
      expiresIn: '7d',
    });

    // Set the token in an httpOnly cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expires in 7 days
      sameSite: 'Strict',
    });

    res.json({ message: 'Login successful', user: { id: user._id, name: user.name ,email : user.email ,signinMethod:user.signinMethod} });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

//kanah valide nemshou /account sinon y3awed yconnacti
const validateToken = async (req, res) => {
  const user = req.user; 

    res.json({
        message: 'Token is valid',
        user,
    });
};
const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: /*process.env.CLIENT_ID*/"739869680076-jlv9amicing7jf86gasmar79v2hel8vb.apps.googleusercontent.com",
    });

    
    const payload = ticket.getPayload();
    

    const {  email, name,picture } = payload;
    // Check if user already exists in the database
    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user if not exists
      user = await User.create({
        
        name,
        email,
        profilePic: picture,
        signinMethod :"google"
      });
    }

    // Generate a JWT token for the user
    const jwtToken = jwt.sign({ userId: user._id }, /*process.env.JWT_SECRET*/"Secret", {
      expiresIn: '7d', // Token is valid for 7 days
    });

    // Set JWT token in an HTTP-only cookie
    res.cookie('authToken', jwtToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expires in 7 days
      sameSite: 'Strict',
    });

    // Return user info
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        signinMethod:user.signinMethod,
        phone_number :user.phone_number,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error('Google authentication error:', error);
    res.status(500).json({ message: 'Google authentication failed' });
  }
};
const githubLogin = async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).send("Authorization code is missing.");
  }

  try {
    // Exchange the authorization code for an access token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: 'application/json' } }
    );

    const accessToken = tokenResponse.data.access_token;

    if (!accessToken) {
      return res.status(400).json({ message: 'GitHub authentication failed' });
    }

    // Fetch user data from GitHub API
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log(userResponse.data)

    const { email, login, avatar_url: picture } = userResponse.data;

    // Check if user already exists in the database
    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user if not exists
      user = new User({
        name:login,
        email,
        profilePic: picture,
        signinMethod: "github",
      });

      await user.save();
    }

    // Generate a JWT token
    const jwtToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // Token valid for 7 days
    );

    // Set the token in an HTTP-only cookie
    res.cookie('authToken', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Secure flag in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'Strict',
    });

    // Return user info
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
    
  } catch (error) {
    console.error('GitHub authentication error:', error.message);
    res.status(500).json({ message: 'GitHub authentication failed' });
  }
};

const logout = (req, res) => {
  res.clearCookie('authToken');
  res.json({ message: 'Logout successful' });
};

module.exports = { register, login, googleLogin,githubLogin,validateToken, logout };