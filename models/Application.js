// models/Application.js — Student project application model

const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({

  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // ── APPLICATION CONTENT ──
  coverLetter: { type: String, maxlength: 1000 },
  bidAmount:   { type: Number },          // student's proposed price
  timeline:    { type: String },          // student's proposed timeline

  // ── STATUS ──
  status: {
    type: String,
    enum: ['submitted', 'under_review', 'shortlisted', 'accepted', 'rejected'],
    default: 'submitted',
  },

  // ── REVIEW (after completion) ──
  clientRating:  { type: Number, min: 1, max: 5 },
  clientReview:  { type: String },
  studentRating: { type: Number, min: 1, max: 5 },
  studentReview: { type: String },

}, { timestamps: true });

// One student can apply once per project
applicationSchema.index({ project: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
