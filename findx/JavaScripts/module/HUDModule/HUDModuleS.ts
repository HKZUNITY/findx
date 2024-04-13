import { SpawnManager } from '../../Modified027Editor/ModifiedSpawn';
import { GeneralManager, } from '../../Modified027Editor/ModifiedStaticAPI';
import BaseAI from '../../Prefabs/AI敌人/Script/BaseAI';
import { PrefabEvent } from "../../Prefabs/PrefabEvent";
import Console from "../../Tools/Console";
import NPCBar from "../NPCModule/NPCBar";
import RankingModuleS from '../RankingModule/RankingModuleS';
import HUDDate from "./HUDDate";
import HUDModuleC from "./HUDModuleC";
import Lifebar from "./ui/Lifebar";

export default class HUDModuleS extends ModuleS<HUDModuleC, HUDDate> {
    private rankingModuleS: RankingModuleS = null;
    private get getRankingModuleS(): RankingModuleS {
        if (this.rankingModuleS == null) {
            this.rankingModuleS = ModuleService.getModule(RankingModuleS);
        }
        return this.rankingModuleS;
    }

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {
    }

    /**生命周期方法-玩家进入游戏(客户端已就绪，数据就绪，前后端可正常通信) */
    protected onPlayerEnterGame(player: mw.Player): void {
        this.setPlayerLifeData(player);
        /**-----[玩家进入游戏同步其他玩家的翅膀]----- */
        let wingPlayerIds: number[] = [];
        let wingIds: number[] = [];
        if (this.wingMap.size > 0) {
            this.wingMap.forEach((wingId: number, wingPlayerId: number) => {
                wingPlayerIds.push(wingPlayerId);
                wingIds.push(wingId);
            });
        }
        /**-----[玩家进入游戏同步其他玩家的翅膀]----- */

        /**-----[玩家进入游戏同步其他玩家的拖尾特效]----- */
        let tailEffectplayerIds: number[] = [];
        let tailEffectIds: number[] = [];
        if (this.wingTailEffect.size > 0) {
            this.wingTailEffect.forEach((tailEffectId: number, tailEffectplayerId: number) => {
                tailEffectplayerIds.push(tailEffectplayerId);
                tailEffectIds.push(tailEffectId);
            });
        }
        /**-----[玩家进入游戏同步其他玩家的拖尾特效]----- */

        /**-----[玩家进入游戏同步其他玩家的武器]----- */
        let weaponPlayerIds: number[] = [];
        let weaponIds: number[] = [];
        if (this.weaponIdMap.size > 0) {
            this.weaponIdMap.forEach((weaponId: number, weaponPlayerId: number) => {
                weaponPlayerIds.push(weaponPlayerId);
                weaponIds.push(weaponId);
            });
        }
        /**-----[玩家进入游戏同步其他玩家的武器]----- */
        if (wingPlayerIds.length == 0
            && tailEffectplayerIds.length == 0
            && weaponPlayerIds.length == 0) return;
        this.getClient(player).net_enterGameSnycData(
            wingPlayerIds, wingIds,
            tailEffectplayerIds, tailEffectIds,
            weaponPlayerIds, weaponIds
        );
    }

    /**生命周期方法-玩家离开房间 */
    protected onPlayerLeft(player: mw.Player): void {
        let playerId = player.playerId;
        this.deletePlayerLifeData(playerId);
        this.deleteWingMap(playerId);
        this.deleteTailEffectMap(playerId);
        this.deleteWeaponMap(playerId);
        this.getAllClient().net_exitGameSyncData(playerId);
    }

    //#region 翅膀
    /**---------------------------------【翅膀】--------------------------------- */
    /**储存房间内所有玩家的翅膀 */
    private wingMap: Map<number, number> = new Map<number, number>();

    /**拾取翅膀发给所有客户端 */
    public net_pickWing(id: number): void {
        this.wingMap.set(this.currentPlayerId, id);
        this.getAllClient().net_pickUpWing(this.currentPlayerId, id);
    }

    /**玩家离开房间删除翅膀数据 */
    private deleteWingMap(playerId: number): void {
        if (!this.wingMap.has(playerId)) return;
        this.wingMap.delete(playerId);
    }
    /**---------------------------------【翅膀】--------------------------------- */
    //#endregion

