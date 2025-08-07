const { createAlbumId } = require("../../utils/nanoId");
const { mapDBAlbumsToModel } = require("../../utils");
const { createUserAlbumLikesId } = require("../../utils/nanoId");
const NotFoundError = require("../../utils/exceptions/NotFoundError");
const InvariantError = require("../../utils/exceptions/InvariantError");

class AlbumsService {
	constructor(pool, cacheService) {
		this._pool = pool;
		this._cacheService = cacheService;
	}

	async addAlbum({ name, year }) {
		const id = createAlbumId();
		const query = {
			text: "INSERT INTO albums (id, name, year) VALUES ($1, $2, $3) RETURNING id",
			values: [id, name, year],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new InvariantError("Album gagal ditambahkan");
		}

		return result.rows[0].id;
	}

	async getAlbumById(id) {
		const query = {
			text: `
				SELECT
					a.id,
					a.name,
					a.year,
					a.cover_url,
				COALESCE(
						JSON_AGG(
								JSON_BUILD_OBJECT('id', songs.id, 'title', songs.title, 'performer', songs.performer)
						) FILTER (WHERE songs.id IS NOT NULL),
						'[]'::json
				) AS songs
				FROM
						albums AS a
				LEFT JOIN
						songs ON songs.album_id = a.id
				WHERE
						a.id = $1
				GROUP BY
						a.id;
			`,
			values: [id],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new NotFoundError("Album tidak ditemukan");
		}

		return result.rows.map(mapDBAlbumsToModel)[0];
	}

	async editAlbumById(id, { name, year }) {
		const query = {
			text: "UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id",
			values: [name, year, id],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new NotFoundError("Gagal memperbarui album. Id tidak ditemukan");
		}
	}

	async deleteAlbumById(id) {
		const query = {
			text: "DELETE FROM albums WHERE id = $1 RETURNING id",
			values: [id],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new NotFoundError("Album gagal dihapus. Id tidak ditemukan");
		}
	}

	async addCoverAlbum(albumId, coverUrl) {
		const query = {
			text: "UPDATE albums SET cover_url = $1 WHERE id = $2 RETURNING id",
			values: [coverUrl, albumId],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new NotFoundError("Cover gagal ditambahkan");
		}
	}

	async verifyAlbumExists(albumId) {
		const query = {
			text: "SELECT id FROM albums WHERE id = $1",
			values: [albumId],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new NotFoundError("Album tidak ditemukan");
		}
	}

	async verifyLikeAlbumUserExists(albumId, userId) {
		const query = {
			text: "SELECT * FROM user_album_likes WHERE album_id = $1 AND user_id = $2",
			values: [albumId, userId],
		};

		const result = await this._pool.query(query);

		if (result.rows.length) {
			throw new InvariantError("Like sudah terdaftar");
		}
	}

	async likeAlbum(albumId, userId) {
		const id = createAlbumId();
		const query = {
			text: "INSERT INTO user_album_likes (id, user_id, album_id) VALUES ($1, $2, $3) RETURNING id",
			values: [id, userId, albumId],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new InvariantError("Like gagal ditambahkan");
		}

		await this._cacheService.delete(`likesAlbum:${albumId}`);
	}

	async unlikeAlbum(albumId, userId) {
		const query = {
			text: "DELETE FROM user_album_likes WHERE album_id = $1 AND user_id = $2 RETURNING id",
			values: [albumId, userId],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new NotFoundError("Like gagal dihapus. Id tidak ditemukan");
		}

		await this._cacheService.delete(`likesAlbum:${albumId}`);
	}

	async getLikesAlbum(albumId) {
		let isCache = false;
		try {
			const result = await this._cacheService.get(`likesAlbum:${albumId}`);

			isCache = true;

			return { _likes: JSON.parse(result), isCache };
		} catch (error) {
			const query = {
				text: "SELECT COUNT(*) AS likes FROM user_album_likes WHERE album_id = $1",
				values: [albumId],
			};

			const result = await this._pool.query(query);
			const parseIntResult = parseInt(result.rows[0].likes);

			await this._cacheService.set(
				`likesAlbum:${albumId}`,
				JSON.stringify(parseIntResult)
			);

			return { _likes: parseIntResult, isCache };
		}
	}
}

module.exports = AlbumsService;
