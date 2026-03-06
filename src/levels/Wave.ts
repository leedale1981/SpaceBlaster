import { Sprite } from "../sprites/Sprite";
import { Enemy1 } from "../sprites/Enemy1";
import { Enemy2 } from "../sprites/Enemy2";
import { EnemyBullet } from "../sprites/EnemyBullet";
import { PlayerSpaceShip } from "../sprites/PlayerSpaceShip";
import { Bullet } from "../sprites/Bullet";
import { CollisionSummary } from "./Level";
import { Asteroid } from "../sprites/Asteroid";

export type WaveConfig = {
    columns: number;
    rows: number;
    startY: number;
    startDelay: number;
    levelNumber?: number;
    waveNumber?: number;
    columnSpacing?: number;
    rowSpacing?: number;
    horizontalStep?: number;
    verticalStep?: number;
    shootCooldown?: number;
    enemyBulletSpeed?: number;
};

type EnemyBehavior = {
    isChaser: boolean;
    laneOffset: number;
    swayPhase: number;
    randomCenterX: number;
    randomDriftX: number;
    randomDriftY: number;
    swayAmplitude: number;
    swayFrequency: number;
};

type EnemyShip = Enemy1 | Enemy2;

type BulletImpactExplosion = {
    x: number;
    y: number;
    framesRemaining: number;
};

export class Wave {
    private readonly ctx: CanvasRenderingContext2D;
    private enemies: Array<EnemyShip>;
    private enemyBullets: Array<EnemyBullet>;
    private completed: boolean;
    private readonly startDelay: number;
    private readonly levelNumber: number;
    private readonly waveNumber: number;
    private startCount: number;
    private readonly columns: number;
    private readonly rows: number;
    private readonly startY: number;
    private readonly columnSpacing: number;
    private readonly rowSpacing: number;
    private readonly horizontalStep: number;
    private readonly verticalStep: number;
    private readonly shootCooldown: number;
    private readonly enemyBulletSpeed: number;
    private shootTick: number;
    private enemyBehaviors: Map<EnemyShip, EnemyBehavior>;
    private enemyHitPoints: Map<EnemyShip, number>;
    private enemyScoreValues: Map<EnemyShip, number>;
    private bulletImpactExplosions: Array<BulletImpactExplosion>;
    private asteroids: Array<Asteroid>;
    private asteroidSpawnSchedule: Array<number>;
    private waveFrameCount: number;

    constructor(ctx: CanvasRenderingContext2D, config: WaveConfig) {
        this.ctx = ctx;
        this.enemies = [];
        this.enemyBullets = [];
        this.completed = false;
        this.startDelay = config.startDelay;
        this.levelNumber = config.levelNumber ?? 1;
        this.waveNumber = config.waveNumber ?? 1;
        this.startCount = 0;
        this.columns = config.columns;
        this.rows = config.rows;
        this.startY = config.startY;
        this.columnSpacing = config.columnSpacing ?? 100;
        this.rowSpacing = config.rowSpacing ?? 70;
        this.horizontalStep = config.horizontalStep ?? 1.5;
        this.verticalStep = config.verticalStep ?? 0.5;
        this.shootCooldown = config.shootCooldown ?? 45;
        this.enemyBulletSpeed = config.enemyBulletSpeed ?? 3;
        this.shootTick = 0;
        this.enemyBehaviors = new Map<EnemyShip, EnemyBehavior>();
        this.enemyHitPoints = new Map<EnemyShip, number>();
        this.enemyScoreValues = new Map<EnemyShip, number>();
        this.bulletImpactExplosions = [];
        this.asteroids = [];
        this.asteroidSpawnSchedule = [];
        this.waveFrameCount = 0;
    }

