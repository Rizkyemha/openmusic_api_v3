exports.up = (pgm) => {
	pgm.createType("action_enum", ["add", "delete"]);

	pgm.createTable("playlist_activities", {
		id: {
			type: "VARCHAR(50)",
			primaryKey: true,
		},
		action: {
			type: "action_enum",
			notNull: true,
		},
		playlist_id: {
			type: "VARCHAR(50)",
			notNull: true,
			references: "playlist(id)",
			referencesConstraintName:
				"fk_playlist_activities.playlist_id_playlist.id",
			onDelete: "CASCADE",
		},
		user_id: {
			type: "VARCHAR(50)",
			notNull: true,
			references: "users(id)",
			referencesConstraintName: "fk_playlist_activities.user_id_users.id",
			onDelete: "CASCADE",
		},
		song_id: {
			type: "VARCHAR(50)",
			notNull: true,
			references: "songs(id)",
			referencesConstraintName: "fk_playlist_activities.song_id_songs.id",
			onDelete: "CASCADE",
		},
		time: {
			type: "TIMESTAMP",
			notNull: true,
		},
	});
};

exports.down = (pgm) => {
	pgm.dropTable("playlist_activities");
	pgm.dropType("action_enum");
};
