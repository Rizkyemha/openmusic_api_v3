const Joi = require("../../utils/joi");
const { nameScema, yearScema } = require("../schemaElement");

const albumsSchema = Joi.object({
	name: nameScema,
	year: yearScema,
});

const imageHeaderSchema = Joi.object({
	"content-type": Joi.string()
		.valid(
			"image/apng",
			"image/avif",
			"image/gif",
			"image/jpeg",
			"image/png",
			"image/webp"
		)
		.required(),
}).unknown();

module.exports = { albumsSchema, imageHeaderSchema };
