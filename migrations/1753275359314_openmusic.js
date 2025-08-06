exports.up = (pgm) => {
	pgm.createTable("albums", {
		id: {
			type: "VARCHAR(50)",
			primaryKey: true,
		},
		name: {
			type: "VARCHAR(150)",
			notNull: true,
		},
		year: {
			type: "INTEGER",
			notNull: true,
		},
	});

	pgm.createTable("songs", {
		id: {
			type: "VARCHAR(50)",
			primaryKey: true,
		},
		title: {
			type: "VARCHAR(150)",
			notNull: true,
		},
		year: {
			type: "INTEGER",
			notNull: true,
		},
		performer: {
			type: "VARCHAR(50)",
			notNull: true,
		},
		genre: {
			type: "VARCHAR(50)",
			notNull: true,
		},
		duration: {
			type: "INTEGER",
		},
		album_id: {
			type: "VARCHAR(50)",
			references: "albums(id)",
			onDelete: "SET NULL",
		},
	});
};

exports.down = (pgm) => {};
