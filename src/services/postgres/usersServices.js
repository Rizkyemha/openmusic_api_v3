const { createUserId } = require("../../utils/nanoId");
const { hashPassword } = require("../../utils/bcrypt");
const { matchPassword } = require("../../utils/bcrypt");
const InvariantError = require("../../utils/exceptions/InvariantError");
const NotFoundError = require("../../utils/exceptions/NotFoundError");
const AuthenticationError = require("../../utils/exceptions/AuthenticationError");

class UsersService {
	constructor(pool) {
		this._pool = pool;

		this.verifyUserCredentials = this.verifyUserCredentials.bind(this);
	}

	async addUser({ username, password, fullname }) {
		await this.verifyUsername(username);

		const id = createUserId();
		const hashedPassword = await hashPassword(password);

		const query = {
			text: "INSERT INTO users(id, username, password, fullname) VALUES($1, $2, $3, $4) RETURNING id",
			values: [id, username, hashedPassword, fullname],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new InvariantError("User gagal ditambahkan.");
		}

		return result.rows[0].id;
	}

	async verifyUsername(username) {
		const query = {
			text: "SELECT username FROM users WHERE username = $1",
			values: [username],
		};

		const result = await this._pool.query(query);

		if (result.rows.length > 0) {
			throw new InvariantError(
				`Gagal menambahkan user. ${username} sudah digunakan.`
			);
		}
	}

	async getUserById(userId) {
		const query = {
			text: "SELECT id, username, fullname FROM users WHERE id = $1",
			values: [userId],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new NotFoundError("User tidak ditemukan.");
		}

		return result.rows[0];
	}

	async verifyUserCredentials(username, password) {
		const query = {
			text: "SELECT id, password FROM users WHERE username = $1",
			values: [username],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new AuthenticationError("Kredensial yang Anda berikan salah.");
		}

		const { id, password: hashedPassword } = result.rows[0];
		const isPasswordMatch = await matchPassword(password, hashedPassword);

		if (!isPasswordMatch) {
			throw new AuthenticationError("Kredensial yang Anda berikan salah.");
		}

		return id;
	}
}

module.exports = UsersService;
