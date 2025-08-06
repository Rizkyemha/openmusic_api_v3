const InvariantError = require("../../utils/exceptions/InvariantError");
const NotFoundError = require("../../utils/exceptions/NotFoundError");
class AuthenticationsService {
	constructor(pool) {
		this._pool = pool;
	}

	async addRefreshToken(token) {
		const query = {
			text: "INSERT INTO authentications(refresh_token) VALUES($1)",
			values: [token],
		};

		await this._pool.query(query);
	}

	async verifyRefreshToken(token) {
		const query = {
			text: "SELECT * FROM authentications WHERE refresh_token = $1",
			values: [token],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new InvariantError("Refresh token tidak valid");
		}
	}

	async deleteRefreshToken(token) {
		const query = {
			text: "DELETE FROM authentications WHERE refresh_token = $1",
			values: [token],
		};

		const result = await this._pool.query(query);

		if (!result.rowCount) {
			throw new NotFoundError(
				"Gagal menghapus refresh token. Token tidak ditemukan."
			);
		}
	}
}

module.exports = AuthenticationsService;
