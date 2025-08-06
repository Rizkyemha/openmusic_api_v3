const { createSongId } = require("../../utils/nanoId");

class SongsHandler {
	constructor(service, validator) {
		this._service = service;
		this._validator = validator;

		this.addSongHandler = this.addSongHandler.bind(this);
		this.getSongsHandler = this.getSongsHandler.bind(this);
		this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
		this.editSongByIdHandler = this.editSongByIdHandler.bind(this);
		this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
	}

	async addSongHandler(request, h) {
		this._validator.validateSongsPayload(request.payload);
		const id = await this._service.addSong(request.payload);

		const response = h.response({
			status: "success",
			data: {
				songId: id,
			},
		});

		response.code(201);
		return response;
	}

	async getSongsHandler(request) {
		const songs = await this._service.getSongs(request.query);

		return {
			status: "success",
			data: {
				songs,
			},
		};
	}

	async getSongByIdHandler(request) {
		const { id } = request.params;

		const song = await this._service.getSongById(id);

		return {
			status: "success",
			data: {
				song,
			},
		};
	}

	async editSongByIdHandler(request) {
		this._validator.validateSongsPayload(request.payload);
		const { id } = request.params;

		await this._service.editSongById(id, request.payload);

		return {
			status: "success",
			message: "Song berhasil diperbarui",
		};
	}

	async deleteSongByIdHandler(request) {
		const { id } = request.params;

		await this._service.deleteSongById(id);
		return {
			status: "success",
			message: "Song berhasil dihapus",
		};
	}
}

module.exports = SongsHandler;
