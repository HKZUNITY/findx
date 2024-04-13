import { GeneralManager, } from '../../../../../Modified027Editor/ModifiedStaticAPI';
import { SpawnManager, SpawnInfo, } from '../../../../../Modified027Editor/ModifiedSpawn';
import { PlayerManagerExtesion, } from '../../../../../Modified027Editor/ModifiedPlayer';
import Console from "../../../../../Tools/Console";
import { GameConfig } from "../../../../../config/GameConfig";
import { PlayerLauncherConfig } from "../../../../../config/PlayerLauncher";
import { Utils } from '../../../../../Tools/utils';

/*
 * @Author: 侯凯召
 * @QQ邮箱: 3046916186@qq.com
 * @Date: 2023-01-17 09:53:58
 * @LastEditors: 穿迷彩服的鲨鱼
 * @LastEditTime: 2023-01-29 16:11:32
 * @Description: 可发射飞行交互物预制体
 * @FilePath: \Demo\JavaScripts\prefab\PlayerLauncher\PlayerLauncher.ts
 */
@Component
export default class PlayerLauncher extends mw.Script {
    @mw.Property({ displayName: "重生时间（s）", group: "脚本属性" })
    private reborn: number = 5;

    @mw.Property({ displayName: "冲量大小", group: "脚本属性" })
    private impulse: number = 2000;

    @mw.Property({ displayName: "墓碑的生成位置偏移", group: "脚本属性" })
    private tombstonePosZ: number = 110;

    /**墓碑的预制体的Guid */
    private tombstoneGuid: string = "110950";

    private playerLauncher: PlayerLauncherConfig = null;
    private playerLauncherLen: number = 0;

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected async onStart(): Promise<void> {
        // await this.onPreloadAssetsChangedInEditor();
        this.playerLauncher = GameConfig.PlayerLauncher;
        this.playerLauncherLen = this.playerLauncher.getAllElement().length;
        if (mw.SystemUtil.isClient()) {
            this.initDataC();
            this.bindTriggerC();
            this.useUpdate = false;
        }
        if (mw.SystemUtil.isServer()) {
            this.initDataS();
            this.registerEventsS();
            this.useUpdate = true;
        }
    }

    /** 当预加载资源改动的时候自动调用此函数 */
    // public async onPreloadAssetsChangedInEditor() {
    //     for (let key in LauncherRescourse) {
    //         let keyToAny: any = key;
    //         if (isNaN(keyToAny)) {
    //             let launcherRescourse: any = LauncherRescourse[key];
    //             let launcherRescourseEnum: LauncherRescourse = launcherRescourse;
    //             await Utils.downloadAsset(launcherRescourseEnum);
    //         }
    //     }
    // }
    /**------------------------------------------- 客户端 ------------------------------------------------ */
    private player: mw.Player = null;

    /**初始化数据（客户端） */
    private async initDataC(): Promise<void> {
        this.player = await Player.asyncGetLocalPlayer();
    }

    /**绑定触发器（客户端） */
    private async bindTriggerC(): Promise<void> {
        if (this.playerLauncherLen == 0) return;
        for (let i = 0; i < this.playerLauncherLen; ++i) {
            let trigger = (await GameObject.asyncFindGameObjectById(this.playerLauncher.getElement(i + 1).TriggerGuid)) as mw.Trigger;
            trigger.onEnter.add((char: mw.Character) => {
                this.onEnterTriggerC(char, i);
            });
        }
    }

    /**进入触发器(客户端) */
    private onEnterTriggerC(char: mw.Character, triggerIndex: number): void {
        if (char != Player.localPlayer.character) return;
        this.igniteC(triggerIndex);
    }

    /**点火（客户端） */
    private igniteC(triggerIndex: number): void {
        Event.dispatchToLocal("dianji", 1);
        Event.dispatchToServer(ListenerEventsType.ClientToServer, triggerIndex);
    }
    /**------------------------------------------- 客户端 ------------------------------------------------ */

    /**------------------------------------------- 服务端 ------------------------------------------------ */
    /**需要变化的模型 */
    private barrelModels: mw.GameObject[] = [];
    /**交互物 */
    private interactivitys: mw.Interactor[] = [];
    /**当前需要发射的玩家 */
    private curPlayers: mw.Player[] = [];
    /**发射方向(每个交互物对应一个发射方向 */
    private fireDirections: mw.Vector[] = [];
    private curPlayersMap: Map<number, number> = new Map<number, number>();
    private playerMapS: Map<number, mw.Player> = new Map<number, mw.Player>();
    private animationIdMapS: Map<number, mw.Animation> = new Map<number, mw.Animation>();
    private preAnimationIdMapS: Map<number, mw.Animation> = new Map<number, mw.Animation>();
    private playerEffectMapId: Map<number, number> = new Map<number, number>();

