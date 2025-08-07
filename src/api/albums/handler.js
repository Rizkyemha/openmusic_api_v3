const { createAlbumId } = require("../../utils/nanoId");
const path = require("path");

class AlbumsHandler {
	constructor(service, storage, validator) {
		this._service = service;
		this._storage = storage;
		this._validator = validator;

		this.addAlbumHandler = this.addAlbumHandler.bind(this);
		this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
		this.editAlbumByIdHandler = this.editAlbumByIdHandler.bind(this);
		this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
		this.uploadCoverHandler = this.uploadCoverHandler.bind(this);
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

	async uploadCoverHandler(request, h) {
		const { id } = request.params;
		const { cover } = request.payload;

		this._validator.validateImageHeader(cover.hapi.headers);

		const filename = await this._storage.writeFile(cover, cover.hapi);
		const fileUrl = `http://${process.env.HOST}:${process.env.PORT}/albums/covers/${filename}`;

		await this._service.addCoverAlbum(id, fileUrl);

		const response = h.response({
			status: "success",
			message: "Sampul berhasil diunggah",
		});
		response.code(201);
		return response;
	}
}

module.exports = AlbumsHandler;
