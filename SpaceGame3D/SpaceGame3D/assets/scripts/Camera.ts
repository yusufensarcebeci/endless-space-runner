import { _decorator, Component, Node, Vec3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Camera")
export class Camera extends Component {
  posOffset: Vec3 = new Vec3(0, 1.5, 4);
  rotOffset: Vec3 = new Vec3(-10, 0, 0);

  private tempVec3: Vec3 = new Vec3();

  protected start(): void {
      this.node.setRotationFromEuler(this.rotOffset)
  }

  public follow(target: Node) {
    if (!target) return;

    Vec3.add(this.tempVec3, target.worldPosition, this.posOffset);
    this.node.setPosition(this.tempVec3);
  }
}
