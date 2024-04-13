import { Tween, Utils } from "../Tools/utils";
import { FlashlightConfig } from "../config/Flashlight";
import { GameConfig } from "../config/GameConfig";

@Component
export default class Flashlight extends mw.Script {
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
    private flashlight: FlashlightConfig = null;
    private flashlightGos: mw.GameObject[] = [];

    /**客户端的onStart */
    private onStartC(): void {
        this.flashlight = GameConfig.Flashlight;
        this.findGameObjects();
    }

    /**find GameObject */
    private findGameObjects(): void {
        let length = this.flashlight.getAllElement().length;
        let i = 0;
        let goInterval = TimeUtil.setInterval(async () => {
            let go = await GameObject.asyncFindGameObjectById(this.flashlight.getElement(i + 1).modelGuid);
            this.flashlightGos.push(go);
            this.flashlightTweenIDs.push(null);
            this.preVector2s.push(null);
            ++i;
            if (i >= length) {
                TimeUtil.clearInterval(goInterval);
                this.startFlashing();
            }
        }, 0.1);
    }

    /**开始闪烁 */
    private startFlashing(): void {
        for (let i = 0; i < this.flashlightGos.length; ++i) {
            this.enableFlashlightAnimation(i);
        }
    }

    /**闪烁的Tween */
    private flashlightTweenIDs: Tween<any>[] = [];
    /**闪烁间隔唯一标识 */
    private tweenIntervals: number[] = [];
    /**前一个旋转 */
    private preVector2s: mw.Vector2[] = [];

    /**启用闪烁动画 */
    private enableFlashlightAnimation(id: number): void {
        let rotXY: mw.Vector2;
        if (Utils.getRandomInteger(0, 1)) {
            let x = Utils.getRandomInteger(-240, -210);
            let y = 0;
            if (Utils.getRandomInteger(0, 1)) {
                y = Utils.getRandomInteger(30, 60);
            }
            else {
                y = Utils.getRandomInteger(-60, -30);
            }
            rotXY = new mw.Vector2(x, y);
        }
        else {
            let x = Utils.getRandomInteger(-150, -120);
            let y = 0;
            if (Utils.getRandomInteger(0, 1)) {
                y = Utils.getRandomInteger(30, 60);
            }
            else {
                y = Utils.getRandomInteger(-60, -30);
            }
            rotXY = new mw.Vector2(x, y);
        }
        this.startFlashlightShake(id, new mw.Vector2(-180, 0), rotXY, 1);
        this.preVector2s[id] = rotXY;
        let tweenInterval = TimeUtil.setInterval(() => {
            let rotXY1: mw.Vector2;
            if (Utils.getRandomInteger(0, 1)) {
                let x = Utils.getRandomInteger(-240, -210);
                let y = 0;
                if (Utils.getRandomInteger(0, 1)) {
                    y = Utils.getRandomInteger(30, 60);
                }
                else {
                    y = Utils.getRandomInteger(-60, -30);
                }
                rotXY1 = new mw.Vector2(x, y);
            }
            else {
                let x = Utils.getRandomInteger(-150, -120);
                let y = 0;
                if (Utils.getRandomInteger(0, 1)) {
                    y = Utils.getRandomInteger(30, 60);
                }
                else {
                    y = Utils.getRandomInteger(-60, -30);
                }
                rotXY1 = new mw.Vector2(x, y);
            }
            this.startFlashlightShake(id, this.preVector2s[id], rotXY1, 1);
            this.preVector2s[id] = rotXY1;
        }, 1);
        this.tweenIntervals.push(tweenInterval);
    }

    /**开始闪烁 */
    private startFlashlightShake(id: number, rotXY1: mw.Vector2, rotXY2: mw.Vector2, time: number): void {
        if (this.flashlightTweenIDs[id] != null) {
            this.flashlightTweenIDs[id].stop();
        }
        let rotZ = this.flashlightGos[id].worldTransform.rotation.z;
        let flashlightTweenID = new Tween({ x: rotXY1.x, y: rotXY1.y })
            .to({ x: rotXY2.x, y: rotXY2.y }, time * 1000)
            .onUpdate((v) => {
                this.flashlightGos[id].worldTransform.rotation = new mw.Rotation(v.x, v.y, rotZ);
            })
            .start();
        this.flashlightTweenIDs[id] = flashlightTweenID;
    }

    /**停止上下震荡 */
    private stopEnlargeShake(): void {
        if (!this.tweenIntervals) return;
        for (let i = 0; i < this.tweenIntervals.length; ++i) {
            TimeUtil.clearInterval(this.tweenIntervals[i]);
        }
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