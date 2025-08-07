class ExportsHandler {
	constructor(playlistService, producerService, validator) {
		this._playlistService = playlistService;
		this._producerService = producerService;
		this._validator = validator;

		this.postExportsPlaylistHandler =
			this.postExportsPlaylistHandler.bind(this);
	}

	async postExportsPlaylistHandler(request, h) {
		this._validator.validateExportsPayload(request.payload);

		const { id: ownerId } = request.auth.credentials;
		const { playlistId } = request.params;
		const { targetEmail } = request.payload;

		await this._playlistService.verifyPlaylistOwner(playlistId, ownerId);

		const message = JSON.stringify({ playlistId, targetEmail });

		await this._producerService.sentMessage("export:playlist", message);

		const response = h.response({
			status: "success",
			message: "Permintaan Anda sedang kami proses",
		});

		response.code(201);
		return response;
	}
}

module.exports = ExportsHandler;
