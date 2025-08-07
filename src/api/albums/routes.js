const path = require("path");

const routes = (handler) => [
	{
		method: "POST",
		path: "/albums",
		handler: handler.addAlbumHandler,
	},
	{
		method: "GET",
		path: "/albums/{id}",
		handler: handler.getAlbumByIdHandler,
	},
	{
		method: "PUT",
		path: "/albums/{id}",
		handler: handler.editAlbumByIdHandler,
	},
	{
		method: "DELETE",
		path: "/albums/{id}",
		handler: handler.deleteAlbumByIdHandler,
	},
	{
		method: "POST",
		path: "/albums/{id}/covers",
		handler: handler.uploadCoverHandler,
		options: {
			payload: {
				allow: "multipart/form-data",
				multipart: true,
				output: "stream",
				maxBytes: 512000,
			},
		},
	},
	{
		method: "GET",
		path: "/albums/{param*}",
		handler: {
			directory: {
				path: path.resolve(__dirname, "images"),
			},
		},
	},
];

module.exports = routes;
