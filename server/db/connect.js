/**
 * This module establish the connection with database
 */

const mongoose = require("mongoose");
// const chalk = require("chalk");

//------------------------------------------------------------------------

/**
 * global variables
 */

//------------------------------------------------------------------------

// this function establish the connection between node server and mongo database
const connectDB = () => {
  const mongoUrl = process.env.DB_URL;
  return new Promise((resolve, reject) => {
    mongoose
      .connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      })
      .then((res) => {
        console.log("DB Connection Successful");
        resolve();
      })
      .catch((err) => {
        console.log("DB Connection Failed");
        reject(err);
      });
  });
};

//------------------------------------------------------------------------

/**
 * Export the modules
 */

module.exports = { connectDB };
