const Joi = require("../../utils/joi");
const { nameScema, yearScema } = require("../schemaElement");

const albumsSchema = Joi.object({
	name: nameScema,
	year: yearScema,
});

module.exports = albumsSchema;
