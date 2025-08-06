class UsersHandler {
	constructor(service, validator) {
		this._service = service;
		this._validator = validator;

		this.postUserHandler = this.postUserHandler.bind(this);
		this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
	}

	async postUserHandler(request, h) {
		this._validator.validateUsersPayload(request.payload);

		const id = await this._service.addUser(request.payload);

		const response = h.response({
			status: "success",
			data: {
				userId: id,
			},
		});

		response.code(201);
		return response;
	}

	async getUserByIdHandler(request, h) {
		const { id } = request.params;
		const user = await this._service.getUserById(id);

		return {
			status: "success",
			data: {
				user,
			},
		};
	}
}

module.exports = UsersHandler;
