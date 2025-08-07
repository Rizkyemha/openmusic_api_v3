require("dotenv").config();
const path = require("path");
const Hapi = require("@hapi/hapi");
const pool = require("./utils/database");
const Jwt = require("@hapi/jwt");
const Inert = require("@hapi/inert");

const albums = require("./api/albums");
const AlbumsService = require("./services/postgres/albumsService");
const validatorAlbums = require("./validator/albums");
const StorageService = require("./services/storage/storageService");

const songs = require("./api/songs");
const SongsService = require("./services/postgres/songsService");
const validatorSongs = require("./validator/songs");

const users = require("./api/users");
const UsersService = require("./services/postgres/usersServices");
const validatorUsers = require("./validator/users");

const authentications = require("./api/authentications");
const AuthenticationsService = require("./services/postgres/authenticationsService");
const tokenManager = require("./tokenize/tokenManager");
const validatorAuthentications = require("./validator/authentications");

const playlist = require("./api/playlist");
const PlaylistService = require("./services/postgres/playlistService");
const validatorPlaylist = require("./validator/playlist");

const collaborations = require("./api/collaborations");
const CollaborationsService = require("./services/postgres/collaborationsService");
const validatorCollaborations = require("./validator/collaborations");

const _exports = require("./api/exports");
const ProducerService = require("./services/amqplib/ProducerService");
const validatorExports = require("./validator/exports");

const CacheService = require("./services/redis/CacheService");

const init = async () => {
	const albumsFolder = path.resolve(__dirname, "api/albums/images/covers");
	const cacheService = new CacheService();
	const albumsService = new AlbumsService(pool, cacheService);
	const storageService = new StorageService(albumsFolder);
	const songsService = new SongsService(pool);
	const usersService = new UsersService(pool);
	const authenticationsService = new AuthenticationsService(pool);
	const collaborationsService = new CollaborationsService(pool);
	const playlistService = new PlaylistService(pool, collaborationsService);
	const producerService = ProducerService;

	const server = Hapi.server({
		port: process.env.PORT,
		host: process.env.HOST,
		routes: {
			cors: {
				origin: ["*"],
			},
		},
	});

	await server.register([
		{
			plugin: Jwt,
		},
		{
			plugin: Inert,
		},
	]);

	server.auth.strategy("openmusic_jwt", "jwt", {
		keys: process.env.ACCESS_TOKEN_KEY,
		verify: {
			aud: false,
			iss: false,
			sub: false,
			maxAgeSec: process.env.ACCESS_TOKEN_AGE,
		},
		validate: (artifacts) => ({
			isValid: true,
			credentials: {
				id: artifacts.decoded.payload.id,
			},
		}),
	});

	await server.register([
		{
			plugin: albums,
			options: {
				service: albumsService,
				storage: storageService,
				validator: validatorAlbums,
			},
		},
		{
			plugin: songs,
			options: {
				service: songsService,
				validator: validatorSongs,
			},
		},
		{
			plugin: users,
			options: {
				service: usersService,
				validator: validatorUsers,
			},
		},
		{
			plugin: authentications,
			options: {
				authenticationsService,
				usersService,
				tokenManager,
				validator: validatorAuthentications,
			},
		},
		{
			plugin: playlist,
			options: {
				playlistService,
				songsService,
				validator: validatorPlaylist,
			},
		},
		{
			plugin: collaborations,
			options: {
				collaborationsService,
				playlistService,
				usersService,
				validator: validatorCollaborations,
			},
		},
		{
			plugin: _exports,
			options: {
				playlistService,
				producerService,
				validator: validatorExports,
			},
		},
	]);

	server.ext("onPreResponse", (request, h) => {
		const { response } = request;

		if (response instanceof Error) {
			if (!response.isServer) {
				const newError = h.response({
					status: "fail",
					message: response.output.payload.message,
				});
				newError.code(response.output.statusCode);
				return newError;
			} else {
				const newError = h.response({
					status: "fail",
					message: response.message,
				});
				newError.code(response.statusCode);
				return newError;
			}
		}
		return h.continue;
	});

	await server.start();
	console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
