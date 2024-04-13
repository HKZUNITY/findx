import { GeneralManager, } from '../../../../../Modified027Editor/ModifiedStaticAPI';
import { PlayerManagerExtesion, } from '../../../../../Modified027Editor/ModifiedPlayer';
import Console from "../../../../../Tools/Console";
import { Utils } from "../../../../../Tools/utils";
import { GameConfig } from "../../../../../config/GameConfig";
import { TelegraphPoleConfig } from "../../../../../config/TelegraphPole";
import GlobalData from "../../../../../const/GlobalData";

@Component
export default class TelegraphPole extends mw.Script {
    /**-------------------- 可控数据 -------------------- */
    @mw.Property({ displayName: "被电时间（s）", group: "电线杆属性" })
    private delayDieTime: number = 3;
    /**-------------------- 可控数据 -------------------- */

    /**-------------------- 属性 -------------------- */
    /**当前客户端玩家 */
    private player: mw.Player = null;
    /**-------------------- 属性 -------------------- */

    /**-------------------- 数据 -------------------- */
    /**播放动画的唯一标识 */
    private playerAnimationMap: Map<number, mw.Animation> = new Map<number, mw.Animation>();;
    /**播放音效的唯一标识 */
    private playerAudioMapId: Map<number, number> = new Map<number, number>();
    /**播放特效的唯一标识 */
    private playerEffectMapId: Map<number, number> = new Map<number, number>();
    /**延迟死亡的唯一标识 */
    private delayDieTimeoutMap: Map<number, number> = new Map<number, number>();
    /**延迟复活的唯一标识 */
    private delayRebornTimeout: number = null;
    /**-------------------- 数据 -------------------- */

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected async onStart(): Promise<void> {
        // await this.onPreloadAssetsChangedInEditor();
        if (mw.SystemUtil.isClient()) {
            Console.error("TelegraphPole-onStart-isClient");
            this.initDataC();
            this.bindTriggerC();
            this.bindEventsC();
        }
        if (mw.SystemUtil.isServer()) {
            Console.error("TelegraphPole-onStart-isServer");
            this.bindEventsS();
        }
    }

    /** 当预加载资源改动的时候自动调用此函数 */
    // public async onPreloadAssetsChangedInEditor() {
    //     for (let key in TelegraphPoleResource) {
    //         let keyToAny: any = key;
    //         if (isNaN(keyToAny)) {
    //             let telegraphPoleResource: any = TelegraphPoleResource[key];
    //             let telegraphPoleResourceEnum: TelegraphPoleResource = telegraphPoleResource;
    //             await Utils.downloadAsset(telegraphPoleResourceEnum);
    //         }
    //     }
    // }
    /**------------------------------------------- 客户端 ------------------------------------------------ */
    private telegraphPole: TelegraphPoleConfig = null;
    private telegraphPoleLen: number = 0;
    /**初始化数据 */
    private async initDataC(): Promise<void> {
        this.telegraphPole = GameConfig.TelegraphPole;
        this.telegraphPoleLen = this.telegraphPole.getAllElement().length;
        this.player = await Player.asyncGetLocalPlayer();
    }

    /**绑定触发器(客户端) */
    private async bindTriggerC(): Promise<void> {
        if (this.telegraphPoleLen == 0) return;
        for (let i = 0; i < this.telegraphPoleLen; ++i) {
            let trigger = (await GameObject.asyncFindGameObjectById(this.telegraphPole.getElement(i + 1).TriggerGuid)) as mw.Trigger;
            trigger.onEnter.add((char: mw.Character) => {
                this.onEnterTriggerC(char);
            });
        }
    }

    /**绑定事件(客户端) */
    private bindEventsC(): void {
        Event.addServerListener(ListenerEventType.SendClient, this.endElectrocutedC.bind(this));
    }

    /**进入触发器（客户端） */
    private onEnterTriggerC(char: mw.Character): void {
        Console.error("[hkz]");
        if (char != Player.localPlayer.character) return;
        Console.error("[hkz1]");
        this.startElectrocutedC();
        Event.dispatchToLocal("dianji", 1);
    }

    /**开始电刑（客户端） */
    private async startElectrocutedC(): Promise<void> {
        this.setPlayerStateC(false);
        Event.dispatchToServer(ListenerEventType.SendServers);
    }

