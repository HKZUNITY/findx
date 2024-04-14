import Console from "../../Tools/Console";
import HUDModuleS from "../HUDModule/HUDModuleS";
import ShopData from "../ShopModule/ShopData";
import RankingModuleC from "./RankingModuleC";

export default class RankingModuleS extends ModuleS<RankingModuleC, null> {
    /**储存所有玩家的数据 */
    private playerDataMap: Map<number, PlayerData> = new Map<number, PlayerData>();
    private hudModuleS: HUDModuleS = null;
    private get getHUDModuleS(): HUDModuleS {
        if (this.hudModuleS == null) {
            this.hudModuleS = ModuleService.getModule(HUDModuleS);
        }
        return this.hudModuleS;
    }
    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {
        Console.error("[RankingModuleC-onStart]");
        this.registerEvents();
    }

    /**注册事件 */
    private registerEvents(): void {
        Event.addClientListener("RefreshMaxHeight", this.refreshMaxHeight.bind(this));
    }

    @Decorator.noReply()
    public net_A(v: number): void {
        if (!this.playerDataMap.has(this.currentPlayerId)) return;
        let playerData = this.playerDataMap.get(this.currentPlayerId);
        playerData.maxHeight += v;
        this.sendPlayersData();
    }

    @Decorator.noReply()
    public net_B(v: number): void {
        if (!this.playerDataMap.has(this.currentPlayerId)) return;
        let playerData = this.playerDataMap.get(this.currentPlayerId);
        playerData.killCount += v;
        this.sendPlayersData();
    }

    @Decorator.noReply()
    public net_C(v: number): void {
        if (!this.playerDataMap.has(this.currentPlayerId)) return;
        let playerData = this.playerDataMap.get(this.currentPlayerId);
        playerData.score += v;
        this.getHUDModuleS.setPlayerLevel(this.currentPlayerId, playerData.score);
        this.sendPlayersData();
    }

    /**刷新历史最高 */
    private refreshMaxHeight(player: mw.Player, recordMaxHight: number): void {
        let playerId = player.playerId;
        if (!this.playerDataMap.has(playerId)) return;
        let playerData = this.playerDataMap.get(playerId);
        playerData.maxHeight = recordMaxHight;
        DataCenterS.getData(player, ShopData).saveMaxHeight(recordMaxHight);
        this.sendPlayersData();
    }

    /**刷新击杀人数 */
    public refreshKillCount(player: mw.Player, killCount: number, isBoss: boolean = false): void {
        let playerId = player.playerId;
        Console.error("[击杀playerId] = " + playerId);
        if (!this.playerDataMap.has(playerId)) return;
        let playerData = this.playerDataMap.get(playerId);
        playerData.killCount += killCount;
        DataCenterS.getData(player, ShopData).saveKillCount(playerData.killCount);
        this.sendPlayersData();
        if (isBoss) this.hudModuleS.playerKillNpc(player.playerId, this.getNameByUserId(player.playerId));
    }

    /**刷新收集分数 */
    public refreshScore(player: mw.Player, score: number): void {
        let playerId = player.playerId;
        Console.error("[冲击的PlayerId] = " + playerId);
        if (!this.playerDataMap.has(playerId)) return;
        let playerData = this.playerDataMap.get(playerId);
        playerData.score += score;
        DataCenterS.getData(player, ShopData).saveLevel(playerData.score);
        this.getHUDModuleS.setPlayerLevel(playerId, playerData.score);
        this.sendPlayersData();
    }

    /**生命周期方法-进入场景调用(客户端发来的) */
    @Decorator.noReply()
    public net_onEnterScene(playerId: number, playerName: string, score: number, killCount: number, maxHeight: number): void {
        let playerData = new PlayerData();
        playerData.playerName = playerName;
        playerData.score = score;
        playerData.killCount = killCount;
        playerData.maxHeight = maxHeight;
        this.playerDataMap.set(playerId, playerData);
        this.sendPlayersData();
        this.getHUDModuleS.setPlayerLifeNickName(playerId, playerName, playerData.score);
    }

    /**生命周期方法-玩家离开房间 */
    protected onPlayerLeft(player: mw.Player): void {
        Console.error("[playerId：" + player.playerId + "的玩家离开房间]");
        let playerId = player.playerId;
        if (!this.playerDataMap.has(playerId)) return;
        this.playerDataMap.delete(playerId);
        this.sendPlayersData();
    }

    /**发送给所有客户端所有玩家的数据 */
    private sendPlayersData(): void {
        let playerIds: number[] = [];
        let playerNames: string[] = [];
        let maxHeights: number[] = [];
        let killCounts: number[] = [];
        let scores: number[] = [];
        this.playerDataMap.forEach((playerData: PlayerData, playerId: number) => {
            playerIds.push(playerId);
            playerNames.push(playerData.playerName);
            maxHeights.push(playerData.maxHeight);
            killCounts.push(playerData.killCount);
            scores.push(playerData.score);
        });
        this.getAllClient().net_receivePlayersData(playerIds, playerNames, maxHeights, killCounts, scores);
    }

    public getNamesByUserId(playerId1: number, playerId2: number): string[] {
        if (this.playerDataMap.has(playerId1) && this.playerDataMap.has(playerId2)) {
            return [this.playerDataMap.get(playerId1).playerName, this.playerDataMap.get(playerId2).playerName];
        }
        return null;
    }

    public getNameByUserId(playerId: number): string {
        if (this.playerDataMap.has(playerId)) {
            return this.playerDataMap.get(playerId).playerName;
        }
        return null;
    }
}

/**数据（玩家） */
export class PlayerData {
    public playerId: number = null;
    public playerName: string = "";
    public maxHeight: number = 0;
    public killCount: number = 0;
    public score: number = 0;
}