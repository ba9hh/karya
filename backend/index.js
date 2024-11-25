const express = require('express');
const mongoose =require('mongoose');
const cookieParser = require('cookie-parser');
const authController = require('./authController');
const authMiddleware = require('./authMidlleware')
const User =require('./models/User')
const House = require('./models/House')
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const bodyParser = require('body-parser');
const houseRoutes = require('./routes/houseRoutes');
const userRoutes = require('./routes/userRoutes');
const nodemailer = require('nodemailer');


if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

require('dotenv').config();

console.log(process.env.CLIENT_ID
)
const app = express()
app.use(cookieParser());
app.use(express.json());


app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Use the current timestamp to avoid file name conflicts
  },
});

// Initialize multer with the defined storage
const upload = multer({ storage: storage });

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('App connected to database');
    app.listen(3000, () => {
      console.log("App is listening to port: 3000");
    });
  })
  .catch((error) => {
    console.log(error);
  });



app.use('/uploads', express.static('uploads'));



app.post('/api/register', authController.register);  // Registration route
app.post('/api/login', authController.login);
app.get('/api/validateToken', authMiddleware,authController.validateToken);
app.post('/api/auth/google',authController.googleLogin);
app.get('/auth/callback',authController.githubLogin);
app.post('/api/logout', authController.logout);

app.use('/api', houseRoutes);
app.use('/api',userRoutes);

// special cases
app.post('/api/house',authMiddleware,upload.array('images', 8), async (req, res) => {

  const userId = req.user._id;
  const {visibility,Etage,Salon,Byout, toillete,koujina,houseType, meuble, balcon,jarda, gaz, climatiseur,lchkon,wilaya,mo3tamdiya,houma,griba,prix,prixOption } = req.body;
  const imagePaths = req.files ? req.files.map(file => file.path) : []; 

  try {
    const newHouse = new House({visibility,Etage,Salon,Byout, toillete,koujina, meuble, houseType,balcon,jarda, gaz, climatiseur,lchkon,wilaya,mo3tamdiya,houma,griba,prix,prixOption,images: imagePaths,user: userId });
    await newHouse.save();
    await User.findByIdAndUpdate(userId, { $push: { posts: newHouse._id } });
    res.status(201).json(newHouse); 
  } catch (err) {
    res.status(500).json({ message: 'Error creating house', error: err });
  }
});

app.put('/api/house/:id', authMiddleware, upload.array('images', 8), async (req, res) => {
  const userId = req.user._id;
  const houseId = req.params.id;
  const {
  visibility, Etage, Salon, Byout, toillete, koujina, houseType, meuble, balcon, jarda,gaz, climatiseur, lchkon, wilaya, mo3tamdiya, houma, griba, prix, prixOption} = req.body;
  const newImagePaths = req.files ? req.files.map(file => file.path) : [];

  try {
    const house = await House.findOne({ _id: houseId, user: userId });
    if (!house) {
      return res.status(404).json({ message: 'House not found or not authorized to update' });
    }
    house.visibility = visibility ?? house.visibility;
    house.Etage = Etage ?? house.Etage;
    house.Salon = Salon ?? house.Salon;
    house.Byout = Byout ?? house.Byout;
    house.toillete = toillete ?? house.toillete;
    house.koujina = koujina ?? house.koujina;
    house.houseType = houseType ?? house.houseType;
    house.meuble = meuble ?? house.meuble;
    house.balcon = balcon ?? house.balcon;
    house.jarda = jarda ?? house.jarda;
    house.gaz = gaz ?? house.gaz;
    house.climatiseur = climatiseur ?? house.climatiseur;
    house.lchkon = lchkon ?? house.lchkon;
    house.wilaya = wilaya ?? house.wilaya;
    house.mo3tamdiya = mo3tamdiya ?? house.mo3tamdiya;
    house.houma = houma ?? house.houma;
    house.griba = griba ?? house.griba;
    house.prix = prix ?? house.prix;
    house.prixOption = prixOption ?? house.prixOption;

    if (newImagePaths.length > 0) {
      house.images.push(...newImagePaths);
    }
    await house.save();
    res.status(200).json(house); 
  } catch (err) {
    res.status(500).json({ message: 'Error updating house', error: err });
  }
});

/* *************************************************************** */
app.post('/api/auth/upload-profile-pic', authMiddleware, upload.single('profilePic'), async (req, res) => {
  const userId = req.user._id;

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const profilePicUrl = `/uploads/${req.file.filename}`;

  try {
    // Update the user's profile picture in the database
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePic: profilePicUrl },
      { new: true }
    );

    res.status(200).json({
      message: 'Profile picture updated successfully',
      user,
    });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ message: 'Error updating profile picture' });
  }
});

/* ******************************** */

app.post('/api/send-verification', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required.' });
  }

  // Generate a random verification code
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'zedtourheart@gmail.com', // Your email
      pass: 'kjqk ssnh ozdc ajsj', // Your email password
    },
  });

  const mailOptions = {
    from: 'zedtourheart@gmail.com',
    to: email,
    subject: 'Verification Code',
    text: `Your verification code is: ${verificationCode}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, code: verificationCode }); // Include the code in the response
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to send email.' });
  }
});