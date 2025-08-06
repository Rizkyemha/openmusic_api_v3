exports.up = (pgm) => {
	pgm.createTable("playlist", {
		id: {
			type: "VARCHAR(50)",
			primaryKey: true,
		},
		name: {
			type: "VARCHAR(50)",
			notNull: true,
		},
		owner: {
			type: "VARCHAR(50)",
			notNull: true,
			references: "users(id)",
			referencesConstraintName: "fk_playlist.owner_users.id",
			onDelete: "CASCADE",
		},
	});
};

exports.down = (pgm) => {
	pgm.dropTable("playlist");
};