    //#region 拖尾特效
    /**------------------------------【拖尾特效】------------------------------*/
    /**储存房间内所有玩家的拖尾特效 */
    private wingTailEffect: Map<number, number> = new Map<number, number>();

    /**拾取拖尾特效发给所有客户端 */
    public net_pickTailEffect(id: number): void {
        this.wingTailEffect.set(this.currentPlayerId, id);
        this.getAllClient().net_pickUpTailEffect(this.currentPlayerId, id);
    }

    /**玩家离开房间删除特效数据 */
    private deleteTailEffectMap(playerId: number): void {
        if (!this.wingTailEffect.has(playerId)) return;
        this.wingTailEffect.delete(playerId);
    }
    /**------------------------------【拖尾特效】------------------------------*/
    //#endregion

    //#region 武器-攻击
    /**------------------------------【武器-攻击】------------------------------*/
    /**存储所有玩家的生命数据 */
    private playerLifeMap: Map<number, PlayerData> = new Map<number, PlayerData>();
    /**设置player的头顶UI姓名 */
    public setPlayerLifeNickName(playerId: number, nickName: string, level: number): void {
        if (!this.playerLifeMap.has(playerId)) return;
        let lifebar = this.playerLifeMap.get(playerId).lifebar;
        lifebar.playerName = nickName;
        lifebar.playerLevel = level;
    }

    /**设置玩家等级 */
    public setPlayerLevel(playerId: number, level: number): void {
        if (!this.playerLifeMap.has(playerId)) return;
        this.playerLifeMap.get(playerId).lifebar.playerLevel = level;
    }

    /**升级 */
    public net_addLevel(): void {
        this.getRankingModuleS.refreshScore(this.currentPlayer, 1);
    }

    public net_addLevel1(): void {
        this.getRankingModuleS.refreshScore(this.currentPlayer, 20);
    }

    public net_addLevel2(): void {
        this.getRankingModuleS.refreshScore(this.currentPlayer, 30);
    }

    public net_addLevel3(lv: number): void {
        this.getRankingModuleS.refreshScore(this.currentPlayer, lv);
    }

    /**设置玩家血量 */
    private setPlayerHp(player: mw.Player, hp: number, addPlayer: mw.Player = null): void {
        let playerId = player.playerId;
        let playerAttackData = this.playerLifeMap.get(playerId);
        if (playerAttackData.isDie) return;
        if (playerAttackData.isWudi) return;
        this.getClient(player).net_FlyText(hp);
        let curHp = playerAttackData.lifebar.hp;
        curHp -= hp;
        if (curHp <= 0) {
            playerAttackData.lifebar.hp = 0;
            playerAttackData.isDie = true;
            if (addPlayer) {
                this.getRankingModuleS.refreshKillCount(addPlayer, 1);
                this.getClient(addPlayer).net_killAch();
            }
            player.character.ragdollEnabled = true;
            this.spawnTombstoneS(player);
            TimeUtil.delaySecond(3).then(() => {
                player.character.ragdollEnabled = false;
                playerAttackData.lifebar.hp = DataCenterS.getData(player, HUDDate).maxHp;
                playerAttackData.isDie = false;
                this.getClient(player).net_rebirthHome();
                playerAttackData.isWudi = true;
                let effectId = GeneralManager.rpcPlayEffectOnPlayer("140173", player, mw.HumanoidSlotType.Root, 0, mw.Vector.zero, mw.Rotation.zero, mw.Vector.one.multiply(2));
                TimeUtil.delaySecond(5).then(() => {
                    playerAttackData.isWudi = false;
                    EffectService.stop(effectId);
                })
            });
        }
        else {
            playerAttackData.lifebar.hp = curHp;
        }
        Console.error("[hp] = " + this.playerLifeMap.get(playerId).lifebar.hp);
    }

    /**生成墓碑（服务端） */
    private spawnTombstoneS(player: mw.Player): void {
        let tombstone: mw.GameObject = null;
        tombstone = SpawnManager.wornSpawn("110950");
        let pos = player.character.worldTransform.position;
        tombstone.worldTransform.position = (new mw.Vector(pos.x, pos.y, pos.z - 110));
        setTimeout(() => {
            tombstone.destroy();
        }, 3 * 1000);
    }

