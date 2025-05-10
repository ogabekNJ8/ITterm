const Author = require("../schemas/Author");
const { sendErrorresponse } = require("../helpers/send_error_response");
const { authorValidation } = require("../validation/author.validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

const addAuthor = async (req, res) => {
  try {
    const { error, value } = authorValidation(req.body);
    if (error) {
      return sendErrorresponse(error, res);
    }
    const hashedPassword = bcrypt.hashSync(value.password, 7);
    const newAuthor = await Author.create({
      ...value,
      password: hashedPassword,
    });

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
    const token = jwt.sign(payload, config.get("tokenKey"), {
      expiresIn: config.get("tokenExpTime"),
    });

    res
      .status(201)
      .send({ message: "Tizimga xush kelibsiz", id: author.id, token }); // tokenni bervorish kerak
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

module.exports = {
  addAuthor,
  findAll,
  findById,
  update,
  remove,
  loginAuthor,
};
