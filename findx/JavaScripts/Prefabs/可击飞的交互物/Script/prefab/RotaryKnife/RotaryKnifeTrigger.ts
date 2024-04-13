import { GeneralManager, } from '../../../../../Modified027Editor/ModifiedStaticAPI';
import { SpawnManager, SpawnInfo, } from '../../../../../Modified027Editor/ModifiedSpawn';
import { PlayerManagerExtesion, } from '../../../../../Modified027Editor/ModifiedPlayer';
import Console from "../../../../../Tools/Console";
import { GameConfig } from "../../../../../config/GameConfig";
import { RotaryKnifeTriggerConfig } from "../../../../../config/RotaryKnifeTrigger";
import { Utils } from '../../../../../Tools/utils';

@Component
export default class RotaryKnifeTrigger extends mw.Script {
    @mw.Property({ displayName: "向后的冲量", group: "属性" })
    private backImpulse: number = 1000;

    @mw.Property({ displayName: "向上的冲量", group: "属性" })
    private upImpulse: number = 1000;

    @mw.Property({ displayName: "重生时间（s）", group: "属性" })
    private reborn: number = 5;

    @mw.Property({ displayName: "墓碑的生成位置偏移", group: "属性" })
    private tombstonePosZ: number = 110;

    /**墓碑的预制体的Guid */
    private tombstoneGuid: string = "110950";

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected async onStart(): Promise<void> {
        // await this.onPreloadAssetsChangedInEditor();
        if (mw.SystemUtil.isClient()) {
            this.initDataC();
            this.bindTriggerC();
            this.registerEventsC();
            this.useUpdate = false;
        }
        if (mw.SystemUtil.isServer()) {
            this.registerEventsS();
            this.initDataS();
            this.useUpdate = true;
        }
    }

    /** 当预加载资源改动的时候自动调用此函数 */
    // public async onPreloadAssetsChangedInEditor() {
    //     for (let key in KnifeRescourse) {
    //         let keyToAny: any = key;
    //         if (isNaN(keyToAny)) {
    //             let knifeRescourse: any = KnifeRescourse[key];
    //             let knifeRescourseEnum: KnifeRescourse = knifeRescourse;
    //             await Utils.downloadAsset(knifeRescourseEnum);
    //         }
    //     }
    // }
    /**------------------------------------------- 客户端 ------------------------------------------------ */
    /**触发器 */
    private triggers: mw.Trigger[] = [];
    /**当前客户端玩家 */
    private player: mw.Player = null;
    private rotaryKnifeTrigger: RotaryKnifeTriggerConfig = null;
    private rotaryKnifeTriggerLen: number = 0;

    /**初始化数据(客户端) */
    private async initDataC(): Promise<void> {
        this.player = await Player.asyncGetLocalPlayer();
    }

    /**绑定触发器(客户端) */
    private async bindTriggerC(): Promise<void> {
        this.rotaryKnifeTrigger = GameConfig.RotaryKnifeTrigger;
        this.rotaryKnifeTriggerLen = this.rotaryKnifeTrigger.getAllElement().length;
        if (this.rotaryKnifeTriggerLen == 0) return;
        for (let i = 0; i < this.rotaryKnifeTriggerLen; ++i) {
            let trigger = (await GameObject.asyncFindGameObjectById(this.rotaryKnifeTrigger.getElement(i + 1).TriggerGuid)) as mw.Trigger;
            trigger.onEnter.add((char: mw.Character) => {
                this.onEnterTriggerC(char);
            });
        }
    }

    /**注册事件（客户端） */
    private registerEventsC(): void {

    }

    /**进入触发器(客户端) */
    private onEnterTriggerC(char: mw.Character): void {
        if (char != Player.localPlayer.character) return;
        Console.error("[起飞喽]");
        Event.dispatchToLocal("dianji", 1);
        Event.dispatchToServer(ListenerEventsType.ClientToServer);
    }

    /**客户端的Update */
    private onUpdateC(dt: number): void {
        // this.isTouchDownS(this.player);
    }
    /**------------------------------------------- 客户端 ------------------------------------------------ */

    /**------------------------------------------- 服务端 ------------------------------------------------ */
    private playerMapS: Map<number, mw.Player> = new Map<number, mw.Player>();
    private animationIdMapS: Map<number, mw.Animation> = new Map<number, mw.Animation>();
    private playerEffectMapId: Map<number, number> = new Map<number, number>();

    /**初始化数据 */
    private initDataS(): void {
    }

    /**注册事件（服务端） */
    private registerEventsS(): void {
        Event.addClientListener(ListenerEventsType.ClientToServer, this.takeOffS.bind(this));
        Player.onPlayerLeave.add((player) => {
            let playerId = player.playerId;
            if (this.playerMapS.has(playerId)) {
                this.playerMapS.delete(playerId);
            }
        });
    }

