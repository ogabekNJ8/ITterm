const User = require("../schemas/User");
const { sendErrorresponse } = require("../helpers/send_error_response");
const { userValidation } = require("../validation/user.validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

const addUser = async (req, res) => {
  try {
    const { error, value } = userValidation(req.body);
    if (error) {
      return sendErrorresponse(error, res);
    }

    const hashedPassword = bcrypt.hashSync(value.password, 7);
    const newUser = await User.create({
      ...value,
      password: hashedPassword,
    });

    res.status(201).send({ message: "New User added", newUser });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).send({ message: "Email yoki password xato" });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(401).send({ message: "Email yoki password xato" });
    }

    const payload = {
      id: user._id,
      email: user.email,
      is_active: user.is_active,
    };
    const token = jwt.sign(payload, config.get("tokenKey"), {
      expiresIn: config.get("tokenExpTime"),
    });

    res
      .status(201)
      .send({ message: "Tizimga xush kelibsiz", id: user.id, token });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const findAll = async (req, res) => {
  try {
    const data = await User.find();
    res.status(200).send({ users: data });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const findById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    res.status(200).send({ data: user });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const update = async (req, res) => {
  try {
    const { error, value } = userValidation(req.body);
    if (error) {
      return sendErrorresponse(error, res);
    }

    if (value.password) {
      value.password = bcrypt.hashSync(value.password, 7);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({ message: "User updated", data: updatedUser });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    res.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    sendErrorresponse(error, res);
  }
};

module.exports = {
  addUser,
  findAll,
  findById,
  update,
  remove,
  loginUser,
};
