exports.up = (pgm) => {
	pgm.createTable("playlist_songs", {
		id: {
			type: "VARCHAR(50)",
			primaryKey: true,
		},
		playlist_id: {
			type: "VARCHAR(50)",
			notNull: true,
			references: "playlist(id)",
			referencesConstraintName: "fk_playlist_songs.playlist_id_playlist.id",
			onDelete: "CASCADE",
		},
		song_id: {
			type: "VARCHAR(50)",
			notNull: true,
			references: "songs(id)",
			referencesConstraintName: "fk_playlist_songs.song_id_songs.id",
			onDelete: "CASCADE",
		},
	});
};

exports.down = (pgm) => {
	pgm.dropTable("playlist_songs");
};
