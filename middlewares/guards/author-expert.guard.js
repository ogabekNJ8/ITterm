const { sendErrorresponse } = require("../../helpers/send_error_response");

module.exports = (req, res, next) => {
  try {
    //logika
    if (req.author.is_expert) {
      return res
        .status(403)
        .send({
          message: "Ruxsat etilmagan user. You are not expert",
        });
    }
    next();
  } catch (error) {
    sendErrorresponse(error, res);
  }
};
