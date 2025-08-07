const { albumsSchema, imageHeaderSchema } = require("./schema");
const InvariantError = require("../../utils/exceptions/InvariantError");

const validatorAlbums = {
	validateAlbumsPayload: (payload) => {
		const validationResult = albumsSchema.validate(payload);
		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
	validateImageHeader: (headers) => {
		const validationResult = imageHeaderSchema.validate(headers);
		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
};

module.exports = validatorAlbums;
