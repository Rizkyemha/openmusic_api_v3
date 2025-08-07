const exportsSchema = require("./schema");
const InvariantError = require("../../utils/exceptions/InvariantError");

const validatorExports = {
	validateExportsPayload: (payload) => {
		const validationResult = exportsSchema.validate(payload);
		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
};

module.exports = validatorExports;
