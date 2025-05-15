const User = require("../schemas/User");
const { sendErrorresponse } = require("../helpers/send_error_response");
const { userValidation } = require("../validation/user.validation");
const bcrypt = require("bcrypt");
const jwtService = require("../services/jwt.service");

const addUser = async (req, res) => {
  try {
    const { error, value } = userValidation(req.body);
    if (error) return sendErrorresponse(error, res);

    const hashedPassword = bcrypt.hashSync(value.password, 7);
    const newUser = await User.create({
      ...value,
      password: hashedPassword,
    });

    res.status(201).send({ message: "New user added", newUser });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).send({ message: "Login yoki parol notogri" });

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword)
      return res.status(401).send({ message: "Login yoki parol noto'gri" });

    const payload = {
      id: user._id,
      email: user.email,
      is_active: user.is_active,
    };

    const tokens = jwtService.generateTokens(payload);
    user.refresh_token = tokens.refreshToken;
    await user.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // config.get("cookie_refresh_time") ni yozsangiz yaxshi
    });

    res
      .status(200)
      .send({
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
    res.status(200).send({ data: user });
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

    res.status(200).send({ message: "User yangilandi", data: updatedUser });
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

module.exports = {
  addUser,
  loginUser,
  logoutUser,
  findAll,
  findById,
  update,
  remove,
};
