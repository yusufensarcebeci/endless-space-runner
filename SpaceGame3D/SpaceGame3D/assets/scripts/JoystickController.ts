import { _decorator, Component, EventTouch, Node, UITransform, Vec3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("JoystickController")
export class JoystickController extends Component {
  @property(Node) stick: Node = null;
  @property(Number) joystickRadius: number = 100;

  private direction: Vec3 = new Vec3(0, 0, 0);
  private joystickCenter: Vec3 = new Vec3(0, 0, 0);

  public getDirection(): Vec3 {
    return this.direction;
  }

  onLoad() {
    this.node.on(Node.EventType.TOUCH_MOVE, this.handleTouchMove, this);
    this.node.on(Node.EventType.TOUCH_END, this.resetJoystickPosition, this);
    this.node.on(Node.EventType.TOUCH_CANCEL, this.resetJoystickPosition, this);
  }

  private handleTouchMove(event: EventTouch) {
    const screenPos = event.getUILocation();
    const uiTransform = this.node.getComponent(UITransform);

    const pos = uiTransform.convertToNodeSpaceAR(
      new Vec3(screenPos.x, screenPos.y, 0)
    );

    const offset = new Vec3(
      pos.x - this.joystickCenter.x,
      pos.y - this.joystickCenter.y,
      0
    );

    const distance = offset.length();
    
    if (distance > this.joystickRadius) {
      offset.normalize().multiplyScalar(this.joystickRadius);
    }

    this.stick.setPosition(
      this.joystickCenter.x + offset.x,
      this.joystickCenter.y + offset.y,
      0
    );

    if (distance > 0) {
      this.direction.set(
        offset.x / this.joystickRadius,
        offset.y / this.joystickRadius,
        0
      );
    } else {
      this.direction.set(0, 0, 0);
    }
  }

  private resetJoystickPosition(event: EventTouch) {
    this.stick.setPosition(this.joystickCenter);
    this.direction.set(0, 0, 0);
  }
}
