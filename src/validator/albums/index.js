const albumsSchema = require("./schema");
const InvariantError = require("../../utils/exceptions/InvariantError");

const validatorAlbums = {
	validateAlbumsPayload: (payload) => {
		const validationResult = albumsSchema.validate(payload);
		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
};

module.exports = validatorAlbums;
