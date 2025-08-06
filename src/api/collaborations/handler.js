class CollaborationsHandler {
	constructor(
		collaborationsService,
		playlistService,
		usersService,
		validator
	) {
		this._collaborationsService = collaborationsService;
		this._playlistService = playlistService;
		this._usersService = usersService;
		this._validator = validator;

		this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
		this.deleteCollaborationHandler =
			this.deleteCollaborationHandler.bind(this);
	}

	async postCollaborationHandler(request, h) {
		this._validator.validateCollaborationsPayload(request.payload);

		const { id: ownerId } = request.auth.credentials;
		const { playlistId, userId } = request.payload;

		await this._usersService.getUserById(userId);
		await this._playlistService.verifyPlaylistOwner(playlistId, ownerId);
		await this._collaborationsService.verifyCollaboratorExists(
			playlistId,
			userId
		);

		const collaborationId = await this._collaborationsService.addCollaborator(
			playlistId,
			userId
		);

		const response = h.response({
			status: "success",
			data: {
				collaborationId,
			},
		});
		response.code(201);
		return response;
	}

	async deleteCollaborationHandler(request) {
		this._validator.validateCollaborationsPayload(request.payload);

		const { id: ownerId } = request.auth.credentials;
		const { playlistId, userId } = request.payload;

		await this._playlistService.verifyPlaylistOwner(playlistId, ownerId);
		await this._collaborationsService.deleteCollaborator(playlistId, userId);

		return {
			status: "success",
			message: "Kolaborasi berhasil dihapus.",
		};
	}
}

module.exports = CollaborationsHandler;