    public render(player: PlayerSpaceShip): void {
        if (this.completed) {
            return;
        }

        if (this.startCount <= this.startDelay) {
            this.renderStartImage();
            this.startCount++;
            return;
        }

        this.waveFrameCount++;

        if (this.enemies.length === 0) {
            this.setupEnemies();
            this.setupAsteroidSchedule();
        }

        this.moveEnemies(player);
        this.enemies.forEach((enemy: EnemyShip) => {
            enemy.render();
        });

        this.spawnAsteroidsIfScheduled();
        this.moveAndRenderAsteroids();

        this.fireEnemyBullets();
        this.moveEnemyBullets();
        this.renderBulletImpactExplosions();
        this.detectCompletion();
    }

    public detectCollisions(player: PlayerSpaceShip): CollisionSummary {
        if (this.completed) {
            return {
                enemiesDestroyed: 0,
                enemyScoreGained: 0,
                asteroidHits: 0,
                asteroidsDestroyed: 0,
                playerHit: false
            };
        }

        const bulletsToRemove: Array<Bullet> = [];
        const enemiesToRemove: Array<EnemyShip> = [];
        const enemyHitCounts = new Map<EnemyShip, number>();
        const enemyBulletsToRemove: Array<EnemyBullet> = [];
        const asteroidsToDamage: Array<Asteroid> = [];
        const asteroidImpactInertia = new Map<Asteroid, number>();
        let playerHit = false;
        let asteroidHits = 0;
        let asteroidsDestroyed = 0;
        let enemyScoreGained = 0;

        player.getBullets().forEach((bullet: Bullet) => {
            let bulletConsumed = false;

            this.enemies.some((enemy: EnemyShip) => {
                if (this.isCollision(bullet, enemy)) {
                    bulletsToRemove.push(bullet);
                    const hits = enemyHitCounts.get(enemy) ?? 0;
                    enemyHitCounts.set(enemy, hits + 1);
                    bulletConsumed = true;
                    return true;
                }

                return false;
            });

            if (bulletConsumed) {
                return;
            }

            this.asteroids.some((asteroid: Asteroid) => {
                if (this.isCollision(bullet, asteroid)) {
                    bulletsToRemove.push(bullet);
                    asteroidsToDamage.push(asteroid);

                    const existingImpact = asteroidImpactInertia.get(asteroid) ?? 0;
                    asteroidImpactInertia.set(asteroid, Math.max(existingImpact, bullet.getInertia()));

                    this.createBulletImpactExplosion(bullet, asteroid);
                    return true;
                }

                return false;
            });
        });

        if (bulletsToRemove.length > 0) {
            const uniqueBullets = Array.from(new Set(bulletsToRemove));
            uniqueBullets.forEach((bullet: Bullet) => {
                player.removeBulletByReference(bullet);
            });
        }

        if (enemyHitCounts.size > 0) {
            enemyHitCounts.forEach((hitCount: number, enemy: EnemyShip) => {
                const currentHealth = this.enemyHitPoints.get(enemy) ?? 1;
                const nextHealth = currentHealth - hitCount;

                if (nextHealth <= 0) {
                    enemiesToRemove.push(enemy);
                } else {
                    this.enemyHitPoints.set(enemy, nextHealth);
                }
            });

            if (enemiesToRemove.length > 0) {
                const uniqueEnemies = Array.from(new Set(enemiesToRemove));
                uniqueEnemies.forEach((enemy: EnemyShip) => {
                    enemyScoreGained = enemyScoreGained + (this.enemyScoreValues.get(enemy) ?? 100);
                    this.enemyBehaviors.delete(enemy);
                    this.enemyHitPoints.delete(enemy);
                    this.enemyScoreValues.delete(enemy);
                });

                this.enemies = this.enemies.filter((enemy: EnemyShip) => {
                    return !uniqueEnemies.includes(enemy);
                });
            }
        }

        if (asteroidsToDamage.length > 0) {
            const uniqueAsteroids = Array.from(new Set(asteroidsToDamage));
            asteroidHits = uniqueAsteroids.length;
            uniqueAsteroids.forEach((asteroid: Asteroid) => {
                const impactInertia = asteroidImpactInertia.get(asteroid) ?? 1;
                asteroid.applyBulletImpact(impactInertia);
            });

            asteroidsDestroyed = uniqueAsteroids.filter((asteroid: Asteroid) => asteroid.isDestroyed()).length;

            this.asteroids = this.asteroids.filter((asteroid: Asteroid) => {
                return !asteroid.isDestroyed();
            });
        }

        // Allow the player to block enemy fire with bullets.
        const activePlayerBullets = player.getBullets().filter((playerBullet: Bullet) => {
            return !bulletsToRemove.includes(playerBullet);
        });

        activePlayerBullets.forEach((playerBullet: Bullet) => {
            this.enemyBullets.forEach((enemyBullet: EnemyBullet) => {
                if (this.isCollision(playerBullet, enemyBullet)) {
                    bulletsToRemove.push(playerBullet);
                    enemyBulletsToRemove.push(enemyBullet);
                    this.createBulletImpactExplosion(playerBullet, enemyBullet);
                }
            });
        });

        if (bulletsToRemove.length > 0) {
            const uniquePlayerBullets = Array.from(new Set(bulletsToRemove));
            uniquePlayerBullets.forEach((bullet: Bullet) => {
                player.removeBulletByReference(bullet);
            });
        }

        if (enemyBulletsToRemove.length > 0) {
            const uniqueEnemyBullets = Array.from(new Set(enemyBulletsToRemove));
            this.enemyBullets = this.enemyBullets.filter((enemyBullet: EnemyBullet) => {
                return !uniqueEnemyBullets.includes(enemyBullet);
            });
        }

        this.enemyBullets.forEach((enemyBullet: EnemyBullet) => {
            if (this.isCollision(enemyBullet, player)) {
                enemyBulletsToRemove.push(enemyBullet);
                if (!player.isInvulnerable()) {
                    playerHit = true;
                }
            }
        });

        this.enemies.forEach((enemy: EnemyShip) => {
            if (this.isCollision(enemy, player) && !player.isInvulnerable()) {
                playerHit = true;
            }
        });

        this.asteroids.forEach((asteroid: Asteroid) => {
            if (this.isCollision(asteroid, player) && !player.isInvulnerable()) {
                playerHit = true;
            }
        });

        if (enemyBulletsToRemove.length > 0) {
            const uniqueEnemyBullets = Array.from(new Set(enemyBulletsToRemove));
            this.enemyBullets = this.enemyBullets.filter((enemyBullet: EnemyBullet) => {
                return !uniqueEnemyBullets.includes(enemyBullet);
            });
        }

        return {
            enemiesDestroyed: Array.from(new Set(enemiesToRemove)).length,
            enemyScoreGained: enemyScoreGained,
            asteroidHits: asteroidHits,
            asteroidsDestroyed: asteroidsDestroyed,
            playerHit: playerHit
        };
    }

