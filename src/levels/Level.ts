import { PlayerSpaceShip } from "../sprites/PlayerSpaceShip";

export type CollisionSummary = {
	enemiesDestroyed: number;
	enemyScoreGained: number;
	asteroidHits: number;
	asteroidsDestroyed: number;
	playerHit: boolean;
};

export class Level {
	protected started: boolean;
	protected completed: boolean;

	constructor() {
		this.started = false;
		this.completed = false;
	}

	public start(): void {
		this.started = true;
	}

	public isStarted(): boolean {
		return this.started;
	}

	public isCompleted(): boolean {
		return this.completed;
	}

	public render(_player: PlayerSpaceShip): void {
		// Base level has no visual behavior.
	}

	public detectCollisions(_player: PlayerSpaceShip): CollisionSummary {
		// Base level has no collision behavior.
		return {
			enemiesDestroyed: 0,
			enemyScoreGained: 0,
			asteroidHits: 0,
			asteroidsDestroyed: 0,
			playerHit: false
		};
	}
}