    /**设置玩家生命数据 */
    private async setPlayerLifeData(player: mw.Player): Promise<void> {
        let playerId = player.playerId;
        let playerAttackData = new PlayerData();
        let hpbar = await mw.Script.spawnScript(Lifebar, true, player.character);
        let maxHp = DataCenterS.getData(player, HUDDate).maxHp;
        hpbar.maxHp = maxHp;
        hpbar.hp = maxHp;
        playerAttackData.lifebar = hpbar;
        playerAttackData.isDie = false;
        this.playerLifeMap.set(playerId, playerAttackData);
    }

    /**删除玩家生命数据 */
    private deletePlayerLifeData(playerId: number): void {
        if (!this.playerLifeMap.has(playerId)) return;
        this.playerLifeMap.get(playerId).lifebar.destroy();
        this.playerLifeMap.delete(playerId);
    }

    /**
     * 攻击玩家
     * @param playerIds 被攻击到的玩家ID 
     */
    public net_attackPlayer(playerIds: number[], aiIds: string[], ImpulseValue: number, badValue: number, weaponId: number): void {
        if (aiIds.length != 0) {
            for (let i = 0; i < aiIds.length; ++i) {
                PrefabEvent.PrefabEvtFight.hurt(this.currentPlayer.character.gameObjectId, aiIds[i], badValue);
            }
        }
        if (playerIds.length == 0) return;
        if (this.playerLifeMap.get(this.currentPlayerId).isDie) return;
        let forwardVector = this.currentPlayer.character.worldTransform.getForwardVector();
        let forwardMultiply = forwardVector.multiply(ImpulseValue);

        for (const playerId of playerIds) {
            let player = Player.getPlayer(playerId);
            player.character.addImpulse(forwardMultiply, true);
            this.setPlayerHp(player, badValue, this.currentPlayer);
        }
        this.getAllClient().net_playHitEffect(playerIds, weaponId);
    }

    /**播放攻击动画、特效、音效（服务端同步给所有客户端执行某个客户端的攻击表现） */
    public net_playAniEffSound(weaponId: number): void {
        if (this.playerLifeMap.get(this.currentPlayerId).isDie) return;
        this.getAllClient().net_playAniEffSound(this.currentPlayerId, weaponId);
    }

    /**服务端存储房间内所有玩家所持有的武器数据 */
    private weaponIdMap: Map<number, number> = new Map<number, number>();

    /**拾取武器（广播给所有客户端） */
    public net_pickUpWeapon(id: number): void {
        this.weaponIdMap.set(this.currentPlayerId, id);
        this.getAllClient().net_pickUpWeapon(this.currentPlayerId, id);
    }

    /**玩家离开游戏删除所持有武器数据 */
    private deleteWeaponMap(playerId: number): void {
        if (!this.weaponIdMap.has(playerId)) return;
        this.weaponIdMap.delete(playerId);
    }
    /**------------------------------【武器-攻击】------------------------------*/
    //#endregion

    //#region 玩家属性
    /**设置最大血量 */
    public net_setMaxHp(maxHp: number): void {
        let playerAttackData = this.playerLifeMap.get(this.currentPlayerId);
        playerAttackData.lifebar.maxHp = maxHp;
        this.currentData.saveMaxHp(maxHp);
    }

    /**设置当前血量 */
    public net_setCurHp(curAddHp: number): void {
        let playerAttackData = this.playerLifeMap.get(this.currentPlayerId);
        let maxHp = playerAttackData.lifebar.maxHp;
        let curHp = playerAttackData.lifebar.hp;
        curHp += curAddHp;
        if (curHp >= maxHp) {
            curHp = maxHp;
        }
        playerAttackData.lifebar.hp = curHp;
    }

    /**设置当前攻击力 */
    public net_setCurAttackValue(curAttackValue: number): void {
        this.currentData.saveHurt(curAttackValue);
    }
    //#endregion
}

class PlayerData {
    public lifebar: Lifebar = null;
    public isDie: boolean = false;
    public isWudi: boolean = false
}

class AIData {
    public npcBar: NPCBar = null
    public npc: mw.Character = null;
    public npcAI: BaseAI = null;
    public isDie: boolean = false;
}