const songsScema = require("./schema");
const InvariantError = require("../../utils/exceptions/InvariantError");

const validatorSongs = {
	validateSongsPayload: (payload) => {
		const validationResult = songsScema.validate(payload);
		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
};

module.exports = validatorSongs;
