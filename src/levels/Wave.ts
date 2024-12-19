import { Sprite } from "../sprites/Sprite";
import { Enemy1 } from "../sprites/Enemy1";

export class Wave {
    
    private enemies: Array<Sprite> = [];
    private completed: boolean = false;
    private startDelay: number = 1000;
    private startCount: number = 0;

    constructor() {
        this.setupEnemies();
    }

    public render(): void {
        let self = this;

        if (self.startCount <= self.startDelay) {
            this.renderStartImage();
            self.startCount++;
        }
        else {
            self.enemies.forEach((enemy: Sprite) => {
                enemy.render();
            });
        }
    }

    private renderStartImage(): void {

    }

    private setupEnemies(): void {
        //this.enemies.push(new Enemy1())
    }

    public isCompleted(): boolean {
        return this.completed;
    }
}