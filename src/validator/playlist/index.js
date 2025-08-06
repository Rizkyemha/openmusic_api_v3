const { createPlaylistSchema, addSongsPlaylistSchema } = require("./schema");
const InvariantError = require("../../utils/exceptions/InvariantError");

const validatorPlaylist = {
	validateCreatePlaylistPayload: (payload) => {
		const validationResult = createPlaylistSchema.validate(payload);
		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
	validateAddSongsPlaylistPayload: (payload) => {
		const validationResult = addSongsPlaylistSchema.validate(payload);
		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
};

module.exports = validatorPlaylist;