    private createBulletImpactExplosion(playerBullet: Bullet, targetSprite: Sprite): void {
        const impactX = (playerBullet.getXCoord() + targetSprite.getXCoord()) / 2;
        const impactY = (playerBullet.getYCoord() + targetSprite.getYCoord()) / 2;

        this.bulletImpactExplosions.push({
            x: impactX,
            y: impactY,
            framesRemaining: 10
        });
    }

    private createAsteroidAtTop(): void {
        const radius = 28 + (Math.random() * 18);
        const x = Math.random() * Math.max(1, this.ctx.canvas.width - (radius * 2));
        const y = -radius - 6;
        const speed = 0.9 + (Math.random() * 0.8);
        this.asteroids.push(new Asteroid(this.ctx, x, y, radius, speed));
    }

    private setupAsteroidSchedule(): void {
        if (this.asteroidSpawnSchedule.length > 0) {
            return;
        }

        const asteroidCount = 2 + Math.floor(Math.random() * 2);
        for (let index = 0; index < asteroidCount; index++) {
            const spawnFrame = 120 + (index * 200) + Math.floor(Math.random() * 90);
            this.asteroidSpawnSchedule.push(spawnFrame);
        }
    }

    private spawnAsteroidsIfScheduled(): void {
        if (this.asteroidSpawnSchedule.length === 0) {
            return;
        }

        const dueSpawns = this.asteroidSpawnSchedule.filter((spawnFrame: number) => {
            return spawnFrame <= this.waveFrameCount;
        });

        if (dueSpawns.length > 0) {
            dueSpawns.forEach(() => {
                this.createAsteroidAtTop();
            });

            this.asteroidSpawnSchedule = this.asteroidSpawnSchedule.filter((spawnFrame: number) => {
                return spawnFrame > this.waveFrameCount;
            });
        }
    }

