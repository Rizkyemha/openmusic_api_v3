exports.up = (pgm) => {
	pgm.createTable("collaborations", {
		id: {
			type: "VARCHAR(50)",
			primaryKey: true,
		},
		playlist_id: {
			type: "VARCHAR(50)",
			notNull: true,
			references: "playlist(id)",
			referencesConstraintName: "fk_collaborations.playlist_id_playlist.id",
			onDelete: "CASCADE",
		},
		user_id: {
			type: "VARCHAR(50)",
			notNull: true,
			references: "users(id)",
			referencesConstraintName: "fk_collaborations.user_id_users.id",
			onDelete: "CASCADE",
		},
	});
};

exports.down = (pgm) => {
	pgm.dropTable("collaborations");
};
