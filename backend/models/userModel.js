const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,  
        trim: true,  
    },
    lastName: {
        type: String,
        required: true,  
        trim: true,  
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,  
        lowercase: true,  
    },
    password: {
        type: String,
        required: true,
        minlength: 6,  
    },
    phoneNo:{
        type: Number
    },
    isVerified: {
        type: Boolean,
        default: false,  
      },
   
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
        required: false, 
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: false, 
    },
    resetToken: {  
        type: String,
    },
    resetTokenExpiration: {  
        type: Date,
    },
}, {
    timestamps: true,
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password') || this.password.startsWith('$2a$')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});


UserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password); 
};
module.exports = mongoose.model('User', UserSchema);
