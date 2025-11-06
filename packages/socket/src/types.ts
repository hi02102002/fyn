export type TIo = import("socket.io").Server<
	import("socket.io").DefaultEventsMap,
	import("socket.io").DefaultEventsMap,
	import("socket.io").DefaultEventsMap,
	// biome-ignore lint/suspicious/noExplicitAny: <!-- Ignore -->
	any
>;
