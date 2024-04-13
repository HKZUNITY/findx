import { Tween, Utils } from "../Tools/utils";
import { GameConfig } from "../config/GameConfig";
import { ShakeConfig } from "../config/Shake";
import { OnClickType } from "../const/Enum";
import OnClickPanel from "./OnClickPanel";

@Component
export default class Shakes extends mw.Script {

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
    private shakes: ShakeConfig = null;
    private gos: mw.GameObject[] = [];
    private triggers: mw.Trigger[] = [];

    /**客户端的onStart */
    private onStartC(): void {
        this.shakes = GameConfig.Shake;
        this.findGameObjects();
    }

    /**find GameObject */
    private findGameObjects(): void {
        let length = this.shakes.getAllElement().length;
        let i = 0;
        let goInterval = TimeUtil.setInterval(async () => {
            let go = await GameObject.asyncFindGameObjectById(this.shakes.getElement(i + 1).ModelGuid);
            this.gos.push(go);
            this.enlargeTweenIDs.push(null);
            let triggerGuid = this.shakes.getElement(i + 1).TriggerGuid;
            if (triggerGuid) {
                let trigger = await GameObject.asyncFindGameObjectById(triggerGuid) as mw.Trigger;
                this.triggers.push(trigger);
            }
            ++i;
            if (i >= length) {
                TimeUtil.clearInterval(goInterval);
                this.startShakes();
                this.bindTriggers();
            }
        }, 0.1);
    }

    /**开始震荡 */
    private startShakes(): void {
        for (let i = 0; i < this.gos.length; ++i) {
            this.enableEnlargeAnimation(i);
        }
    }

    /**变大的Tween */
    private enlargeTweenIDs: Tween<any>[] = [];
    /**音效震动间隔唯一标识 */
    private tweenIntervals: number[] = [];

    /**启用放大动画 */
    private enableEnlargeAnimation(id: number): void {
        let baseScale = this.gos[id].localTransform.scale;
        this.startEnlargeShake(id);
        let tweenInterval = TimeUtil.setInterval(() => {
            this.gos[id].localTransform.scale = baseScale;
            this.startEnlargeShake(id, 1, 1.5);
        }, 0.9);
        this.tweenIntervals.push(tweenInterval);
    }

    /**开始上下左右前后震荡 */
    private startEnlargeShake(id: number, speed: number = 1, smoothingTime: number = 1): void {
        if (this.enlargeTweenIDs[id] != null) {
            this.enlargeTweenIDs[id].stop();
        }
        let baseScale = this.gos[id].localTransform.scale;
        let enlargeTweenID = new Tween({ time: 0 })
            .to({ time: 1 }, smoothingTime * 1000)
            .onUpdate((v) => {
                let x = Utils.shakeFunc(v.time, 100, 3, 2) * speed;
                let y = Utils.shakeFunc(v.time, 100, 4, 1) * speed;
                let z = Utils.shakeFunc(v.time, 100, 3, 2) * speed;
                let scaleZ = new mw.Vector(baseScale.x + x, baseScale.y + y, baseScale.z + z);
                this.gos[id].localTransform.scale = scaleZ;
            })
            .start();
        this.enlargeTweenIDs[id] = enlargeTweenID;
    }

    /**停止上下震荡 */
    private stopEnlargeShake(): void {
        if (!this.tweenIntervals) return;
        for (let i = 0; i < this.tweenIntervals.length; ++i) {
            TimeUtil.clearInterval(this.tweenIntervals[i]);
        }
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

    private onClickPanel: OnClickPanel = null;
    private get getOnClickPanel(): OnClickPanel {
        if (this.onClickPanel == null) {
            this.onClickPanel = mw.UIService.getUI(OnClickPanel);
        }
        return this.onClickPanel;
    }

    /**玩家进入触发器 */
    private onEnterTrigger(char: mw.Character, id: number, go: mw.GameObject): void {
        if (char != Player.localPlayer.character) return;
        this.getOnClickPanel.showBtn(id, go, OnClickType.Shake);
    }

    /**玩家离开触发器 */
    private onLeaveTrigger(char: mw.Character): void {
        if (char != Player.localPlayer.character) return;
        this.getOnClickPanel.hideBtn();
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