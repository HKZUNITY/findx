import Console from "../Tools/Console";
import { GameConfig } from "../config/GameConfig";
import { PortalConfig } from "../config/Portal";
import HUDModuleC from "../module/HUDModule/HUDModuleC";

@Component
export default class Portal extends mw.Script {

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
    private portals: PortalConfig = null;
    private hudModuleC: HUDModuleC = null;
    private get getHUDModuleC(): HUDModuleC {
        if (this.hudModuleC == null) {
            this.hudModuleC = ModuleService.getModule(HUDModuleC);
        }
        return this.hudModuleC;
    }
    /**客户端的onStart */
    private onStartC(): void {
        this.portals = GameConfig.Portal;
        this.findGameObjects();
    }

    /**find GameObject */
    private findGameObjects(): void {
        let length = this.portals.getAllElement().length;
        let i = 0;
        let triggerInterval = TimeUtil.setInterval(async () => {
            let trigger = await GameObject.asyncFindGameObjectById(this.portals.getElement(i + 1).TriggerGuid) as mw.Trigger;
            trigger.onEnter.add(this.onEnterTrigger.bind(this));
            ++i;
            if (i >= length) {
                TimeUtil.clearInterval(triggerInterval);
            }
            Console.error("[hkz]");
        }, 2);
    }

    /**玩家进入触发器 */
    private onEnterTrigger(char: mw.Character): void {
        if (char != Player.localPlayer.character) return;
        this.getHUDModuleC.randomPortal();
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