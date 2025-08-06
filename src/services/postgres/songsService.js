const { createSongId } = require("../../utils/nanoId");
const { mapDBSongToModel } = require("../../utils/index");
const NotFoundError = require("../../utils/exceptions/NotFoundError");
const InvariantError = require("../../utils/exceptions/InvariantError");
class SongsService {
	constructor(pool) {
		this._pool = pool;
	}

	async addSong({ title, year, genre, performer, duration, albumId }) {
		const id = createSongId();

		const query = {
			text: "INSERT INTO songs (id, title, year, genre, performer, duration, album_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
			values: [id, title, year, genre, performer, duration, albumId],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new InvariantError("Lagu gagal ditambahkan");
		}

		return result.rows[0].id;
	}

	async getSongs({ title, performer }) {
		let baseQuery = "SELECT id, title, performer FROM songs";

		const condition = [];
		const values = [];

		if (title) {
			condition.push(`title ILIKE $${condition.length + 1}`);
			values.push(`%${title}%`);
		}

		if (performer) {
			condition.push(`performer ILIKE $${condition.length + 1}`);
			values.push(`%${performer}%`);
		}

		if (condition.length > 0) {
			baseQuery += ` WHERE ${condition.join(" AND ")}`;
		}

		const query = {
			text: baseQuery,
			values: values,
		};

		const result = await this._pool.query(query);
		return result.rows;
	}

	async getSongById(id) {
		const query = {
			text: "SELECT id, title, year, performer, genre, duration, album_id FROM songs WHERE id = $1",
			values: [id],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new NotFoundError("Lagu tidak ditemukan");
		}

		return result.rows.map(mapDBSongToModel)[0];
	}

	async editSongById(
		id,
		{ title, year, genre, performer, duration, albumId }
	) {
		const query = {
			text: "UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id",
			values: [title, year, genre, performer, duration, albumId, id],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new NotFoundError("Gagal memperbarui song. Id tidak ditemukan");
		}
	}

	async deleteSongById(id) {
		const query = {
			text: "DELETE FROM songs WHERE id = $1 RETURNING id",
			values: [id],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new NotFoundError("Song gagal dihapus. Id tidak ditemukan");
		}
	}
}

module.exports = SongsService;
