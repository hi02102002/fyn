import type { Server as HTTPServer } from "node:http";
import { type DefaultEventsMap, Server } from "socket.io";

// biome-ignore lint/suspicious/noExplicitAny: <!-- Ignore -->
let _io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

export const initSocketInstance = (http: HTTPServer) => {
	if (_io) {
		console.log("Socket.io instance already initialized");
		return _io;
	}

	console.log("Initializing Socket.io instance");
	_io = new Server(http);

	return _io;
};

export const getSocketInstance = () => {
	if (!_io) {
		throw new Error("Socket.io instance not initialized");
	}

	return _io;
};
