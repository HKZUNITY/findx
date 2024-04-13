import { PlayerManagerExtesion, } from '../Modified027Editor/ModifiedPlayer';
import { Utils } from "../Tools/utils";
import { DanceConfig } from "../config/Dance";
import { GameConfig } from "../config/GameConfig";
import { OnClickType } from "../const/Enum";
import OnClickPanel from "./OnClickPanel";

@Component
export default class Dance extends mw.Script {
    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {
        if (mw.SystemUtil.isClient()) {
            this.onStartC();
        }
        else if (mw.SystemUtil.isServer()) {
            this.onStartS();
        }
    }

    /**
     * 周期函数 每帧执行
     * 此函数执行需要将this.useUpdate赋值为true
     * @param dt 当前帧与上一帧的延迟 / 秒
     */
    protected onUpdate(dt: number): void {
        if (mw.SystemUtil.isClient()) {
            this.onUpdateC(dt);
        }
        else if (mw.SystemUtil.isServer()) {
            this.onUpdateS(dt);
        }
    }
    /**----------------------------------------[客户端]---------------------------------------- */
    private onClickPanel: OnClickPanel = null;
    private get getOnClickPanel(): OnClickPanel {
        if (this.onClickPanel == null) {
            this.onClickPanel = mw.UIService.getUI(OnClickPanel);
        }
        return this.onClickPanel;
    }
    private player: mw.Player = null;
    private dances: DanceConfig = null;
    private triggers: mw.Trigger[] = [];
    private animationId: mw.Animation = null;

    /**客户端的onStart */
    private async onStartC(): Promise<void> {
        this.player = await Player.asyncGetLocalPlayer();
        this.dances = GameConfig.Dance;
        this.findTriggers();
        this.bindEvents();
    }

    /**find触发器 */
    private findTriggers(): void {
        let length = this.dances.getAllElement().length;
        let i = 0;
        let triggerInterval = TimeUtil.setInterval(async () => {
            let trigger = await GameObject.asyncFindGameObjectById(this.dances.getElement(i + 1).TriggerGuid) as mw.Trigger;
            this.triggers.push(trigger);
            ++i;
            if (i >= length) {
                TimeUtil.clearInterval(triggerInterval);
                this.bindTriggers();
            }
        }, 0.1);
    }

    /**绑定触发器 */
    private bindTriggers(): void {
        for (let i = 0; i < this.triggers.length; ++i) {
            this.triggers[i].onEnter.add((char: mw.Character) => {
                this.onEnterTrigger(char, i + 1, this.triggers[i]);
            });
            this.triggers[i].onLeave.add((char: mw.Character) => {
                this.onLeaveTrigger(char);
            });
        }
    }

    /**玩家进入触发器 */
    private onEnterTrigger(char: mw.Character, id: number, go: mw.GameObject): void {
        if (char != Player.localPlayer.character) return;
        this.getOnClickPanel.showBtn(id, go, OnClickType.Dance);
    }

    /**玩家离开触发器 */
    private onLeaveTrigger(char: mw.Character): void {
        if (char != Player.localPlayer.character) return;
        this.getOnClickPanel.hideBtn();
    }

    /**绑定事件 */
    private bindEvents(): void {
        Event.addLocalListener("Dance", (isDance: boolean, id: number) => {
            if (isDance) {
                if (this.animationId) {
                    this.animationId.stop();
                    this.animationId = null;
                }
                let danceIds = this.dances.getElement(id).DanceGuid;
                let danceId = "";
                if (danceIds.length > 1) {
                    danceId = danceIds[Utils.getRandomInteger(0, danceIds.length - 1)];
                }
                else {
                    danceId = danceIds[0];
                }
                let playerLoc = this.triggers[id - 1].worldTransform.position;
                let offsetPos = this.dances.getElement(id).OffsetPos;
                playerLoc = playerLoc.add(offsetPos);
                if (offsetPos.z == -1) {
                    playerLoc = playerLoc.add(new mw.Vector(Utils.getRandomInteger(offsetPos.x, offsetPos.y), Utils.getRandomInteger(offsetPos.x, offsetPos.y), 0));
                }
                this.player.character.worldTransform.position = playerLoc;
                this.player.character.worldTransform.rotation = this.triggers[id - 1].worldTransform.rotation;
                this.animationId = PlayerManagerExtesion.rpcPlayAnimation(this.player.character, danceId, 0)
                this.player.character.movementEnabled = false;
            }
            else {
                if (this.animationId) {
                    this.animationId.stop();
                    this.animationId = null;
                    this.player.character.movementEnabled = true;
                }
            }
        });
    }

    /**客户端的onUpdate */
    private onUpdateC(dt: number): void {

    }
    /**----------------------------------------[客户端]---------------------------------------- */

    /**----------------------------------------[服务端]---------------------------------------- */
    /**服务端的onStart */
    private onStartS(): void {

    }
    /**服务端的onUpdate */
    private onUpdateS(dt: number): void {

    }
    /**----------------------------------------[服务端]---------------------------------------- */
}