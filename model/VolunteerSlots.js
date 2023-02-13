const mongoose = require("mongoose");

const VolunteerDetailsSchema = new mongoose.Schema({
  email: { type: String, required: true },
  type_of_volunteer: { type: String, required: true }, // individual or corporate
  qty: { type: number, required: true },
  file: {}, // Excel file
});

const SlotSchema = new mongoose.Schema({
  timing: { type: String, required: true },
  orig_num_of_slots_available: { type: Number, required: true },
  num_of_sign_ups: { type: Number, required: true },
  volunteerDetails: [VolunteerDetailsSchema],
});

const VolunteerSlotsSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    soupKitchen: [SlotSchema],
    driver: [SlotSchema],
  },
  {
    collection: "volunteerSlots",
  }
);

module.exports = mongoose.model("VolunteerSlots", VolunteerSlotsSchema);
