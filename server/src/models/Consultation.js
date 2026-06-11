const mongoose = require('mongoose');

const consultationSchema = mongoose.Schema(
  {
    clientName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    consultationDate: { type: Date, required: true },
    duration: { type: Number, required: true, min: 1 },
    category: {
      type: String,
      required: true,
      enum: ['Career', 'Marriage', 'Health', 'Business', 'Education', 'Finance', 'General'],
    },
    mode: {
      type: String,
      required: true,
      enum: ['Phone Call', 'WhatsApp Call', 'Zoom', 'Google Meet', 'In-Person'],
      default: 'Phone Call',
    },
    status: {
      type: String,
      required: true,
      enum: ['Completed', 'Pending', 'Follow-Up Required'],
      default: 'Completed',
    },
    followUpRequired: { type: Boolean, default: false },
    followUpDate: { type: Date, default: null },
    tags: [{ type: String, trim: true }],
    recordingLink: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

const Consultation = mongoose.model('Consultation', consultationSchema);
module.exports = Consultation;
