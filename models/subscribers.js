"use strict";

const mongoose = require("mongoose");

const subscriberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    zipCode: {
      type: Number,
      min: [10000, "Zipcode is too short"],
      max: 99999
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
      }
    ]
  },
  { timestamps: true }
);

subscriberSchema.statics.getInfo = async function (name) {
  try {
    const jMac = await this.find({ name }).exec();
    console.log(jMac);
  } catch (error) {
    console.error(error);
  }
};

module.exports = mongoose.model("Subscriber", subscriberSchema);