    private moveAndRenderAsteroids(): void {
        this.asteroids.forEach((asteroid: Asteroid) => {
            asteroid.move();
            asteroid.render();
        });

        this.asteroids = this.asteroids.filter((asteroid: Asteroid) => {
            return !asteroid.isOffScreen() && !asteroid.isDestroyed();
        });
    }

    private renderBulletImpactExplosions(): void {
        this.bulletImpactExplosions.forEach((impact: BulletImpactExplosion) => {
            const growth = 10 - impact.framesRemaining;
            const radius = 3 + (growth * 1.2);
            const alpha = Math.max(0, impact.framesRemaining / 10);

            this.ctx.beginPath();
            this.ctx.fillStyle = `rgba(255, 220, 90, ${alpha})`;
            this.ctx.arc(impact.x, impact.y, radius, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.beginPath();
            this.ctx.fillStyle = `rgba(255, 120, 60, ${alpha * 0.8})`;
            this.ctx.arc(impact.x, impact.y, radius * 0.55, 0, Math.PI * 2);
            this.ctx.fill();

            impact.framesRemaining--;
        });

        this.bulletImpactExplosions = this.bulletImpactExplosions.filter((impact: BulletImpactExplosion) => {
            return impact.framesRemaining > 0;
        });
    }

    private renderStartImage(): void {
        this.ctx.fillStyle = "white";
        this.ctx.font = "bold 28px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText(`LEVEL ${this.levelNumber}  WAVE ${this.waveNumber}`, this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
    }

    private setupEnemies(): void {
        const formationWidth = (this.columns - 1) * this.columnSpacing;
        const startX = (this.ctx.canvas.width / 2) - (formationWidth / 2);
        const midColumn = (this.columns - 1) / 2;
        const spawnedEnemies: Array<EnemyShip> = [];
        const spawnStagger = 45;

        for (let row = 0; row < this.rows; row++) {
            for (let column = 0; column < this.columns; column++) {
                const enemyX = startX + (column * this.columnSpacing);
                const spawnOrder = (row * this.columns) + column;
                const enemyY = this.startY - (spawnOrder * spawnStagger) - (row * this.rowSpacing);
                const useLargeEnemy = this.waveNumber > 2 && column === this.columns - 1;
                const enemy: EnemyShip = useLargeEnemy
                    ? new Enemy2(this.ctx, enemyX, enemyY)
                    : new Enemy1(this.ctx, enemyX, enemyY);

                this.enemies.push(enemy);
                spawnedEnemies.push(enemy);

                this.enemyHitPoints.set(enemy, useLargeEnemy ? 2 : 1);
                this.enemyScoreValues.set(enemy, useLargeEnemy ? 200 : 100);

                const laneOffset = (column - midColumn) * 26;
                const rowVariation = (row % 2 === 0) ? 12 : -12;
                this.enemyBehaviors.set(enemy, {
                    isChaser: false,
                    laneOffset: laneOffset + rowVariation,
                    swayPhase: Math.random() * Math.PI * 2,
                    randomCenterX: enemyX,
                    randomDriftX: (Math.random() * 1.3) + 0.6,
                    randomDriftY: this.verticalStep + (Math.random() * 0.9),
                    swayAmplitude: (Math.random() * 24) + 18,
                    swayFrequency: (Math.random() * 0.035) + 0.03
                });
            }
        }

        // Select only one or two enemies to chase the player in this wave.
        const chaserCount = Math.min(this.enemies.length, 1 + Math.floor(Math.random() * 2));
        for (let pick = 0; pick < chaserCount; pick++) {
            if (spawnedEnemies.length === 0) {
                break;
            }

            const randomIndex = Math.floor(Math.random() * spawnedEnemies.length);
            const selected = spawnedEnemies[randomIndex];
            spawnedEnemies.splice(randomIndex, 1);

            const behavior = this.enemyBehaviors.get(selected);
            if (behavior) {
                behavior.isChaser = true;
            }
        }
    }

    private moveEnemies(player: PlayerSpaceShip): void {
        const playerCenter = player.getXCoord() + (player.getWidth() / 2);

        this.enemies.forEach((enemy: EnemyShip) => {
            const behavior = this.enemyBehaviors.get(enemy);
            if (!behavior) {
                enemy.advanceTowardPlayer(playerCenter, this.horizontalStep, this.verticalStep);
                return;
            }

            if (behavior.isChaser) {
                const chaserSway = Math.sin((enemy.getYCoord() * 0.06) + behavior.swayPhase) * (behavior.swayAmplitude * 0.5);
                const targetX = playerCenter + behavior.laneOffset + chaserSway;
                enemy.advanceTowardPlayer(targetX, this.horizontalStep + 0.2, this.verticalStep + 0.2);
                return;
            }

            // Non-chasers follow randomized lanes and never target the player directly.
            behavior.randomCenterX = behavior.randomCenterX + behavior.randomDriftX;
            const leftBound = enemy.getWidth() / 2;
            const rightBound = this.ctx.canvas.width - (enemy.getWidth() / 2);
            if (behavior.randomCenterX <= leftBound || behavior.randomCenterX >= rightBound) {
                behavior.randomDriftX = behavior.randomDriftX * -1;
                behavior.randomCenterX = Math.max(leftBound, Math.min(behavior.randomCenterX, rightBound));
            }

            const randomSway = Math.sin((enemy.getYCoord() * behavior.swayFrequency) + behavior.swayPhase) * behavior.swayAmplitude;
            const randomTargetX = behavior.randomCenterX + randomSway;
            enemy.advanceTowardPlayer(randomTargetX, this.horizontalStep, behavior.randomDriftY);
        });

        this.enemies = this.enemies.filter((enemy: EnemyShip) => {
            return !enemy.isOffScreen();
        });

        this.enemyBehaviors.forEach((_value, enemy: EnemyShip) => {
            if (!this.enemies.includes(enemy)) {
                this.enemyBehaviors.delete(enemy);
                this.enemyHitPoints.delete(enemy);
                this.enemyScoreValues.delete(enemy);
            }
        });
    }

    private fireEnemyBullets(): void {
        if (this.enemies.length === 0) {
            return;
        }

        this.shootTick++;
        if (this.shootTick < this.shootCooldown) {
            return;
        }

        this.shootTick = 0;
        const randomIndex = Math.floor(Math.random() * this.enemies.length);
        const firingEnemy = this.enemies[randomIndex];
        this.enemyBullets.push(new EnemyBullet(this.ctx, firingEnemy, this.enemyBulletSpeed));
    }

    private moveEnemyBullets(): void {
        this.enemyBullets.forEach((bullet: EnemyBullet) => {
            bullet.move();
            bullet.render();
        });

        this.enemyBullets = this.enemyBullets.filter((bullet: EnemyBullet) => {
            return !bullet.isAtEdge();
        });
    }

    private isCollision(spriteA: Sprite, spriteB: Sprite): boolean {
        const ax1 = spriteA.getXCoord();
        const ay1 = spriteA.getYCoord();
        const ax2 = ax1 + spriteA.getWidth();
        const ay2 = ay1 + spriteA.getHeight();

        const bx1 = spriteB.getXCoord();
        const by1 = spriteB.getYCoord();
        const bx2 = bx1 + spriteB.getWidth();
        const by2 = by1 + spriteB.getHeight();

        return ax1 < bx2 && ax2 > bx1 && ay1 < by2 && ay2 > by1;
    }

    private detectCompletion(): void {
        this.completed = this.enemies.length === 0;
    }

    public isCompleted(): boolean {
        return this.completed;
    }
}