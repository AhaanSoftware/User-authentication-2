const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const emailRoutes= require('./routes/emailRoutes')
dotenv.config();

const app = express();

// CORS setup
app.use(cors({
    origin: 'http://localhost:5173',  // Update this if your frontend is running on a different port
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));


mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));


app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.use('/user', userRoutes);
app.use('/user', emailRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
