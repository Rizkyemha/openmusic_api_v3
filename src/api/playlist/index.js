const routes = require("./routes");
const PlaylistsHandler = require("./handler");

module.exports = {
	name: "playlist",
	version: "1.0.0",
	register: async (server, { playlistService, songsService, validator }) => {
		const playlistsHandler = new PlaylistsHandler(
			playlistService,
			songsService,
			validator
		);
		server.route(routes(playlistsHandler));
	},
};
