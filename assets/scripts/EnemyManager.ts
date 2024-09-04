import {
  _decorator,
  Component,
  instantiate,
  Node,
  Prefab,
  randomRange,
  Vec3,
} from "cc";
import { GameManager, GameState } from "./GameManager";

const { ccclass, property } = _decorator;

@ccclass("EnemyManager")
export class EnemyManager extends Component {
  @property(GameManager) gameManager: GameManager = null;
  @property(Prefab) enemyPrefab: Prefab = null;
  @property(Number) poolSize: number = 10;
  @property(Number) spawnRangeX: number = 1;
  @property(Number) spawnRangeY: number = 1;
  @property(Number) zOffset: number = 10;
  @property(Number) moveSpeed: number = 20;

  initialPosZ: number = -40;
  spawnDepth: number = 0;

  private enemyPool: Node[] = [];

  protected onLoad(): void {
    this.initializeEnemyPool();
    this.spawnAllEnemies();
  }

  private initializeEnemyPool() {
    for (let i = 0; i < this.poolSize; i++) {
      const enemy = instantiate(this.enemyPrefab);
      enemy.active = true;
      this.node.addChild(enemy);
      this.enemyPool.push(enemy);
    }
  }

  private spawnAllEnemies() {
    let positionZ = this.initialPosZ;
    this.enemyPool.forEach((enemy) => {
      const spawnPos = new Vec3(
        randomRange(-this.spawnRangeX, this.spawnRangeX),
        randomRange(-this.spawnRangeY, this.spawnRangeY),
        positionZ
      );
      enemy.setPosition(spawnPos);
      positionZ -= this.zOffset;
    });
  }

  private resetEnemy(enemy: Node) {
    // const newPositionZ = this.getFarthestEnemyZ() - this.zOffset;
    const spawnPos = new Vec3(
      randomRange(-this.spawnRangeX, this.spawnRangeX),
      randomRange(-this.spawnRangeY, this.spawnRangeY),
      this.getFarthestEnemyZ() - this.zOffset
    );
    enemy.setPosition(new Vec3(spawnPos));
  }

  private getFarthestEnemyZ(): number {
    return Math.min(...this.enemyPool.map((enemy) => enemy.getPosition().z));
  }

  public resetEnemyPool(){
    this.spawnAllEnemies();
  }

  update(dt: number) {
    if (
      !this.gameManager ||
      this.gameManager.currentState != GameState.GAME_RUNNING
    )
      return;

    this.enemyPool.forEach((enemy) => {
      const position = enemy.getPosition();
      position.z += this.moveSpeed * dt * this.gameManager.difficultyMultiplier;
      enemy.setPosition(position);

      if (position.z > 5 ) {
        this.resetEnemy(enemy);
      }
    });
  }
}
