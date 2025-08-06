const { userIdScema, playlistIdScema } = require("../schemaElement");
const Joi = require("../../utils/joi");
const { user } = require("pg/lib/defaults");

const collaborationsSchema = Joi.object({
	playlistId: playlistIdScema,
	userId: userIdScema,
});

module.exports = collaborationsSchema;
