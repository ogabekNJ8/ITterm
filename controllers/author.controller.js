const Author = require("../schemas/Author");
const { sendErrorresponse } = require("../helpers/send_error_response");
const { authorValidation } = require("../validation/author.validation");
const bcrypt = require("bcrypt");
const config = require("config");
const { authorJwtService } = require("../services/jwt.service");
const uuid = require("uuid");
const mailService = require("../services/mail.service");

const addAuthor = async (req, res) => {
  try {
    const { error, value } = authorValidation(req.body);
    if (error) {
      return sendErrorresponse(error, res);
    }
    const hashedPassword = bcrypt.hashSync(value.password, 7);
    const activation_link = uuid.v4();
    const newAuthor = await Author.create({
      ...value,
      password: hashedPassword,
      activation_link,
    });
    const link = `${config.get(
      "api_url"
    )}/api/author/activate/${activation_link}`;
    await mailService.sendMail(value.email, link);

    res.status(201).send({ message: "New Author added", newAuthor });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const loginAuthor = async (req, res) => {
  try {
    const { email, password } = req.body;
    //ident
    const author = await Author.findOne({ email });

    if (!author) {
      return res.status(401).send({ message: "Email yoki password xato" });
    }

    //auth
    const validPassword = bcrypt.compareSync(password, author.password);
    if (!validPassword) {
      return res.status(401).send({ message: "Email yoki password xato" });
    }

    //token
    const payload = {
      id: author._id,
      email: author.email,
      is_active: author.is_active,
      is_expert: author.is_expert,
    };

    // const token = jwt.sign(payload, config.get("tokenKey"), {
    //   expiresIn: config.get("tokenExpTime"),
    // });

    const tokens = authorJwtService.generateTokens(payload);
    author.refresh_token = tokens.refreshToken;
    await author.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("cookie_refresh_time"),
    });

    // //-------------------------- TEST UCHUN ERROR ---------------------

    // try {
    //   setTimeout(function () {
    //     throw new Error("UncaughtException example");
    //   }, 1000);
    // } catch (error) {
    //   console.log(error);
    // }

    // new Promise((_, reject) => {
    //   reject(new Error("UnHandledRejection example"));
    // });

    // //-------------------------- TEST UCHUN ERROR ---------------------

    res.status(201).send({
      message: "Tizimga xush kelibsiz",
      id: author.id,
      accessToken: tokens.accessToken,
    }); // tokenni bervorish kerak
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const logoutAuthor = async (req, res) => {
  try {
    // console.log(req.cookies);
    // console.log(req.headers.cookie);
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res
        .status(400)
        .send({ message: "Cookieda refresh token topilmadi" });
    }
    const author = await Author.findOneAndUpdate(
      {
        refresh_token: refreshToken,
      },
      {
        refresh_token: "",
      },
      {
        new: true,
      }
    );

    if (!author) {
      return res.status(400).send({ message: "Token noto'g'ri" });
    }

    res.clearCookie("refreshToken");
    res.send({ author });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const findAll = async (req, res) => {
  try {
    const data = await Author.find();
    res.status(200).send({ authors: data });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const findById = async (req, res) => {
  const { id } = req.params;
  try {
    const author = await Author.findById(id);
    res.status(200).send({ data: author });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const update = async (req, res) => {
  try {
    const { error, value } = authorValidation(req.body);
    if (error) {
      return sendErrorresponse(error, res);
    }

    const updatedAuthor = await Author.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    });

    if (!updatedAuthor) {
      return res.status(404).send({ message: "Author not found" });
    }

    res.status(200).send({ message: "Author updated", data: updatedAuthor });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  try {
    await Author.findByIdAndDelete(id);
    res.status(200).send({ message: "Author deleted successfully" });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const refreshAuthorToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res
        .status(400)
        .send({ message: "Cookieda refresh token topilmadi" });
    }

    await authorJwtService.verifyRefreshToken(refreshToken);

    const author = await Author.findOne({ refresh_token: refreshToken });

    if (!author) {
      return res
        .status(401)
        .send({ message: "Refresh token bazada topilmadi" });
    }
    const payload = {
      id: author._id,
      email: author.email,
      is_active: author.is_active,
      is_expert: author.is_expert,
    };

    const tokens = authorJwtService.generateTokens(payload);
    author.refresh_token = tokens.refreshToken;
    await author.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("cookie_refresh_time"),
    });
    res.status(201).send({
      message: "Tokenlar yangilandi",
      id: author.id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const authorActivate = async (req, res) => {
  try {
    const { link } = req.params;
    const author = await Author.findOne({ activation_link: link });

    if (!author) {
      return res.status(400).send({ message: "Avtor link noto'g'ri" });
    }
    if (author.is_active) {
      return res.status(400).send({ message: "Avtor avval faollashtirilgan" });
    }
    author.is_active = true;
    await author.save();
    res.send({ message: "Avtor faollashtirildi", isActive: author.is_active });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};
module.exports = {
  addAuthor,
  findAll,
  findById,
  update,
  remove,
  loginAuthor,
  logoutAuthor,
  refreshAuthorToken,
  authorActivate,
};
