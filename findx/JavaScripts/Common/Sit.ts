import Console from "../Tools/Console";
import { GameConfig } from "../config/GameConfig";
import { SitConfig } from "../config/Sit";
import { OnClickType } from "../const/Enum";
import OnClickPanel from "./OnClickPanel";

@Component
export default class Sit extends mw.Script {
    private sits: SitConfig = null;

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {
        this.sits = GameConfig.Sit;
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
    private triggers: mw.Trigger[] = [];

    /**客户端的onStart */
    private onStartC(): void {
        this.findTriggers();
    }

    /**find触发器 */
    private findTriggers(): void {
        let length = this.sits.getAllElement().length;
        let i = 0;
        let triggerInterval = TimeUtil.setInterval(async () => {
            let trigger = await GameObject.asyncFindGameObjectById(this.sits.getElement(i + 1).TriggerGuid) as mw.Trigger;
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
        this.getOnClickPanel.showBtn(id, go, OnClickType.Sit);
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
    private interactors: mw.Interactor[] = [];
    private isCanSit: boolean[] = [];
    private playerSitMap: Map<number, number> = new Map<number, number>();

    /**服务端的onStart */
    private onStartS(): void {
        this.findInteractors();
        this.registerEvents();
    }

    /**find交互物 */
    private findInteractors(): void {
        let length = this.sits.getAllElement().length;
        let i = 0;
        let interactorInterval = TimeUtil.setInterval(async () => {
            let interactor = await GameObject.asyncFindGameObjectById(this.sits.getElement(i + 1).InteractivityGuid) as mw.Interactor;
            this.interactors.push(interactor);
            this.isCanSit.push(true);
            ++i;
            if (i >= length) {
                TimeUtil.clearInterval(interactorInterval);
            }
        }, 0.1);
    }

    /**注册事件 */
    private registerEvents(): void {
        Event.addClientListener("Sit", this.bindInteract.bind(this));
        Player.onPlayerLeave.add((player: mw.Player) => {
            let playerId = player.playerId;
            if (!this.playerSitMap.has(playerId)) return;
            let id = this.playerSitMap.get(playerId);
            if (this.interactors[id - 1].leave()) {
                Console.error(`起身`);
            }
            this.isCanSit[id - 1] = true;
        });
    }

    /**绑定交互物 */
    private bindInteract(player: mw.Player, isStartSit: boolean, id: number): void {
        let playerId = player.playerId;
        if (isStartSit) {
            if (!this.isCanSit[id - 1]) return;
            if (this.interactors[id - 1].enter(player.character, mw.HumanoidSlotType.Buttocks, this.sits.getElement(id).SitStance)) {
                Console.error(`坐下`);
            }
            this.isCanSit[id - 1] = false;
            this.playerSitMap.set(playerId, id);
        }
        else {
            if (this.interactors[id - 1].leave()) {
                Console.error(`起身`);
            }
            this.isCanSit[id - 1] = true;
            if (this.playerSitMap.has(playerId)) {
                this.playerSitMap.delete(playerId);
            }
        }
    }

    /**服务端的onUpdate */
    private onUpdateS(dt: number): void {

    }
    /**----------------------------------------[服务端]---------------------------------------- */
}