const {
	authenticationsPostRefreshTokenSchema,
	authenticationsPutRefreshTokenSchema,
} = require("./schema");
const InvariantError = require("../../utils/exceptions/InvariantError");

const validatorAuthentications = {
	validatePostRefreshTokenPayload: (payload) => {
		const validationResult =
			authenticationsPostRefreshTokenSchema.validate(payload);
		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
	validatePutRefreshTokenPayload: (payload) => {
		const validationResult =
			authenticationsPutRefreshTokenSchema.validate(payload);
		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
};

module.exports = validatorAuthentications;