    /**开始起飞（服务端） */
    private takeOffS(player: mw.Player): void {
        let lookUp = player.character.worldTransform.getUpVector();
        lookUp = lookUp.multiply(this.upImpulse);

        let lookForward = player.character.worldTransform.getForwardVector();
        lookForward = lookForward.multiply(-this.backImpulse);

        let lookBack = new mw.Vector(lookForward.x + lookUp.x, lookForward.y + lookUp.y, lookForward.z + lookUp.z);
        Console.error("[lookBack--]" + lookBack);

        player.character.addImpulse(lookBack, true);

        mw.SoundService.play3DSound(KnifeRescourse.Knife, player.character.worldTransform.position, 1, 1);

        let playerId = player.playerId;
        let animationId: mw.Animation = null;
        if (this.animationIdMapS.has(playerId)) {
            animationId = this.animationIdMapS.get(playerId);
            if (animationId) {
                animationId.stop();
            }
        }
        animationId = PlayerManagerExtesion.rpcPlayAnimation(player.character, KnifeRescourse.LieDown, 0, 1)
        this.animationIdMapS.set(player.playerId, animationId);

        if (this.playerEffectMapId.has(playerId)) {
            let effectId = this.playerEffectMapId.get(playerId);
            if (effectId) {
                EffectService.stop(effectId);
            }
        }
        let playerEffectId = GeneralManager.rpcPlayEffectOnPlayer(KnifeRescourse.TailEffect, player,
            mw.HumanoidSlotType.Root, 0, new mw.Vector(0, 0, 0), mw.Rotation.zero, new mw.Vector(2, 2, 2));
        this.playerEffectMapId.set(playerId, playerEffectId);

        setTimeout(() => {
            this.playerMapS.set(playerId, player);
        }, 500);
    }

    /**服务端的Update */
    private onUpdateS(dt: number): void {
        if (this.playerMapS.size > 0) {
            this.playerMapS.forEach((v) => {
                this.isTouchDownS(v);
            });
        }
    }

    /**判断玩家是否落地（服务端） */
    private isTouchDownS(player: mw.Player): void {
        if (player.character.isJumping) return;
        this.playerMapS.delete(player.playerId);
        let p = player;
        this.dieS(p);
    }

    /**玩家死亡（服务端） */
    private dieS(player: mw.Player): void {
        Console.error("[Die]--" + player.playerId);
        mw.SoundService.play3DSound(KnifeRescourse.Die, player.character.worldTransform.position, 1, 1);

        let playerId = player.playerId;
        if (this.animationIdMapS.has(playerId)) {
            let animationId = this.animationIdMapS.get(playerId);
            if (animationId) {
                animationId.stop();
                this.animationIdMapS.set(playerId, null);
            }
        }

        if (this.playerEffectMapId.has(playerId)) {
            let effectId = this.playerEffectMapId.get(playerId);
            if (effectId) {
                EffectService.stop(effectId);
                this.playerEffectMapId.set(playerId, null);
            }
        }

        player.character.ragdollEnabled = true;
        this.spawnTombstoneS(player);
    }

    /**生成墓碑（服务端） */
    private spawnTombstoneS(player: mw.Player): void {
        let tombstone: mw.GameObject = null;
        if (this.tombstoneGuid) {
            tombstone = SpawnManager.wornSpawn(this.tombstoneGuid);
            let pos = player.character.worldTransform.position;
            tombstone.worldTransform.position = (new mw.Vector(pos.x, pos.y, pos.z - this.tombstonePosZ));
        }
        setTimeout(() => {
            player.character.ragdollEnabled = false;
            if (this.tombstoneGuid) {
                tombstone.destroy();
            }
        }, this.reborn * 1000);
    }
    /**------------------------------------------- 服务端 ------------------------------------------------ */

    /**------------------------------------------- 通用 ------------------------------------------------ */
    protected onUpdate(dt: number): void {
        if (mw.SystemUtil.isClient()) {
            this.onUpdateC(dt);
        }
        if (mw.SystemUtil.isServer()) {
            this.onUpdateS(dt);
        }
    }

    /**资源下载 */
    // public async downloadRes(guid: string): Promise<boolean> {
    //     if (mw.AssetUtil.assetLoaded(guid)) {
    //         return true;
    //     }
    //     return await mw.AssetUtil.asyncDownloadAsset(guid);
    // }
    /**------------------------------------------- 通用 ------------------------------------------------ */
}
/**客户端&服务端发送的事件类型 */
export enum ListenerEventsType {
    /**客户端发给服务端 */
    ClientToServer = "ClientToServer_Knife",
}
/**优先加载资源 */
export enum KnifeRescourse {
    /**落地摔死叫 */
    Die = "115263",
    /**闸刀触发 */
    Knife = "19608",
    /**躺下耍赖 */
    LieDown = "14562",
    /**拖尾特效 */
    TailEffect = "27392",
    /**墓碑Guid */
    TombstoneGuid = "110950",
}