    /**初始化数据（服务端） */
    private async initDataS(): Promise<void> {
        this.findGameObjectsS();
    }

    /**根据object的guid find到它（服务端） */
    private async findGameObjectsS(): Promise<void> {
        if (this.playerLauncherLen > 0) {
            for (let i = 0; i < this.playerLauncherLen; ++i) {
                let playerLauncherElement = this.playerLauncher.getElement(i + 1);
                let barrelModel = await GameObject.asyncFindGameObjectById(playerLauncherElement.ModelGuid);
                barrelModel.setCollision(mw.PropertyStatus.Off);
                this.barrelModels.push(barrelModel);

                let fireDirection = barrelModel.worldTransform.getForwardVector();
                this.fireDirections.push(fireDirection);

                let interactivity = await GameObject.asyncFindGameObjectById(playerLauncherElement.InteractivityGuid) as mw.Interactor;
                this.interactivitys.push(interactivity);
            }
        }
    }

    /**注册事件&监听事件（服务端） */
    private registerEventsS(): void {
        Event.addClientListener(ListenerEventsType.ClientToServer, this.igniteS.bind(this));
        Player.onPlayerLeave.add((player) => {
            let playerId = player.playerId;
            if (this.curPlayersMap.has(playerId)) {
                this.curPlayers[this.curPlayersMap.get(playerId)] = null;
                this.curPlayersMap.delete(playerId);
            }
            if (this.playerMapS.has(playerId)) {
                this.playerMapS.delete(playerId);
            }
        });
    }

    /**点火（服务端） */
    private async igniteS(player: mw.Player, triggerIndex: number): Promise<void> {
        Console.error("[player--] " + player.playerId + " -- " + triggerIndex);
        if (this.curPlayers[triggerIndex]) return;

        this.curPlayers[triggerIndex] = player;
        this.curPlayersMap.set(player.playerId, triggerIndex);

        let isEnterSucceed = await this.interactivitys[triggerIndex].enter(this.curPlayers[triggerIndex].character);
        if (!isEnterSucceed) return;

        this.interactivitys[triggerIndex].localTransform.position = (new mw.Vector(250, 0, 0));
        new mw.Tween({ x: 250, z: 0 }).to({ x: 115, z: 230 }, 0.5 * 1000).onUpdate((v) => {
            this.interactivitys[triggerIndex].localTransform.position = (new mw.Vector(v.x, 0, v.z));
        }).start().onComplete(() => {
            let playerId = this.curPlayers[triggerIndex].playerId;
            this.playerAnimationS(playerId, this.preAnimationIdMapS, LauncherRescourse.LieDown);
            this.preLaunch(triggerIndex);
        });
    }

    /**预备发射（服务端） */
    private preLaunch(triggerIndex: number): void {
        let soundId = mw.SoundService.play3DSound(LauncherRescourse.StoragePowerSound,
            this.barrelModels[triggerIndex].worldTransform.position, 1, 1);
        GeneralManager.rpcPlayEffectOnGameObject(LauncherRescourse.StoragePowerEffect,
            this.barrelModels[triggerIndex], 1, new mw.Vector(250, 0, 0), new mw.Rotation(180, 85, 180), new mw.Vector(0.5, 0.5, 0.5));

        new mw.Tween({ x: 1.5, }).to({ x: 1, }, 0.6 * 1000).onUpdate((v) => {
            this.barrelModels[triggerIndex].localTransform.scale = (new mw.Vector(v.x, 1.5, 1.5));
        }).start().onComplete(() => {
            new mw.Tween({ x: 1, }).to({ x: 1.5, }, 0.3 * 1000).onUpdate((v) => {
                this.barrelModels[triggerIndex].localTransform.scale = (new mw.Vector(v.x, 1.5, 1.5));
            }).start().onComplete(() => {
                mw.SoundService.stop3DSound(soundId);
                if (!this.curPlayers[triggerIndex]) return;
                let playerId = this.curPlayers[triggerIndex].playerId;
                this.stopAnimationS(playerId, this.preAnimationIdMapS);
                this.startLaunch(triggerIndex);
            });
        });
    }

