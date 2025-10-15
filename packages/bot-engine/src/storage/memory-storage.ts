import type { Vars } from "../types";
import { AbstractStateStore } from "./state-storage";

export class MemoryStateStore extends AbstractStateStore {
	constructor(private map = new Map<string, Vars>()) {
		super();
	}
	async get(sessionId: string): Promise<Vars> {
		return this.map.get(sessionId) ?? {};
	}
	async set(sessionId: string, vars: Vars): Promise<void> {
		this.map.set(sessionId, vars);
	}
}
