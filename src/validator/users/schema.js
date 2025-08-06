const Joi = require("../../utils/joi");
const { nameScema, passwordScema, usernameScema } = require("../schemaElement");

const userSchema = Joi.object({
	username: usernameScema,
	password: passwordScema,
	fullname: nameScema,
});

module.exports = userSchema;
