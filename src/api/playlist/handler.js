class PlaylistHandler {
	constructor(playlistService, songsService, validator) {
		this._playlistService = playlistService;
		this._songsService = songsService;
		this._validator = validator;

		this.addPlaylistHandler = this.addPlaylistHandler.bind(this);
		this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
		this.deletePlaylistByIdHandler =
			this.deletePlaylistByIdHandler.bind(this);
		this.addSongToPlaylistByIdHandler =
			this.addSongToPlaylistByIdHandler.bind(this);
		this.getSongsFromPlaylistByIdHandler =
			this.getSongsFromPlaylistByIdHandler.bind(this);
		this.deleteSongFromPlaylistByIdHandler =
			this.deleteSongFromPlaylistByIdHandler.bind(this);
		this.getPlaylistActivitiesHandler =
			this.getPlaylistActivitiesHandler.bind(this);
	}

	async addPlaylistHandler(request, h) {
		this._validator.validateCreatePlaylistPayload(request.payload);
		const { id: ownerId } = request.auth.credentials;

		const playlistId = await this._playlistService.addPlaylist(
			ownerId,
			request.payload
		);

		const response = h.response({
			status: "success",
			data: {
				playlistId,
			},
		});

		response.code(201);
		return response;
	}

	async getPlaylistsHandler(request) {
		const { id: ownerId } = request.auth.credentials;

		const playlists = await this._playlistService.getPlaylists(ownerId);

		return {
			status: "success",
			data: {
				playlists,
			},
		};
	}

	async deletePlaylistByIdHandler(request, h) {
		const { id } = request.params;
		const { id: ownerId } = request.auth.credentials;

		await this._playlistService.verifyPlaylistOwner(id, ownerId);
		await this._playlistService.deletePlaylistById(id, ownerId);

		return {
			status: "success",
			message: "Playlist berhasil dihapus",
		};
	}

	async addSongToPlaylistByIdHandler(request, h) {
		this._validator.validateAddSongsPlaylistPayload(request.payload);

		const { id: ownerId } = request.auth.credentials;
		const { id: playlistId } = request.params;
		const { songId } = request.payload;
		const action = "add";

		await this._playlistService.verifyPlaylistAccess(playlistId, ownerId);
		await this._songsService.getSongById(songId);
		await this._playlistService.verifySongInPlaylist(playlistId, songId);

		await this._playlistService.addSongToPlaylist(playlistId, songId);
		await this._playlistService.addPlaylistAction(
			playlistId,
			ownerId,
			songId,
			action
		);

		const response = h.response({
			status: "success",
			message: "Lagu berhasil ditambahkan ke playlist",
		});

		response.code(201);
		return response;
	}

	async getSongsFromPlaylistByIdHandler(request, h) {
		const { id: ownerId } = request.auth.credentials;
		const { id: playlistId } = request.params;

		await this._playlistService.verifyPlaylistAccess(playlistId, ownerId);

		const playlist = await this._playlistService.getSongsFromPlaylist(
			playlistId
		);

		return {
			status: "success",
			data: {
				playlist,
			},
		};
	}

	async deleteSongFromPlaylistByIdHandler(request, h) {
		this._validator.validateAddSongsPlaylistPayload(request.payload);

		const { id: ownerId } = request.auth.credentials;
		const { id: playlistId } = request.params;
		const { songId } = request.payload;
		const action = "delete";

		await this._playlistService.verifyPlaylistAccess(playlistId, ownerId);
		await this._songsService.getSongById(songId);
		await this._playlistService.deleteSongFromPlaylist(playlistId, songId);
		await this._playlistService.addPlaylistAction(
			playlistId,
			ownerId,
			songId,
			action
		);

		return {
			status: "success",
			message: "Lagu berhasil dihapus dari playlist",
		};
	}

	async getPlaylistActivitiesHandler(request) {
		const { id: playlistId } = request.params;
		const { id: ownerId } = request.auth.credentials;

		await this._playlistService.verifyPlaylistAccess(playlistId, ownerId);

		const activities = await this._playlistService.getPlaylistActivities(
			playlistId
		);

		return {
			status: "success",
			data: {
				playlistId,
				activities,
			},
		};
	}
}

module.exports = PlaylistHandler;
