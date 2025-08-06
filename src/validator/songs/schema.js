const Joi = require("../../utils/joi");
const {
	titleScema,
	yearScema,
	genreScema,
	performerScema,
	durationScema,
	albumIdScema,
} = require("../schemaElement");

const songsScema = Joi.object({
	title: titleScema,
	year: yearScema,
	genre: genreScema,
	performer: performerScema,
	duration: durationScema,
	albumId: albumIdScema,
});

module.exports = songsScema;
