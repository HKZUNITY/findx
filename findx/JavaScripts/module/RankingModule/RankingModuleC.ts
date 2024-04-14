import { Notice } from "../../Common/notice/Notice";
import Console from "../../Tools/Console";
import GlobalData from "../../const/GlobalData";
import HUDModuleC from "../HUDModule/HUDModuleC";
import ShopModuleC from "../ShopModule/ShopModuleC";
import RankingModuleS, { PlayerData } from "./RankingModuleS";
import RankingPanel from "./ui/RankingPanel";

export default class RankingModuleC extends ModuleC<RankingModuleS, null> {
    /**主控客户端模块 */
    private hudModuleC: HUDModuleC = null;
    private shopModuleC: ShopModuleC = null;
    /**排行榜UIPanel */
    private rankingPanel: RankingPanel = null;

    /**当前客户端的---获取用户的平台Id */
    private playerId: number = null;
    /**储存所有玩家的数据 */
    private playerDatas: PlayerData[] = [];
    /**当前客户端的数据 */
    private currentPlayerData: PlayerData = null;
    /**排行类型 */
    private rankType: RankType = RankType.Score;
    /**是否可以刷新 */
    private isRefresh: boolean = true;

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {
        Console.error("[RankingModuleC-onStart]");
        this.initData();
        this.registerActions();
    }

    /**初始化数据 */
    private initData(): void {
        this.hudModuleC = ModuleService.getModule(HUDModuleC);
        this.shopModuleC = ModuleService.getModule(ShopModuleC);
        this.rankingPanel = mw.UIService.getUI(RankingPanel);
    }

    /**注册事件 */
    private registerActions(): void {
        this.hudModuleC.onOpenRankingAction.add(() => {
            this.rankingPanel.show();
        });

        this.rankingPanel.onRankTypeAction.add((rankType: RankType) => {
            if (!this.isRefresh) {
                Notice.showDownNotice("小手别点太快哟~");
            }
            this.isRefresh = false;
            TimeUtil.delaySecond(1.5).then(() => {
                this.isRefresh = true;
            });
            this.rankType = rankType;
            this.refreshRanking();
        });

        /**[TEST] */
        mw.InputUtil.onKeyDown(mw.Keys.I, () => {
            this.server.net_A(1);
        });
        mw.InputUtil.onKeyDown(mw.Keys.O, () => {
            this.server.net_B(1);
        });
        mw.InputUtil.onKeyDown(mw.Keys.P, () => {
            this.server.net_C(1);
        });
    }

    /**生命周期方法-进入场景调用 */
    protected onEnterScene(sceneType: number): void {
        TimeUtil.delaySecond(5).then(() => {
            let nickName = AccountService.getNickName();
            this.playerId = this.localPlayerId;
            nickName = (nickName) ? nickName : "playerId:" + this.playerId;
            // this.currentPlayer.character.displayName = nickName;
            let maxHeight = this.shopModuleC.getMaxHeight();
            Event.dispatchToLocal("SyncMaxHeight", maxHeight);
            let lv = this.shopModuleC.getLevel();
            let lvstr = lv.toString();
            if (lvstr.includes('[')) {
                Console.error("[hhhhhhhhhhhhhhhhh]");
                lv = Number(lvstr.split('[')[0]);
            }
            Console.error("lv = " + lv);
            this.server.net_onEnterScene(this.playerId, nickName, lv, this.shopModuleC.getKillCount(), maxHeight);
        });
    }

    /**接收所有玩家数据（服务端发来） */
    public net_receivePlayersData(playerIds: number[], playerNames: string[], maxHeights: number[], killCounts: number[], scores: number[]): void {
        this.playerDatas.length = 0;
        for (let i = 0; i < playerIds.length; ++i) {
            let playerData = new PlayerData();
            playerData.playerId = playerIds[i];
            playerData.playerName = playerNames[i];
            playerData.maxHeight = maxHeights[i];
            playerData.killCount = killCounts[i];
            playerData.score = scores[i];
            this.playerDatas.push(playerData);
            if (playerIds[i] == this.playerId) {
                this.currentPlayerData = playerData;
                this.shopModuleC.playerLevel(this.currentPlayerData.score);
            }
        }
        // Console.error("playerNames " + playerNames);
        this.refreshRanking();
    }

    /**刷新排行榜 */
    private refreshRanking(): void {
        let playerDataCsAndRanking: [number, PlayerData[]] = this.sortPlayerData();
        this.rankingPanel.rerank(playerDataCsAndRanking[1], this.currentPlayerData, playerDataCsAndRanking[0]);
    }

    /**给所有玩家数据排序(返回当前玩家在第几名和前几名玩家的数据) */
    private sortPlayerData(): [number, PlayerData[]] {
        let tmpPlayerDatas: PlayerData[] = [];
        this.playerDatas.sort((a, b) => {
            let ret = -1;
            switch (this.rankType) {
                case RankType.MaxHeight:
                    ret = b.maxHeight - a.maxHeight;
                    break;
                case RankType.KillCount:
                    ret = b.killCount - a.killCount;
                    break;
                case RankType.Score:
                    ret = b.score - a.score;
                    break;
                default:
                    ret = -1;
                    break;
            }
            return ret;
        });
        if (this.playerDatas.length <= GlobalData.rankingNumber) {
            tmpPlayerDatas = this.playerDatas;
        }
        else {
            for (let i = 0; i < GlobalData.rankingNumber; ++i) {
                tmpPlayerDatas.push(this.playerDatas[i]);
            }
        }

        let ranking: number = -1;
        for (let i = 0; i < this.playerDatas.length; ++i) {
            if (this.playerDatas[i].playerId == this.playerId) {
                ranking = i;
                break;
            }
        }
        return [ranking, tmpPlayerDatas];
    }
}

/**排行类型 */
export enum RankType {
    MaxHeight = 1,
    KillCount = 2,
    Score = 3,
}