const { nanoid } = require("nanoid");

const createSongId = () => {
	const id = nanoid(16);
	return `song-${id}`;
};
const createAlbumId = () => {
	const id = nanoid(16);
	return `album-${id}`;
};
const createUserId = () => {
	const id = nanoid(16);
	return `user-${id}`;
};
const createPlaylistId = () => {
	const id = nanoid(16);
	return `playlist-${id}`;
};

const createPlaylistSongsId = () => {
	const id = nanoid(16);
	return `playlist-songs-${id}`;
};

const createCollaborationId = () => {
	const id = nanoid(16);
	return `collaboration-${id}`;
};

const createPlaylistActionId = () => {
	const id = nanoid(16);
	return `playlist-action-${id}`;
};

module.exports = {
	createSongId,
	createAlbumId,
	createUserId,
	createPlaylistId,
	createPlaylistSongsId,
	createCollaborationId,
	createPlaylistActionId,
};
