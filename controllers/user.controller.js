const User = require("../schemas/User");
const { sendErrorresponse } = require("../helpers/send_error_response");
const { userValidation } = require("../validation/user.validation");
const bcrypt = require("bcrypt");
const { userJwtService } = require("../services/jwt.service");
const config = require("config");
const uuid = require("uuid");
const mailService = require("../services/mail.service");

const addUser = async (req, res) => {
  try {
    const { error, value } = userValidation(req.body);
    if (error) return sendErrorresponse(error, res);

    const hashedPassword = bcrypt.hashSync(value.password, 7);
    const activation_link = uuid.v4();

    const newUser = await User.create({
      ...value,
      password: hashedPassword,
      activation_link,
    });

    const link = `${config.get(
      "api_url"
    )}/api/user/activate/${activation_link}`;
    await mailService.sendMail(value.email, link);

    res.status(201).send({ message: "New user added", newUser });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ message: "Email va parol kerak" });
    }
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).send({ message: "Login yoki parol noto'g'ri" });

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword)
      return res.status(401).send({ message: "Login yoki parol noto'g'ri" });

    const payload = {
      id: user._id,
      email: user.email,
      is_active: user.is_active,
    };

    const tokens = userJwtService.generateTokens(payload);
    user.refresh_token = tokens.refreshToken;
    await user.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("cookie_refresh_time"),
    });

    res.status(200).send({
      message: "Tizimga xush kelibsiz",
      accessToken: tokens.accessToken,
      id: user.id,
    });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.status(400).send({ message: "Token yo'q" });

    const user = await User.findOneAndUpdate(
      { refresh_token: refreshToken },
      { refresh_token: "" },
      { new: true }
    );

    if (!user) return res.status(400).send({ message: "Token noto'g'ri" });

    res.clearCookie("refreshToken");
    res.send({ message: "User logout qilindi" });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const findAll = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send({ users });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const findById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send({ message: "User topilmadi" });
    res.status(200).send({ user });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const update = async (req, res) => {
  try {
    const { error, value } = userValidation(req.body);
    if (error) return sendErrorresponse(error, res);

    const updatedUser = await User.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser)
      return res.status(404).send({ message: "User topilmadi" });

    res.status(200).send({ message: "User yangilandi", updatedUser });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const remove = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: "User o'chirildi" });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const refreshUserToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res
        .status(400)
        .send({ message: "Cookieda refresh token topilmadi" });
    }

    await userJwtService.verifyRefreshToken(refreshToken);

    const user = await User.findOne({ refresh_token: refreshToken });

    if (!user) {
      return res
        .status(401)
        .send({ message: "Refresh token bazada topilmadi" });
    }

    const payload = {
      id: user._id,
      email: user.email,
      is_active: user.is_active,
    };

    const tokens = userJwtService.generateTokens(payload);
    user.refresh_token = tokens.refreshToken;
    await user.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("cookie_refresh_time"),
    });

    res.status(201).send({
      message: "Tokenlar yangilandi",
      id: user.id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const userActivate = async (req, res) => {
  try {
    const { link } = req.params;
    const user = await User.findOne({ activation_link: link });

    if (!user) {
      return res.status(400).send({ message: "Foydalanuvchi link noto'g'ri" });
    }

    if (user.is_active) {
      return res
        .status(400)
        .send({ message: "Foydalanuvchi allaqachon faollashtirilgan" });
    }

    user.is_active = true;
    await user.save();

    res.send({
      message: "Foydalanuvchi faollashtirildi",
      isActive: user.is_active,
    });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

module.exports = {
  addUser,
  loginUser,
  logoutUser,
  findAll,
  findById,
  update,
  remove,
  refreshUserToken,
  userActivate,
};
