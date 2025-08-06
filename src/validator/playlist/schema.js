const { songIdScema, namePlaylistScema } = require("../schemaElement");
const Joi = require("../../utils/joi");

const createPlaylistSchema = Joi.object({
	name: namePlaylistScema,
});

const addSongsPlaylistSchema = Joi.object({
	songId: songIdScema,
});

module.exports = {
	createPlaylistSchema,
	addSongsPlaylistSchema,
};
