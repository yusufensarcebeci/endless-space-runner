import { _decorator, Component, Node } from "cc";
import { GameManager, GameState } from "./GameManager";
import { ScoreHandler } from "./ScoreHandler";
import { EnemyManager } from "./EnemyManager";
import { SceneFrame } from "./SceneFrame";
import { Player } from "./Player";
const { ccclass, property } = _decorator;

@ccclass("UIManager")
export class UIManager extends Component {
  @property(GameManager) gameManager: GameManager = null;
 
  @property(EnemyManager) enemyManager: EnemyManager = null;
  @property(SceneFrame) sceneFrame: SceneFrame = null;
  @property(Player) player: Player = null;

  @property(Node) loadingScreen: Node = null;
  @property(Node) initScreen: Node = null;
  @property(Node) gameScreen: Node = null;
  @property(Node) endScreen: Node = null;

  @property(Node) scoreHandlerNode: Node = null;
  @property(Node) load: Node = null;

  protected onLoad(): void {
    this.handleLoading();
    this.scheduleOnce(() => {
      this.handleInitScreen();
    }, 2);
  }

  private onPlayButtonClicked() {
    this.handleLoading();
    this.scheduleOnce(() => {
      this.handleGameScreen();
    }, 2);
  }

  private onRetryButtonClicked() {
    this.handleLoading();

    this.enemyManager.resetEnemyPool();
    this.sceneFrame.resetFramePool();
    this.player.resetPlayer();
    this.gameManager.resetDifficulty();

    this.scheduleOnce(()=>{
        this.handleGameScreen();
    },2)
  }

  private onHomeButtonClicked() {
    this.handleLoading();
    
    this.enemyManager.resetEnemyPool();
    this.sceneFrame.resetFramePool();
    this.player.resetPlayer();
    this.gameManager.resetDifficulty();

    this.scheduleOnce(()=>{
        this.handleInitScreen();
    },2)
  }

  public handleInitScreen() {
    this.hideAllScreens();
    if (this.initScreen) {
      this.initScreen.active = true;
      this.gameManager.setState(GameState.INIT);
    }
  }

  public handleLoading() {
    this.hideAllScreens();
    if (this.loadingScreen) {
      this.loadingScreen.active = true;
      this.gameManager.setState(GameState.LOADING);
    }
  }

  public handleGameScreen() {
    this.hideAllScreens();
    if (this.gameScreen) {
      this.gameScreen.active = true;
      this.gameManager.setState(GameState.GAME_RUNNING);

      if (this.scoreHandlerNode) {
        const scoreHandler = this.scoreHandlerNode.getComponent(ScoreHandler);
        if (scoreHandler) {
          scoreHandler.resetScore();
        }
      }
    }
  }

  public handleEndScreen() {
    this.hideAllScreens();
    if (this.endScreen) {
      this.endScreen.active = true;
      this.gameManager.setState(GameState.GAME_OVER);
      
     
      if (this.scoreHandlerNode) {
        const scoreHandler = this.scoreHandlerNode.getComponent(ScoreHandler);
        if (scoreHandler) {
          scoreHandler.updategameOverScoreLabel();
        }
      }
    }
  }

  private hideAllScreens() {
    if (this.loadingScreen) this.loadingScreen.active = false;
    if (this.initScreen) this.initScreen.active = false;
    if (this.gameScreen) this.gameScreen.active = false;
    if (this.endScreen) this.endScreen.active = false;
  }

  private rotateLoadSprite(dt: number) {
    if (!this.load) return;
    let rotZ = this.load.eulerAngles.z;
    this.load.setRotationFromEuler(0, 0, rotZ - dt * 200);
  }

  protected update(dt: number): void {
    let activity = this.loadingScreen.active;
    if (activity) {
      this.rotateLoadSprite(dt);
    }
  }
}
