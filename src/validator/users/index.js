const userSchema = require("./schema");
const InvariantError = require("../../utils/exceptions/InvariantError");

const validatorUsers = {
	validateUsersPayload: (payload) => {
		const validationResult = userSchema.validate(payload);
		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
};

module.exports = validatorUsers;
