const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: Number,
      required: true,
    },
  },
  { 
    timestamps: true // This adds `createdAt` and `updatedAt` automatically
  }
);

// Create a TTL index on the `createdAt` field, which expires after 1 minute (60 seconds)
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });

const otpModel = mongoose.model("otp", otpSchema);
module.exports = otpModel;
