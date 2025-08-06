const { createAlbumId } = require("../../utils/nanoId");

class AlbumsHandler {
	constructor(service, validator) {
		this._service = service;
		this._validator = validator;

		this.addAlbumHandler = this.addAlbumHandler.bind(this);
		this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
		this.editAlbumByIdHandler = this.editAlbumByIdHandler.bind(this);
		this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
	}

	async addAlbumHandler(request, h) {
		this._validator.validateAlbumsPayload(request.payload);

		const id = await this._service.addAlbum(request.payload);

		const response = h.response({
			status: "success",
			data: {
				albumId: id,
			},
		});

		response.code(201);
		return response;
	}

	async getAlbumByIdHandler(request) {
		const { id } = request.params;

		const album = await this._service.getAlbumById(id);

		return {
			status: "success",
			data: {
				album,
			},
		};
	}

	async editAlbumByIdHandler(request, h) {
		this._validator.validateAlbumsPayload(request.payload);
		const { id } = request.params;

		await this._service.editAlbumById(id, request.payload);

		return {
			status: "success",
			message: "Album berhasil diperbarui",
		};
	}

	async deleteAlbumByIdHandler(request, h) {
		const { id } = request.params;

		await this._service.deleteAlbumById(id);

		return {
			status: "success",
			message: "Album berhasil dihapus",
		};
	}
}

module.exports = AlbumsHandler;