    /**结束电刑-开始死亡（客户端） */
    private endElectrocutedC(): void {
        //开启布娃娃效果
        this.player.character.ragdollEnabled = true;
        if (this.delayRebornTimeout) {
            clearTimeout(this.delayRebornTimeout);
        }
        this.delayRebornTimeout = setTimeout(() => {
            clearTimeout(this.delayRebornTimeout);
            this.rebornC();
        }, this.delayDieTime / 2 * 1000);
    }
    /**复活（客户端） */
    private rebornC(): void {
        let index = Utils.getRandomInteger(0, 3);
        this.player.character.worldTransform.position = GlobalData.homeLocs[index];
        this.player.character.worldTransform.rotation = GlobalData.homeRots[index];
        //关闭布娃娃效果
        this.player.character.ragdollEnabled = false;
        this.setPlayerStateC(true);
    }
    /**设置人物状态（客户端） */
    private setPlayerStateC(v: boolean) {
        this.player.character.jumpEnabled = v;
        this.player.character.movementEnabled = v;
    }
    /**------------------------------------------- 客户端 ------------------------------------------------ */

    /**------------------------------------------- 服务端 ------------------------------------------------ */
    /**绑定事件（服务端） */
    private bindEventsS(): void {
        Event.addClientListener(ListenerEventType.SendServers, this.startElectrocutedS.bind(this));
    }
    /**开始电刑（服务端） */
    private async startElectrocutedS(player: mw.Player): Promise<void> {
        let playerid = player.playerId;

        if (this.playerAnimationMap.has(playerid)) {
            let animationId = this.playerAnimationMap.get(playerid);
            if (animationId) {
                animationId.stop();
            }
        }
        let playerAnimationId = PlayerManagerExtesion.rpcPlayAnimation(player.character, TelegraphPoleResource.Animation, 0, 2)
        this.playerAnimationMap.set(playerid, playerAnimationId);

        if (this.playerAudioMapId.has(playerid)) {
            let audioId = this.playerAudioMapId.get(playerid);
            if (audioId) {
                mw.SoundService.stop3DSound(audioId);
            }
        }
        let playerAudioId = mw.SoundService.play3DSound(TelegraphPoleResource.Audio, player.character.worldTransform.position, 0, 1);
        this.playerAudioMapId.set(playerid, playerAudioId);

        if (this.playerEffectMapId.has(playerid)) {
            let effectId = this.playerEffectMapId.get(playerid);
            if (effectId) {
                EffectService.stop(effectId);
            }
        }
        let playerEffectId = GeneralManager.rpcPlayEffectOnPlayer(TelegraphPoleResource.Hurt, player,
            mw.HumanoidSlotType.Root, 0, new mw.Vector(0, 0, 0), mw.Rotation.zero, new mw.Vector(1, 1, 0.35));
        this.playerEffectMapId.set(playerid, playerEffectId);

        if (this.delayDieTimeoutMap.has(playerid)) {
            let dieId = this.delayDieTimeoutMap.get(playerid);
            if (dieId) {
                clearTimeout(dieId);
            }
        }
        let delayDieTimeoutId = setTimeout(() => {
            if (this.delayDieTimeoutMap.has(playerid)) {
                let dieId = this.delayDieTimeoutMap.get(playerid);
                if (dieId) {
                    clearTimeout(dieId);
                }
                else {
                    clearTimeout(delayDieTimeoutId);
                }
            }
            else {
                clearTimeout(delayDieTimeoutId);
            }
            this.endElectrocutedS(playerid);
        }, this.delayDieTime * 1000);

        this.delayDieTimeoutMap.set(playerid, delayDieTimeoutId);
    }

    /**结束电刑-开始死亡（服务端） */
    private endElectrocutedS(playerid: number): void {
        if (this.playerAnimationMap.has(playerid)) {
            let animationId = this.playerAnimationMap.get(playerid);
            if (animationId) {
                animationId.stop();
                this.playerAnimationMap.set(playerid, null);
            }
        }

        if (this.playerAudioMapId.has(playerid)) {
            let audioId = this.playerAudioMapId.get(playerid);
            if (audioId) {
                mw.SoundService.stop3DSound(audioId);
                this.playerAudioMapId.set(playerid, null);
            }
        }

        if (this.playerEffectMapId.has(playerid)) {
            let effectId = this.playerEffectMapId.get(playerid);
            if (effectId) {
                EffectService.stop(effectId);
                this.playerEffectMapId.set(playerid, null);
            }
        }
        //开启布娃娃效果
        Event.dispatchToClient(Player.getPlayer(playerid), ListenerEventType.SendClient);
    }
    /**------------------------------------------- 服务端 ------------------------------------------------ */
}

export enum TelegraphPoleResource {
    /**触电动画 */
    Animation = "14698",
    /**触电音效 */
    Audio = "20464",
    /**被电特效 */
    Hurt = "197173",
}

/**监听事件的类型 */
export enum ListenerEventType {
    /**客户端发给服务端同步玩家表现 */
    SendServers = "SendServers_TelegraphPole",
    /**服务端发给客户端同步玩家表现 */
    SendClient = "SendClient_TelegraphPole",
}