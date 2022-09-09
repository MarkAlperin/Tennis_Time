require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cron = require("node-cron");

const DB = require("../db/index.js");
const findAndMakeRes = require("../scripts/findAndMakeRes.js");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.post("/reservations", async (req, res) => {
  console.log("req.body: ", req.body);
  DB.reservations.findOneAndUpdate({ date: req.body.date }, req.body, {
    new: true,
    upsert: true,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.error(err);
    });
});

app.get("/reservations", (req, res) => {
  DB.reservations.find({}).sort({ date: 1 })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.error(err);
      res.send(err);
    });
});

app.put("/reservations/:id", (req, res) => {
  DB.reservations.findOneAndUpdate({ _id: req.params._id }, { $set: req.body })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.delete("/reservations/:id", (req, res) => {
  DB.reservations.findByIdAndDelete(req.params.id)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.listen(process.env.PORT);
console.log(`Listening at http://localhost:${process.env.PORT}`);

const date = new Date();
let cronStartString = `${date.getSeconds() + 1} ${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${(date.getMonth() + 1)} * `;
cron.schedule(cronStartString, () => {
  console.log("RUNNING findAndMakeReservations: ",  new Date());
  findAndMakeRes({runNow: true});
})
