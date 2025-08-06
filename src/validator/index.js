const albumsSchema = require("./albums/schema");
const songsScema = require("./songs/schema");
const usersSchema = require("./users/schema");

const InvariantError = require("../utils/exceptions/InvariantError");

const validatePayload = {
	validateAlbumsPayload: (payload) => {
		const validationResult = albumsSchema.validate(payload);
		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
	validateSongsPayload: (payload) => {
		const validationResult = songsScema.validate(payload);
		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
	validateUserPayload: (payload) => {
		const validationResult = usersSchema.validate(payload);
		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
};

module.exports = validatePayload;
