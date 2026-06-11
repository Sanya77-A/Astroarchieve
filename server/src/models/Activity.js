const mongoose = require('mongoose');

const activitySchema = mongoose.Schema(
  {
    message: { type: String, required: true },
    type: { type: String, enum: ['created', 'updated', 'deleted'], default: 'created' },
  },
  {
    timestamps: true,
  }
);

const Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity;
