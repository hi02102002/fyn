import type { StateStore, Vars } from "../types";

export abstract class AbstractStateStore implements StateStore {
	abstract get(sessionId: string): Promise<Vars>;
	abstract set(sessionId: string, vars: Vars): Promise<void>;
	async patch(sessionId: string, patch: Vars): Promise<void> {
		const current = await this.get(sessionId);
		await this.set(sessionId, { ...current, ...patch });
	}
}
