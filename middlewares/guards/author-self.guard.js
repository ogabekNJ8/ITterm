const { sendErrorresponse } = require("../../helpers/send_error_response");

module.exports = (req, res, next) => {
  try {
    //logika
    if (req.params.id !== req.author.id) {
      return res
        .status(403)
        .send({
          message: "Ruxsat etilmagan user. Only readable for private data",
        });
    }
    next();
  } catch (error) {
    sendErrorresponse(error, res);
  }
};
