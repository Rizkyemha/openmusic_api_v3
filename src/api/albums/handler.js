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
		this.postLikeAlbumHandler = this.postLikeAlbumHandler.bind(this);
		this.getLikeAlbumHandler = this.getLikeAlbumHandler.bind(this);
		this.deleteLikeAlbumHandler = this.deleteLikeAlbumHandler.bind(this);
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

	async postLikeAlbumHandler(request, h) {
		const { id: albumId } = request.params;
		const { id: userId } = request.auth.credentials;

		await this._service.verifyAlbumExists(albumId);
		await this._service.verifyLikeAlbumUserExists(albumId, userId);
		await this._service.likeAlbum(albumId, userId);

		const response = h.response({
			status: "success",
			message: "Like berhasil ditambahkan",
		});
		response.code(201);
		return response;
	}

	async getLikeAlbumHandler(request, h) {
		const { id: albumId } = request.params;

		const { _likes, isCache } = await this._service.getLikesAlbum(albumId);

		const response = h.response({
			status: "success",
			data: {
				likes: _likes,
			},
		});

		if (isCache) response.header("X-Data-Source", "cache");
		response.code(200);
		return response;
	}

	async deleteLikeAlbumHandler(request) {
		const { id: albumId } = request.params;
		const { id: userId } = request.auth.credentials;

		await this._service.unlikeAlbum(albumId, userId);

		return {
			status: "success",
			message: "Like berhasil dihapus",
		};
	}
}

module.exports = AlbumsHandler;
