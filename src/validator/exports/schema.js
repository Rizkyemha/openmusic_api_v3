const Joi = require("../../utils/joi");

const exportsSchema = Joi.object({
	targetEmail: Joi.string().email().required(),
});

module.exports = exportsSchema;
