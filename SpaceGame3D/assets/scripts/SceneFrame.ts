import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from "cc";
import { GameManager, GameState } from "./GameManager";
const { ccclass, property } = _decorator;

@ccclass("SceneFrame")
export class SceneFrame extends Component {
  @property(GameManager) gameManager: GameManager = null;
  @property(Prefab) framePrefab: Prefab = null;

  @property(Number) poolSize: number = 0;
  @property(Number) zOffset: number = 0;
  @property(Number) moveSpeed: number = 0;

  initialPosZ: number = -10;

  private framePool: Node[] = [];

  protected onLoad(): void {
    this.initializeFramePool();
    this.spawnAllFrames();
  }

  private initializeFramePool() {
    for (let i = 0; i < this.poolSize; i++) {
      const frame = instantiate(this.framePrefab);
      frame.active = true;
      this.node.addChild(frame);
      this.framePool.push(frame);
    }
  }

  private spawnAllFrames() {
    let positionZ = this.initialPosZ;
    this.framePool.forEach((frame) => {
      frame.setPosition(new Vec3(0, 0, positionZ));
      positionZ -= this.zOffset;
    });
  }

  private resetFrame(frame: Node) {
    const newPositionZ = this.getFarthestFrameZ() - this.zOffset;
    frame.setPosition(new Vec3(0, 0, newPositionZ));
  }

  private getFarthestFrameZ(): number {
    return Math.min(...this.framePool.map((frame) => frame.getPosition().z));
  }

  public resetFramePool(){
    this.spawnAllFrames();
  }

  protected update(dt: number): void {
    if (
      !this.gameManager ||
      this.gameManager.currentState != GameState.GAME_RUNNING
    )
      return;
    this.framePool.forEach((frame) => {
      const position = frame.getPosition();
      position.z += this.moveSpeed * dt * this.gameManager.difficultyMultiplier;
      frame.setPosition(position);

      if (position.z > 5) {
        this.resetFrame(frame);
      }
    });
  }
}
