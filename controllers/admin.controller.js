const Admin = require("../schemas/Admin");
const { sendErrorresponse } = require("../helpers/send_error_response");
const { adminValidation } = require("../validation/admin.validation");
const bcrypt = require("bcrypt");
const config = require("config");
const { adminJwtService } = require("../services/jwt.service");

const addAdmin = async (req, res) => {
  try {
    const { error, value } = adminValidation(req.body);
    if (error) return sendErrorresponse(error, res);

    const hashedPassword = bcrypt.hashSync(value.password, 7);
    const newAdmin = await Admin.create({
      ...value,
      password: hashedPassword,
    });

    res.status(201).send({ message: "New admin added", newAdmin });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin)
      return res.status(401).send({ message: "Login yoki parol notogri" });

    const validPassword = bcrypt.compareSync(password, admin.password);
    if (!validPassword)
      return res.status(401).send({ message: "Login yoki parol noto'gri" });

    const payload = {
      id: admin._id,
      email: admin.email,
      is_active: admin.is_active,
      is_creator: admin.is_creator,
    };

    const tokens = adminJwtService.generateTokens(payload);
    admin.refresh_token = tokens.refreshToken;
    await admin.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("adminCookie_refresh_time")
    });

    res.status(200).send({
      message: "Tizimga xush kelibsiz",
      accessToken: tokens.accessToken,
      id: admin.id,
    });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const logoutAdmin = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.status(400).send({ message: "Token yo'q" });

    const admin = await Admin.findOneAndUpdate(
      { refresh_token: refreshToken },
      { refresh_token: "" },
      { new: true }
    );

    if (!admin) return res.status(400).send({ message: "Token notog'ri" });

    res.clearCookie("refreshToken");
    res.send({ message: "Admin logout qilindi" });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const findAll = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).send({ admins });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const findById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    res.status(200).send({ data: admin });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const update = async (req, res) => {
  try {
    const { error, value } = adminValidation(req.body);
    if (error) return sendErrorresponse(error, res);

    const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    });

    if (!updatedAdmin)
      return res.status(404).send({ message: "Admin topilmadi" });

    res.status(200).send({ message: "Admin yangilandi", data: updatedAdmin });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const remove = async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: "Admin o'chirildi" });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const refreshAdminToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res
        .status(400)
        .send({ message: "Cookieda refresh token topilmadi" });
    }

    await adminJwtService.verifyRefreshToken(refreshToken);

    const admin = await Admin.findOne({ refresh_token: refreshToken });

    if (!admin) {
      return res
        .status(401)
        .send({ message: "Refresh token bazada topilmadi" });
    }

    const payload = {
      id: admin._id,
      email: admin.email,
      is_active: admin.is_active,
    };

    const tokens = adminJwtService.generateTokens(payload);
    admin.refresh_token = tokens.refreshToken;
    await admin.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("cookie_refresh_time"),
    });

    res.status(201).send({
      message: "Tokenlar yangilandi",
      id: admin.id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

module.exports = {
  addAdmin,
  loginAdmin,
  logoutAdmin,
  findAll,
  findById,
  update,
  remove,
  refreshAdminToken
};
