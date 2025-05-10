const { response } = require("express");

const sendErrorresponse = (error, res) => {
  console.log(error);
  // console.log(error.details[0].path);
  // console.log(error.details[0].path);
  res.status(400).send({message: "Xatolik", error: error.message})
}

module.exports = {
  sendErrorresponse
}