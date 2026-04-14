// models/User.js — Student & Client user model

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({

  // ── COMMON FIELDS ──
  firstName:  { type: String, required: true, trim: true },
  lastName:   { type: String, required: true, trim: true },
  email:      { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:   { type: String, required: true, minlength: 8 },
  phone:      { type: String, trim: true },
  role:       { type: String, enum: ['student', 'client'], required: true },
  city:       { type: String, trim: true },
  profilePhoto: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },

  // ── STUDENT FIELDS ──
  college:      { type: String },
  degree:       { type: String },
  year:         { type: String },
  branch:       { type: String },
  gradYear:     { type: String },
  enrollNo:     { type: String },
  skills:       [{ type: String }],
  bio:          { type: String, maxlength: 500 },
  portfolioUrl: { type: String },
  isPro:        { type: Boolean, default: false },

  // ── CLIENT FIELDS ──
  company:      { type: String },
  designation:  { type: String },
  industry:     { type: String },
  companySize:  { type: String },
  website:      { type: String },
  companyLogo:  { type: String, default: '' },
  projectTypes: [{ type: String }],
  typicalBudget: { type: Number },

  // ── STATS ──
  totalEarned:    { type: Number, default: 0 },   // students
  totalSpent:     { type: Number, default: 0 },   // clients
  completedProjects: { type: Number, default: 0 },
  avgRating:      { type: Number, default: 0 },
  ratingCount:    { type: Number, default: 0 },

}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Virtual: full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Don't send password in responses
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
