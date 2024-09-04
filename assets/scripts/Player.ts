import { _decorator, clamp, Component, Node, Vec3 } from "cc";
import { JoystickController } from "./JoystickController";
import { Camera } from "./Camera";

const { ccclass, property } = _decorator;

@ccclass("Player")
export class Player extends Component {
  @property(JoystickController) joystickController: JoystickController = null;
  @property(Camera) camera: Camera = null;
  @property(Number) movementSpeed: number = 10;

  private readonly xMin: number = -7;
  private readonly xMax: number = 7;
  private readonly yMin: number = -7;
  private readonly yMax: number = 7;

  public resetPlayer(){
    this.node.setPosition(new Vec3(0, 0, 0));
  }

  protected update(dt: number): void {
    if (this.joystickController) {
      const direction = this.joystickController.getDirection();
      if (direction.length() > 0) {
        const moveVector = new Vec3(direction.x, direction.y, 0).multiplyScalar(
          this.movementSpeed * dt
        );
        const newPosition = this.node.getPosition().add(moveVector);
        
        newPosition.x = clamp(newPosition.x, this.xMin, this.xMax);
        newPosition.y = clamp(newPosition.y, this.yMin, this.yMax);

        this.node.setPosition(newPosition);
      }
    }
  }

  protected lateUpdate(dt: number): void {
    this.camera.follow(this.node);
  }
}