    /**开始发射（服务端） */
    private async startLaunch(triggerIndex: number): Promise<void> {
        let isExitSuceed = await GeneralManager.modifyExitInteractiveState(this.interactivitys[triggerIndex], this.curPlayers[triggerIndex].character.worldTransform.position)
        if (!isExitSuceed) return;

        let lookForwardAndUp = new mw.Vector(this.fireDirections[triggerIndex].x, this.fireDirections[triggerIndex].y, this.fireDirections[triggerIndex].z);
        let lookForward = lookForwardAndUp.multiply(this.impulse);
        Console.error("[lookForward--]" + lookForward);
        this.curPlayers[triggerIndex].character.addImpulse(lookForward, true);

        mw.SoundService.play3DSound(LauncherRescourse.LauncherSound, this.barrelModels[triggerIndex].worldTransform.position, 1, 1);

        let playerId = this.curPlayers[triggerIndex].playerId;
        this.playerAnimationS(playerId, this.animationIdMapS, LauncherRescourse.LauncheringAnimation);
        this.playEffectS(playerId, this.playerEffectMapId, LauncherRescourse.TailEffect,
            new mw.Vector(0, 0, 0), mw.Rotation.zero, new mw.Vector(2, 2, 2));

        this.playerMapS.set(playerId, this.curPlayers[triggerIndex]);
        this.curPlayers[triggerIndex] = null;
        if (this.curPlayersMap.has(playerId)) {
            this.curPlayersMap.delete(playerId);
        }
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
        mw.SoundService.play3DSound(LauncherRescourse.Die, player.character.worldTransform.position, 1, 1);

        let playerId = player.playerId;
        this.stopAnimationS(playerId, this.animationIdMapS);
        this.stopEffectS(playerId, this.playerEffectMapId);

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

    /**播放动画（服务端） */
    private playerAnimationS(playerId: number, animationMap: Map<number, mw.Animation>, clip: LauncherRescourse): void {
        let player = Player.getPlayer(playerId);
        let animationId: mw.Animation = null;
        if (animationMap.has(playerId)) {
            animationId = animationMap.get(playerId);
            if (animationId) {
                animationId.stop();
            }
        }
        animationId = PlayerManagerExtesion.rpcPlayAnimation(player.character, clip, 0, 1)
        animationMap.set(playerId, animationId);
    }

    /**停止播放动画（服务端） */
    private stopAnimationS(playerId: number, animationMap: Map<number, mw.Animation>): void {
        if (animationMap.has(playerId)) {
            let animationId = animationMap.get(playerId);
            if (animationId) {
                animationId.stop();
                animationMap.set(playerId, null);
            }
        }
    }

    /**播放特效（服务端） */
    private playEffectS(playerId: number, effectMap: Map<number, number>, effect: LauncherRescourse,
        offset?: mw.Vector, rotation?: mw.Rotation, scale?: mw.Vector): void {
        let player = Player.getPlayer(playerId);
        if (effectMap.has(playerId)) {
            let effectId = effectMap.get(playerId);
            if (effectId) {
                EffectService.stop(effectId);
            }
        }
        let playerEffectId = GeneralManager.rpcPlayEffectOnPlayer(effect, player,
            mw.HumanoidSlotType.Root, 0, new mw.Vector(0, 0, 0), mw.Rotation.zero, new mw.Vector(2, 2, 2));
        effectMap.set(playerId, playerEffectId);
    }

    /**停止播放特效（服务端） */
    private stopEffectS(playerId: number, effectMap: Map<number, number>): void {
        if (effectMap.has(playerId)) {
            let effectId = effectMap.get(playerId);
            if (effectId) {
                EffectService.stop(effectId);
                effectMap.set(playerId, null);
            }
        }
    }
    /**------------------------------------------- 服务端 ------------------------------------------------ */


    /**------------------------------------------- 通用 ------------------------------------------------ */

    /**
     * 周期函数 每帧执行
     * 此函数执行需要将this.useUpdate赋值为true
     * @param dt 当前帧与上一帧的延迟 / 秒
     */
    protected onUpdate(dt: number): void {
        if (mw.SystemUtil.isClient()) {
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
}

export enum LauncherRescourse {
    /**发射中动画 */
    LauncheringAnimation = "122289",
    /**蓄力音效 */
    StoragePowerSound = "129650",
    /**发射音效 */
    LauncherSound = "20589",
    /**蓄力特效 */
    StoragePowerEffect = "197884",
    /**拖尾特效 */
    TailEffect = "27392",
    /**落地摔死叫音效 */
    Die = "115263",
    /**躺下动画 */
    LieDown = "14503",
    /**墓碑 */
    TombstoneGuid = "110950",
}

/**客户端&服务端发送的事件类型 */
export enum ListenerEventsType {
    /**客户端发给服务端 */
    ClientToServer = "ClientToServer_Lanuncher",
}