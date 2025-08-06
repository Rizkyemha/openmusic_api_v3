const {
	usernameScema,
	passwordScema,
	refreshTokenScema,
} = require("../schemaElement");
const Joi = require("../../utils/joi");

const authenticationsPostRefreshTokenSchema = Joi.object({
	username: usernameScema,
	password: passwordScema,
});

const authenticationsPutRefreshTokenSchema = Joi.object({
	refreshToken: refreshTokenScema,
});

module.exports = {
	authenticationsPostRefreshTokenSchema,
	authenticationsPutRefreshTokenSchema,
};
