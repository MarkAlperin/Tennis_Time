require("dotenv").config();
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

mongoose
.connect(process.env.CONNECT_STRING)
  // .connect(
  //   `mongodb://${process.env.USER}:${process.env.PASSWORD}@${process.env.DB_URL}:${process.env.DB_PORT}/?authMechanism=SCRAM-SHA-256`,
  //   { dbName: `${process.env.DB_NAME}` }
  // )
  // .connect("mongodb://localhost:27017/reservations")
  .then((res) => console.log("You are connected to the Reservations DB!"))
  .catch((err) => console.log(err));

let reservationsSchema = new mongoose.Schema({
  date: Date,
  time: String,
  month: String,
  day: Number,
  facility: String,
  courts: [String],
  game: String,
  humanTime: [String],
  isRandi: Boolean,
  isScheduled: Boolean,
});

module.exports = mongoose.model("Reservations", reservationsSchema);
