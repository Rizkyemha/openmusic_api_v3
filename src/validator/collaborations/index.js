const collaborationsSchema = require("./schema");
const InvariantError = require("../../utils/exceptions/InvariantError");

const validatorCollaborations = {
	validateCollaborationsPayload: (payload) => {
		const validationResult = collaborationsSchema.validate(payload);
		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
};

module.exports = validatorCollaborations;
